import { useState } from 'react';
import { FaEye, FaCartPlus } from 'react-icons/fa6';
import ProductModal from './ProductModal';

const ProductCard = ({ product, onAddToCart }) => {
  const [open, setOpen] = useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const coverImage = product.mainImage || product.image || product.variations?.[0] || '';

  return (
    <article className="group glass-panel relative flex flex-col overflow-hidden rounded-[28px] border border-white/30 bg-white/70 shadow-frame transition duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-ink/10">
      <div
        className="relative w-full cursor-pointer overflow-hidden bg-slate-100"
        onClick={openModal}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openModal();
          }
        }}
        aria-haspopup="dialog"
        aria-label={`View ${product.title}`}
      >
        <img
          src={coverImage}
          alt={product.title}
          className="block w-full h-auto object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent opacity-0 transition group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5">
        <div className="space-y-1.5 sm:space-y-2">
          <p className="text-[0.65rem] sm:text-xs uppercase tracking-[0.35em] text-mist">{product.artist}</p>
          <h3 className="font-display text-xl sm:text-2xl text-ink">{product.title}</h3>
        </div>
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-display text-lg sm:text-xl text-ink">${product.price}</span>
            <p className="text-xs uppercase tracking-wider text-slate-400">Digital Art</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-600 backdrop-blur-sm transition-all hover:border-ink hover:bg-ink hover:text-white"
              onClick={(event) => {
                event.preventDefault();
                openModal();
              }}
              aria-haspopup="dialog"
              aria-label="View capsule details"
            >
              <FaEye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">View</span>
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-ink/90"
              onClick={(event) => {
                event.preventDefault();
                onAddToCart({ ...product, image: coverImage });
              }}
              aria-label="Add to cart"
            >
              <FaCartPlus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>
      </div>
      {open && (
        <ProductModal
          product={product}
          onClose={closeModal}
          onAddToCart={() => {
            onAddToCart({ ...product, image: coverImage });
            closeModal();
          }}
        />
      )}
    </article>
  );
};

export default ProductCard;
