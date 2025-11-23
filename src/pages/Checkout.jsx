import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orders';
import { recordCapsulePurchase } from '../services/capsules';
import { downloadCapsuleBundle } from '../services/downloads';
import { recordCollectorEmail } from '../services/collectors';

const Checkout = () => {
  const { cartItems, cartSummary, clearCart } = useCart();
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [confirmedEmail, setConfirmedEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState({ fullName: '', email: '' });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
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
      subtotal: cartSummary.subtotal,
      taxes: cartSummary.taxes,
      total: cartSummary.total,
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
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-[0.9fr,1.1fr]">
        <section className="glass-panel rounded-[32px] border border-slate-200/50 p-8 shadow-frame">
          <h2 className="font-display text-3xl text-ink">Order Summary</h2>
          <div className="mt-6 space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-sm text-slate-500">No capsules selected.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm text-slate-600">
                  <div>
                    <p className="font-medium text-ink">{item.title}</p>
                    <p className="text-mist">Qty: {item.quantity}</p>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
          <div className="mt-8 space-y-2 border-t border-slate-200 pt-4 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>${cartSummary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Taxes</span>
              <span>${cartSummary.taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-ink">
              <span>Total</span>
              <span>${cartSummary.total.toFixed(2)}</span>
            </div>
          </div>
        </section>
        
        <section className="glass-panel rounded-[32px] border border-slate-200/50 p-8 shadow-frame">
          <h2 className="font-display text-3xl text-ink">
            {orderComplete ? 'Order Complete' : 'Secure Checkout'}
          </h2>
          {orderComplete ? (
            <div className="mt-8 space-y-4">
              <p className="text-sm uppercase tracking-[0.4em] text-mist">
                Confirmation
              </p>
              <p className="text-2xl font-medium text-ink">
                Order #{orderId} confirmed — your capsules are secured.
              </p>
              <p className="text-slate-500">
                Your download bundle should begin automatically. We also saved {confirmedEmail || 'your email'} so you can stay in the loop on future drops.
              </p>
            </div>
          ) : (
            <form className="mt-6 space-y-5 text-sm" onSubmit={handleCheckout}>
              {error && <p className="text-sm text-rose-500">{error}</p>}
              <div>
                <label className="text-mist">Full Name</label>
                <input
                  name="fullName"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-ink focus:border-ink focus:outline-none"
                  placeholder="Ava Sullivan"
                  value={formValues.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="text-mist">Email</label>
                <input
                  type="email"
                  name="email"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-ink focus:border-ink focus:outline-none"
                  placeholder="ava@framevist.com"
                  value={formValues.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="text-mist">Card Number</label>
                <input
                  inputMode="numeric"
                  pattern="[0-9 ]{12,19}"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-ink focus:border-ink focus:outline-none"
                  placeholder="4242 4242 4242 4242"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!cartItems.length || submitting}
              >
                {submitting ? 'Processing…' : 'Complete Order'}
              </button>
              {!cartItems.length && (
                <p className="text-center text-xs uppercase tracking-[0.4em] text-mist">
                  Add capsules before checking out
                </p>
              )}
            </form>
          )}
        </section>
      </div>
    </main>
  );
};

export default Checkout;
