import { useEffect } from 'react';
import { FaXmark } from 'react-icons/fa6';
import { useCart } from '../context/CartContext';

const CartDrawer = ({ open, onClose, onCheckout, onContinueExploring }) => {
  const { cartItems, cartSummary, removeFromCart } = useCart();

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
        className={`fixed inset-0 z-40 bg-ink/50 backdrop-blur-md transition-opacity duration-300 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-0 z-50 flex w-full max-w-none transform transition-transform duration-500 ease-out md:inset-y-0 md:right-0 md:left-auto md:w-full md:max-w-lg ${
          open
            ? 'translate-y-0 md:translate-x-0'
            : 'translate-y-full md:translate-y-0 md:translate-x-full'
        }`}
        aria-hidden={!open}
        aria-label="Cart drawer"
      >
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-br from-pearl via-white to-slate-50">
          <button
            type="button"
            aria-label="Close cart drawer"
            className="absolute right-6 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-200/60 bg-white/80 text-ink shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:border-ink/30 hover:bg-white"
            onClick={onClose}
          >
            <FaXmark className="h-5 w-5" />
          </button>

          <header className="border-b border-slate-200/60 bg-white/60 px-5 pb-5 pt-12 backdrop-blur-sm sm:px-6 md:pt-10">
            <div className="space-y-2 text-left sm:space-y-3">
              <p className="text-[0.6rem] font-medium uppercase tracking-[0.35em] text-slate-500 sm:text-xs">Collector cart</p>
              <h2 className="font-display text-2xl tracking-tight text-ink sm:text-3xl">Your Collection</h2>
              <p className="hidden text-sm leading-relaxed text-slate-600 sm:block">
                Review your curated capsules, adjust quantities, and proceed to secure checkout.
              </p>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-5 pb-6 pt-5 sm:px-6">
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[0.6rem] font-medium uppercase tracking-[0.35em] text-slate-500 sm:text-xs">
                  {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                </div>
              </div>
              {cartItems.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200/60 bg-white/60 px-5 py-10 text-center backdrop-blur-sm sm:rounded-3xl sm:px-6 sm:py-12">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 sm:mb-4 sm:h-16 sm:w-16">
                    <span className="text-xl sm:text-2xl">🛒</span>
                  </div>
                  <p className="text-[0.6rem] font-medium uppercase tracking-[0.35em] text-slate-400 sm:text-xs">Empty collection</p>
                  <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-600 sm:mt-3 sm:text-sm">
                    Your cart awaits. Explore the gallery to discover your next statement piece.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 sm:space-y-3">
                  {cartItems.map((item) => (
                    <article
                      key={item.id}
                      className="group flex gap-3 rounded-2xl border-2 border-slate-200/60 bg-white/80 p-3 shadow-sm backdrop-blur-sm transition-all hover:border-slate-300/60 hover:shadow-md sm:gap-4 sm:rounded-3xl sm:p-4"
                    >
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24 sm:rounded-2xl">
                        <img
                          src={item.image || item.mainImage || item.variations?.[0] || ''}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
                            <p className="text-[0.55rem] font-medium uppercase tracking-[0.3em] text-slate-500 sm:text-[0.65rem] sm:tracking-[0.4em]">{item.artist}</p>
                            <h3 className="truncate font-display text-base leading-tight tracking-tight text-ink sm:text-lg">{item.title}</h3>
                          </div>
                          <button
                            type="button"
                            className="flex-shrink-0 rounded-lg px-2 py-1 text-[0.6rem] font-medium uppercase tracking-wider text-slate-500 transition-all hover:bg-rose-50 hover:text-rose-600 sm:px-3 sm:py-1.5 sm:text-xs"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="font-display text-lg tracking-tight text-ink sm:text-xl">
                            ${item.price}
                          </p>
                          <p className="text-xs text-slate-500">Digital Download</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </main>

          <footer className="border-t-2 border-slate-200/60 bg-white/80 px-5 pb-6 pt-5 backdrop-blur-sm sm:px-6 sm:pb-8 sm:pt-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-white p-4 sm:p-5">
                <div className="mb-1.5 text-[0.6rem] font-medium uppercase tracking-[0.35em] text-slate-500 sm:mb-2 sm:text-xs">Total</div>
                <p className="font-display text-3xl tracking-tight text-ink sm:text-4xl">${cartSummary.total.toFixed(2)}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:mt-3 sm:text-sm">
                  Tax calculated at checkout. Secure digital delivery included.
                </p>
              </div>
              <div className="space-y-2.5 sm:space-y-3">
                <button
                  type="button"
                  className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-ink to-slate-800 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-ink/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-ink/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 sm:px-6 sm:py-4 sm:text-sm"
                  onClick={() => {
                    onCheckout?.();
                    onClose?.();
                  }}
                  disabled={!cartItems.length}
                >
                  <span className="relative z-10">Proceed to Checkout</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-ink opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
                <button
                  type="button"
                  className="w-full rounded-full border-2 border-slate-200 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-ink transition-all hover:scale-[1.02] hover:border-slate-300 hover:bg-slate-50 sm:px-6 sm:py-4 sm:text-sm"
                  onClick={() => {
                    onContinueExploring?.();
                    onClose?.();
                  }}
                >
                  Continue Exploring
                </button>
              </div>
            </div>
          </footer>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
