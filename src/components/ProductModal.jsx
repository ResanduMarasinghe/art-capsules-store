import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FaLock, FaXmark } from 'react-icons/fa6';

const DetailBadge = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 shadow-inner">
    <p className="text-[0.6rem] uppercase tracking-[0.4em] text-mist">{label}</p>
    <p className="mt-1 font-display text-lg text-ink">{value || '—'}</p>
  </div>
);

const PaletteSwatch = ({ hex }) => (
  <div className="flex flex-col items-center gap-2 text-xs text-slate-500">
    <span
      className="h-12 w-12 rounded-2xl border border-white/60 shadow-inner"
      style={{ backgroundColor: hex }}
    />
    <span className="font-mono uppercase tracking-[0.25em]">{hex}</span>
  </div>
);

const ProductModal = ({ product, onClose, onAddToCart }) => {
  const heroImage = product.mainImage || product.image || product.variations?.[0] || '';
  const variations = product.variations?.filter(Boolean) || [];
  const colorPalette = product.colorPalette?.filter(Boolean) || [];
  const resolutionEntries = product.resolutions ? Object.entries(product.resolutions) : [];
  const aspectRatioValue = product.aspectRatioValue || '1 / 1';
  const [activeImage, setActiveImage] = useState(heroImage);

  const variationSources = Array.from(new Set([heroImage, ...variations].filter(Boolean)));

  const handleThumbnailSelect = (imageUrl) => {
    setActiveImage(imageUrl);
  };

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
          <figure
            className="relative w-full overflow-hidden rounded-[24px] bg-slate-100 shadow-inner md:rounded-[32px]"
            style={{ aspectRatio: aspectRatioValue }}
          >
            <img
              src={activeImage || heroImage}
              alt={product.title}
              className="absolute inset-0 h-full w-full object-contain transition duration-700 ease-out hover:scale-[1.03]"
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
            {product.prompt && (
              <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white/80 p-4 shadow-inner">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink/90 text-white shadow-lg shadow-ink/30">
                    <FaLock className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[0.65rem] uppercase tracking-[0.35em] text-mist">Creator Prompt</p>
                    <p className="relative text-sm leading-relaxed text-slate-600">
                      <span className="relative block select-none text-slate-500/90 blur-sm">
                        {product.prompt}
                      </span>
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink/70">
                      Purchase to unlock the exact prompt & render settings
                    </p>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/70 via-white/10 to-white/70 backdrop-blur-[2px]" />
              </div>
            )}
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
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailBadge label="Availability" value={product.published ? 'Available now' : 'Coming soon'} />
              <DetailBadge label="Aspect" value={product.aspectRatio || '1:1'} />
              <DetailBadge label="Primary Resolution" value={product.resolution || '—'} />
              <DetailBadge label="File Type" value={product.fileType || 'JPG'} />
            </div>
            {resolutionEntries.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.35em] text-mist">Included Resolutions</p>
                <div className="rounded-3xl border border-slate-100 bg-white/80 p-4">
                  <ul className="space-y-2 text-sm text-slate-600">
                    {resolutionEntries.map(([label, url]) => (
                      <li key={label} className="flex items-center justify-between gap-4">
                        <span className="font-medium text-ink">{label}</span>
                        <span className="text-xs uppercase tracking-[0.35em] text-mist">
                          {url ? 'Secure download post-purchase' : 'Provided on delivery'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {colorPalette.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.35em] text-mist">Color palette</p>
                <div className="flex flex-wrap gap-4">
                  {colorPalette.map((hex) => (
                    <PaletteSwatch key={hex} hex={hex} />
                  ))}
                </div>
              </div>
            )}
            {variationSources.length > 1 && (
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.35em] text-mist">Variations</p>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {variationSources.map((imageUrl) => {
                    const isActive = imageUrl === (activeImage || heroImage);
                    return (
                      <button
                        type="button"
                        key={imageUrl}
                        onClick={() => handleThumbnailSelect(imageUrl)}
                        className={`flex-shrink-0 rounded-2xl border-2 p-1 transition hover:border-ink/40 ${
                          isActive ? 'border-ink bg-ink/5' : 'border-transparent bg-white/70'
                        }`}
                        aria-label={`View alternate angle of ${product.title}`}
                      >
                        <img
                          src={imageUrl}
                          alt={`${product.title} preview`}
                          className="h-24 w-24 rounded-xl object-cover shadow-md"
                          loading="lazy"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
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
