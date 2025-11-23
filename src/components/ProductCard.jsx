import { useState } from 'react';
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
        <div className="mt-auto flex items-center justify-between">
          <span className="font-display text-lg sm:text-xl text-ink">${product.price}</span>
          <button
            type="button"
            className="rounded-full border border-ink/60 px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-white whitespace-nowrap"
            onClick={(event) => {
              event.preventDefault();
              openModal();
            }}
            aria-haspopup="dialog"
          >
            View Capsule
          </button>
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
