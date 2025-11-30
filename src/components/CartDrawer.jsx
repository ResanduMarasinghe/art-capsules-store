import { useEffect } from 'react';
import { FaXmark } from 'react-icons/fa6';
import { useCart } from '../context/CartContext';

const CartDrawer = ({ open, onClose, onCheckout, onContinueExploring }) => {
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
        className={`fixed inset-0 z-50 flex w-full max-w-none transform bg-white transition-transform duration-500 ease-out md:inset-y-0 md:right-0 md:left-auto md:w-full md:max-w-md md:rounded-l-[32px] md:border-l md:border-white/30 md:bg-white/96 md:shadow-[0_30px_120px_rgba(15,23,42,0.35)] ${
          open
            ? 'translate-y-0 md:translate-x-0'
            : 'translate-y-full md:translate-y-0 md:translate-x-full'
        }`}
        aria-hidden={!open}
        aria-label="Cart drawer"
      >
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-white">
          <button
            type="button"
            aria-label="Close cart drawer"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-ink/80 text-white shadow-lg shadow-ink/30 backdrop-blur-sm transition hover:bg-ink"
            onClick={onClose}
          >
            <FaXmark className="h-4 w-4" />
          </button>

          <header className="border-b border-slate-100 px-6 pb-8 pt-12 sm:px-8 md:pt-10">
            <div className="space-y-3 text-left">
              <p className="text-xs uppercase tracking-[0.35em] text-mist">Collector cart</p>
              <h2 className="font-display text-3xl text-ink">Curate your capsule set</h2>
              <p className="max-w-lg text-sm text-slate-500">
                A focused, gallery-like checkout built for Frame Vist collectors. Adjust capsules, refine
                quantities, and finalize your investment in one calming view.
              </p>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-6 pb-10 pt-6 sm:px-8">
            <section className="space-y-6">
              <div className="mt-2 text-xs uppercase tracking-[0.35em] text-slate-400">
                Inventory
              </div>
              {cartItems.length === 0 ? (
                <div className="glass-panel rounded-3xl border border-dashed border-slate-200 px-5 py-10 text-center">
                  <p className="text-xs uppercase tracking-[0.35em] text-mist">No capsules yet</p>
                  <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
                    Your cart is calm for now. Explore the gallery to add your next statement piece.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <article
                      key={item.id}
                      className="flex gap-4 rounded-[28px] border border-slate-100 bg-white/90 p-4 shadow-sm"
                    >
                      <img
                        src={item.image || item.mainImage || item.variations?.[0] || ''}
                        alt={item.title}
                        className="h-24 w-24 flex-shrink-0 rounded-2xl object-cover"
                      />
                      <div className="flex flex-1 flex-col gap-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-mist">{item.artist}</p>
                            <h3 className="font-display text-xl text-ink">{item.title}</h3>
                            <p className="text-sm text-slate-500">${item.price}</p>
                          </div>
                          <button
                            type="button"
                            className="text-[0.65rem] uppercase tracking-[0.4em] text-slate-400 transition hover:text-rose-500"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              className="h-9 w-9 rounded-full border border-slate-200 text-base font-semibold text-ink transition hover:border-ink"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              −
                            </button>
                            <span className="w-10 text-center font-semibold text-ink">{item.quantity}</span>
                            <button
                              type="button"
                              className="h-9 w-9 rounded-full border border-slate-200 text-base font-semibold text-ink transition hover:border-ink"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <div className="ml-auto text-right">
                            <p className="text-xs uppercase tracking-[0.35em] text-mist">Subtotal</p>
                            <p className="font-display text-lg text-ink">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </main>

          <footer className="border-t border-slate-100 px-6 pb-10 pt-6 sm:px-8">
            <div className="space-y-3 text-sm text-slate-500">
              <div className="text-xs uppercase tracking-[0.35em] text-mist">Total investment</div>
              <p className="font-display text-4xl text-ink">${cartSummary.total.toFixed(2)}</p>
              <p className="max-w-lg text-sm text-slate-500">
                Taxes calculated at checkout. Digital capsules include secured delivery and
                collector-proofing.
              </p>
            </div>
            <div className="mt-8 space-y-4">
              <button
                type="button"
                className="w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-ink/90"
                onClick={() => {
                  onCheckout?.();
                  onClose?.();
                }}
                disabled={!cartItems.length}
              >
                Proceed to Checkout
              </button>
              <button
                type="button"
                className="w-full rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-ink transition hover:border-ink/50"
                onClick={() => {
                  onContinueExploring?.();
                  onClose?.();
                }}
              >
                Continue Exploring
              </button>
            </div>
          </footer>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
