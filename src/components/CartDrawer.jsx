import { useEffect } from 'react';
import { FaXmark } from 'react-icons/fa6';
import { useCart } from '../context/CartContext';

const CartDrawer = ({ open, onClose, onCheckout }) => {
  const { cartItems, cartSummary, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform border-l border-white/30 bg-white/95 shadow-[0_25px_80px_rgba(15,23,42,0.35)] transition-transform duration-500 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
        aria-label="Cart drawer"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-mist">Collector cart</p>
              <h2 className="font-display text-2xl text-ink">Selected capsules</h2>
            </div>
            <button
              type="button"
              aria-label="Close cart drawer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-transparent bg-white/80 text-slate-500 shadow-sm transition hover:border-ink/30 hover:text-ink"
              onClick={onClose}
            >
              <FaXmark className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
            {cartItems.length === 0 ? (
              <p className="text-sm text-slate-400">
                Your capsule selection is empty. Browse the gallery to add work.
              </p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-slate-100 bg-white/80 p-4"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-20 w-20 rounded-2xl object-cover shadow-sm"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-mist">{item.artist}</p>
                        <h3 className="font-display text-lg text-ink">{item.title}</h3>
                        <p className="text-sm text-slate-500">${item.price}</p>
                      </div>
                      <button
                        type="button"
                        className="text-xs uppercase tracking-[0.35em] text-slate-400 transition hover:text-rose-500"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-auto flex items-center gap-3 pt-3">
                      <button
                        type="button"
                        className="h-8 w-8 rounded-full border border-slate-200 text-sm font-semibold text-ink transition hover:border-ink"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-semibold text-ink">{item.quantity}</span>
                      <button
                        type="button"
                        className="h-8 w-8 rounded-full border border-slate-200 text-sm font-semibold text-ink transition hover:border-ink"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-slate-100 bg-white/80 px-6 py-6">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Total investment</span>
              <span className="font-display text-2xl text-ink">
                ${cartSummary.total.toFixed(2)}
              </span>
            </div>
            <button
              type="button"
              className="mt-4 w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-ink/90"
              onClick={() => {
                onCheckout?.();
                onClose?.();
              }}
              disabled={!cartItems.length}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
