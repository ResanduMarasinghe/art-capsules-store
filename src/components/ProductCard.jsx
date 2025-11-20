import { useState } from 'react';
import ProductModal from './ProductModal';

const ProductCard = ({ product, onAddToCart }) => {
  const [open, setOpen] = useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const coverImage = product.mainImage || product.image || product.variations?.[0] || '';
  const aspectRatioValue = product.aspectRatioValue || '1 / 1';

  return (
    <article className="group glass-panel relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/30 bg-white/70 shadow-frame transition duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-ink/10">
      <div
        className="relative w-full cursor-pointer overflow-hidden bg-slate-100"
        style={{ aspectRatio: aspectRatioValue }}
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
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent opacity-0 transition group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col gap-4 px-6 py-5">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-mist">{product.artist}</p>
          <h3 className="font-display text-2xl text-ink">{product.title}</h3>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-display text-xl text-ink">${product.price}</span>
          <button
            type="button"
            className="rounded-full border border-ink/60 px-5 py-2 text-sm font-semibold text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-white"
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
