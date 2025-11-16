import { useState } from 'react';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cartItems, cartSummary, clearCart } = useCart();
  const [orderComplete, setOrderComplete] = useState(false);

  const handleCheckout = (event) => {
    event.preventDefault();
    if (!cartItems.length) return;
    clearCart();
    setOrderComplete(true);
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
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
                Order Complete — Your Capsule is Prepared.
              </p>
              <p className="text-slate-500">
                A receipt and download certificate has been emailed to you. Feel free to continue curating new capsules anytime.
              </p>
            </div>
          ) : (
            <form className="mt-6 space-y-5 text-sm" onSubmit={handleCheckout}>
              <div>
                <label className="text-mist">Full Name</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-ink focus:border-ink focus:outline-none"
                  placeholder="Ava Sullivan"
                  required
                />
              </div>
              <div>
                <label className="text-mist">Email</label>
                <input
                  type="email"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-ink focus:border-ink focus:outline-none"
                  placeholder="ava@framevist.com"
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
                disabled={!cartItems.length}
              >
                Complete Order
              </button>
              {!cartItems.length && (
                <p className="text-center text-xs uppercase tracking-[0.4em] text-mist">
                  Add capsules before checking out
                </p>
              )}
            </form>
          )}
        </section>
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
      </div>
    </main>
  );
};

export default Checkout;
