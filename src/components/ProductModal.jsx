import { createPortal } from 'react-dom';
import { FaXmark } from 'react-icons/fa6';

const ProductModal = ({ product, onClose, onAddToCart }) => {
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-stretch justify-center px-0 sm:items-center sm:px-8"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="animate-backdrop absolute inset-0 bg-ink/60 backdrop-blur-[18px]"
        onClick={onClose}
      />
      <div
        className="animate-modal-enter glass-panel relative flex h-full w-full max-w-none flex-col overflow-hidden rounded-none border border-white/30 bg-white/98 shadow-none sm:h-auto sm:max-h-[90vh] sm:max-w-5xl sm:rounded-[40px] sm:border-white/40 sm:shadow-[0_30px_120px_rgba(15,23,42,0.25)]"
      >
        <button
          type="button"
          aria-label="Close capsule view"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-ink/80 text-white shadow-lg shadow-ink/30 backdrop-blur-sm transition hover:bg-ink sm:right-6 sm:top-6"
          onClick={onClose}
        >
          <FaXmark className="h-4 w-4" />
        </button>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white via-white/80 to-transparent sm:hidden" />
        <div className="flex h-full flex-col gap-6 overflow-y-auto p-6 sm:gap-8 sm:p-8 md:grid md:grid-cols-[1.1fr,0.9fr]">
          <figure className="relative w-full overflow-hidden rounded-[24px] bg-slate-100 shadow-inner md:rounded-[32px]">
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-cover transition duration-700 ease-out hover:scale-[1.03]"
              loading="lazy"
            />
            <figcaption className="sr-only">{product.title}</figcaption>
          </figure>
          <div className="flex flex-col gap-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-mist">{product.artist}</p>
              <h3 className="font-display text-4xl leading-tight text-ink">{product.title}</h3>
              <p className="text-base leading-relaxed text-slate-600">{product.description}</p>
            </div>
            {product.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200/70 bg-white/70 px-4 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-slate-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="mt-auto space-y-4">
              <p className="font-display text-3xl text-ink">
                ${product.price}
              </p>
              <button
                type="button"
                className="w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-ink/90"
                onClick={onAddToCart}
              >
                Add to Cart
              </button>
              <p className="text-center text-xs uppercase tracking-[0.35em] text-mist">
                Collector proof · Limited digital edition
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProductModal;
