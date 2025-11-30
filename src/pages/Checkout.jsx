import { useEffect, useMemo, useState } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orders';
import { recordCapsulePurchase } from '../services/capsules';
import { downloadCapsuleBundle } from '../services/downloads';
import { recordCollectorEmail } from '../services/collectors';
import { calculateDiscountAmount, defaultPromoCodes, validatePromoCode } from '../data/promoCodes';
import { fetchPromos } from '../services/promos';

const TAX_RATE = 0.0825;

const Checkout = () => {
  const { cartItems, cartSummary, clearCart } = useCart();
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [confirmedEmail, setConfirmedEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState({ fullName: '', email: '' });
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoFeedback, setPromoFeedback] = useState(null);
  const [promoPool, setPromoPool] = useState(defaultPromoCodes);
  const [promoSyncing, setPromoSyncing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadPromos = async () => {
      setPromoSyncing(true);
      try {
        const remotePromos = await fetchPromos();
        if (isMounted && Array.isArray(remotePromos) && remotePromos.length) {
          setPromoPool(remotePromos);
        }
      } catch (promoError) {
        console.warn('Unable to sync promo codes', promoError);
      } finally {
        if (isMounted) {
          setPromoSyncing(false);
        }
      }
    };
    loadPromos();
    return () => {
      isMounted = false;
    };
  }, []);

  const derivedTotals = useMemo(() => {
    const subtotal = cartSummary.subtotal || 0;
    const discount = appliedPromo ? calculateDiscountAmount(appliedPromo, subtotal) : 0;
    const discountedSubtotal = Math.max(0, subtotal - discount);
    const taxes = discountedSubtotal * TAX_RATE;
    const total = discountedSubtotal + taxes;
    return {
      subtotal,
      discount,
      discountedSubtotal,
      taxes,
      total,
    };
  }, [appliedPromo, cartSummary.subtotal]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyPromo = (event) => {
    event.preventDefault();
    if (!promoInput.trim()) {
      setPromoFeedback({ type: 'error', message: 'Enter a promo code before applying.' });
      return;
    }
    const subtotal = cartSummary.subtotal || 0;
    const preDiscountTotal = subtotal + subtotal * TAX_RATE;
    const result = validatePromoCode(promoInput, subtotal, promoPool, {
      orderTotal: preDiscountTotal,
    });
    if (!result.valid) {
      let message = 'Promo code not recognized.';
      if (result.reason === 'expired') {
        message = 'This promo has expired.';
      } else if (result.reason === 'minimum' && result.promo?.minimumSubtotal) {
        message = `Spend $${result.promo.minimumSubtotal.toFixed(2)} to use this promo.`;
      } else if (result.reason === 'minimum-total' && result.promo?.minimumOrderTotal) {
        message = `Order total must be at least $${result.promo.minimumOrderTotal.toFixed(2)} (including taxes).`;
      }
      setAppliedPromo(null);
      setPromoFeedback({ type: 'error', message });
      return;
    }
    setAppliedPromo(result.promo);
    setPromoFeedback({
      type: 'success',
      message: `${result.promo.label} applied — saved $${result.discount.toFixed(2)}!`,
    });
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoFeedback(null);
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    if (!cartItems.length || submitting) {
      setError('Add capsules to your cart before checking out.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const normalizedItems = cartItems.map((item) => ({
      ...item,
      image: item.image || item.mainImage || item.variations?.[0] || '',
    }));

    const normalizedEmail = formValues.email.trim();

    const orderPayload = {
      customerName: formValues.fullName.trim(),
      customerEmail: normalizedEmail,
      subtotal: derivedTotals.discountedSubtotal,
      taxes: derivedTotals.taxes,
      total: derivedTotals.total,
      discount: derivedTotals.discount,
      promoCode: appliedPromo?.code || null,
      items: normalizedItems,
    };

    try {
      const newOrderId = await createOrder(orderPayload);
      await Promise.all(
        normalizedItems.map((item) => recordCapsulePurchase(item.id, item.quantity))
      );
      const orderWithId = { ...orderPayload, id: newOrderId };
      recordCollectorEmail({
        email: normalizedEmail,
        name: orderPayload.customerName,
        orderId: newOrderId,
      }).catch((collectorError) => {
        console.error('Unable to store collector email', collectorError);
      });
      try {
        await downloadCapsuleBundle(orderWithId);
      } catch (downloadError) {
        console.error('Unable to generate download zip', downloadError);
      }
  clearCart();
  setConfirmedEmail(normalizedEmail);
  setFormValues({ fullName: '', email: '' });
      setOrderId(newOrderId);
      setOrderComplete(true);
    } catch (err) {
      setError(err.message || 'Unable to complete the order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pearl via-white to-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Secure Checkout</p>
          <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">Complete Your Order</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600">
            Finalize your Frame Vist collection with our secure, encrypted checkout process.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr,1.2fr]">
          {/* Order Summary Card */}
          <section className="rounded-[32px] border border-slate-200/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="font-display text-2xl text-ink">Order Summary</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>
            
            <div className="mt-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                  <p className="text-sm text-slate-500">No capsules in your cart yet.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-slate-200">
                      <img 
                        src={item.image || item.mainImage || item.variations?.[0] || ''} 
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-ink">{item.title}</p>
                      <p className="text-xs text-slate-500">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-ink">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>

            {/* Pricing Breakdown */}
            <div className="mt-8 space-y-3 rounded-2xl bg-slate-50/80 p-6">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium">${derivedTotals.subtotal.toFixed(2)}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Promo ({appliedPromo.code})</span>
                  <span className="font-medium">- ${derivedTotals.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-slate-600">
                <span>Taxes (8.25%)</span>
                <span className="font-medium">${derivedTotals.taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-xl font-bold text-ink">
                <span>Total</span>
                <span>${derivedTotals.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code Section */}
            <form className="mt-6 space-y-3" onSubmit={handleApplyPromo}>
              <label className="block text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">
                Promo Code
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(event) => setPromoInput(event.target.value.toUpperCase())}
                  placeholder="FRAMEVIST2025"
                  className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-mono uppercase tracking-wider outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!cartItems.length}
                >
                  Apply
                </button>
              </div>
              {promoFeedback && (
                <p className={`text-xs font-medium ${promoFeedback.type === 'error' ? 'text-rose-500' : 'text-emerald-600'}`}>
                  {promoFeedback.message}
                </p>
              )}
              {promoSyncing && (
                <p className="text-xs uppercase tracking-wider text-slate-400">Syncing promos…</p>
              )}
              {appliedPromo && (
                <button
                  type="button"
                  onClick={handleRemovePromo}
                  className="text-xs font-medium uppercase tracking-wider text-slate-500 underline underline-offset-2 hover:text-rose-500"
                >
                  Remove promo
                </button>
              )}
            </form>
          </section>
        
          {/* Checkout Form Card */}
          <section className="rounded-[32px] border border-slate-200/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm sm:p-8">
            <h2 className="font-display text-2xl text-ink">
              {orderComplete ? '✓ Order Complete' : 'Payment Details'}
            </h2>
            {orderComplete ? (
              <div className="mt-8 space-y-6">
                <div className="rounded-2xl bg-emerald-50 p-6">
                  <p className="text-xs uppercase tracking-[0.4em] text-emerald-600 font-semibold">
                    Confirmation
                  </p>
                  <p className="mt-2 text-2xl font-bold text-ink">
                    Order #{orderId}
                  </p>
                  <p className="mt-3 text-sm text-slate-600">
                    Your capsules are secured and ready for download. We've saved {confirmedEmail || 'your email'} for future updates.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
                  <p className="text-sm text-slate-600">
                    Your download should begin automatically. Check your email for order details and access links.
                  </p>
                </div>
              </div>
            ) : (
              <form className="mt-6 space-y-6" onSubmit={handleCheckout}>
                {error && (
                  <div className="rounded-xl bg-rose-50 border border-rose-200 p-4">
                    <p className="text-sm font-medium text-rose-600">{error}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">
                    Full Name
                  </label>
                  <input
                    name="fullName"
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                    placeholder="Ava Sullivan"
                    value={formValues.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                    placeholder="ava@framevist.com"
                    value={formValues.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">
                    Card Number
                  </label>
                  <input
                    inputMode="numeric"
                    pattern="[0-9 ]{12,19}"
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 font-mono text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                    placeholder="4242 4242 4242 4242"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">
                      Expiry Date
                    </label>
                    <input
                      placeholder="MM / YY"
                      className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 font-mono text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">
                      CVC
                    </label>
                    <input
                      inputMode="numeric"
                      pattern="[0-9]{3,4}"
                      placeholder="123"
                      className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 font-mono text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-ink to-slate-800 px-6 py-4 text-base font-bold uppercase tracking-wider text-white shadow-xl transition hover:shadow-2xl hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                  disabled={!cartItems.length || submitting}
                >
                  {submitting ? 'Processing Order…' : `Complete Order · $${derivedTotals.total.toFixed(2)}`}
                </button>

                {!cartItems.length && (
                  <p className="text-center text-xs uppercase tracking-[0.4em] text-slate-400">
                    Add capsules to your cart first
                  </p>
                )}

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-center text-xs text-slate-500">
                    🔒 Secure checkout powered by Frame Vist. Your payment information is encrypted and never stored.
                  </p>
                </div>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
