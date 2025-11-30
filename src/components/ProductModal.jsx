import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaLock, FaShareNodes, FaWhatsapp, FaXmark } from 'react-icons/fa6';
import { recordCapsuleView } from '../services/capsules';

const hasNativeShare = () => typeof navigator !== 'undefined' && typeof navigator.share === 'function';
const hasClipboard = () => typeof navigator !== 'undefined' && Boolean(navigator.clipboard);

const DetailBadge = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 shadow-inner backdrop-blur-sm">
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
  const [copiedLink, setCopiedLink] = useState(false);
  const [nativeShareSupported, setNativeShareSupported] = useState(() => hasNativeShare());
  const [clipboardSupported, setClipboardSupported] = useState(() => hasClipboard());

  // Track view when modal opens
  useEffect(() => {
    if (product?.id) {
      recordCapsuleView(product.id).catch(error => {
        console.error('Failed to track view:', error);
      });
    }
  }, [product?.id]);

  useEffect(() => {
    setNativeShareSupported(hasNativeShare());
    setClipboardSupported(hasClipboard());
  }, []);

  const variationSources = Array.from(new Set([heroImage, ...variations].filter(Boolean)));

  const handleThumbnailSelect = (imageUrl) => {
    setActiveImage(imageUrl);
  };

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return `https://art-capsules-store.web.app/?capsule=${product?.id || ''}`;
    }
    const url = new URL(window.location.href);
    if (product?.id) {
      url.searchParams.set('capsule', product.id);
    }
    return url.toString();
  }, [product?.id]);

  const shareText = useMemo(() => `Collect ${product?.title || 'this capsule'} on Frame Vist`, [
    product?.title,
  ]);

  const shareTargets = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText} — ${shareUrl}`)}`,
      icon: <FaWhatsapp className="h-4 w-4" aria-hidden="true" />,
    },
  ];

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: product?.title, text: shareText, url: shareUrl });
      } catch (shareError) {
        console.warn('User dismissed native share', shareError);
      }
    } else {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    }
  };

  const handleCopyLink = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.warn('Unable to copy link', err);
    }
  };

  const SharePanel = ({ className = '' }) => (
    <div className={`space-y-3 rounded-3xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-sm ${className}`}>
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-mist">
        <span>Share capsule</span>
        <span className={`text-[0.55rem] ${copiedLink ? 'text-emerald-600' : 'text-slate-400'}`}>
          {copiedLink ? 'Link copied' : 'Live now'}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleNativeShare}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-slate-600 backdrop-blur-sm transition hover:border-ink hover:bg-white hover:text-ink"
          aria-label={nativeShareSupported ? 'Open device share sheet' : 'Copy link via quick share fallback'}
          title={nativeShareSupported ? 'Open your device share sheet' : 'Copies the capsule link on this device'}
        >
          <FaShareNodes className="h-3.5 w-3.5" aria-hidden="true" />
          {nativeShareSupported ? 'Quick share' : 'Copy link'}
        </button>
        {shareTargets.map((target) => (
          <a
            key={target.id}
            href={target.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-slate-600 backdrop-blur-sm transition hover:border-ink hover:bg-white hover:text-ink"
          >
            {target.icon}
            {target.label}
          </a>
        ))}
        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 rounded-full border border-dashed border-slate-200 bg-white/80 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500 backdrop-blur-sm transition hover:border-ink/50 hover:bg-white hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!clipboardSupported}
          aria-disabled={!clipboardSupported}
          title={clipboardSupported ? 'Copy capsule link to clipboard' : 'Clipboard unavailable in this browser'}
        >
          Copy link
        </button>
      </div>
    </div>
  );

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
          className="absolute right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-ink/80 text-white shadow-lg shadow-ink/30 backdrop-blur-sm transition-all hover:scale-110 hover:bg-ink sm:right-6 sm:top-6"
          onClick={onClose}
        >
          <FaXmark className="h-4 w-4" />
        </button>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white via-white/80 to-transparent sm:hidden" />
        <div className="flex h-full flex-col gap-6 overflow-y-auto p-6 pt-16 sm:gap-8 sm:p-8 sm:pt-8 md:grid md:grid-cols-[1.1fr,0.9fr]">
          <div className="md:sticky md:top-0 md:self-start md:max-h-[calc(90vh-4rem)]">
            <div className="flex flex-col gap-6">
              <figure
                className="relative w-full flex-shrink-0 overflow-hidden rounded-[28px] bg-slate-100 shadow-lg md:rounded-[32px]"
                style={{ aspectRatio: aspectRatioValue, minHeight: '280px' }}
              >
                <img
                  src={activeImage || heroImage}
                  alt={product.title}
                  className="absolute inset-0 h-full w-full object-contain transition duration-700 ease-out hover:scale-105"
                  loading="lazy"
                />
                <figcaption className="sr-only">{product.title}</figcaption>
              </figure>
              <SharePanel className="hidden md:block" />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.4em] text-mist">{product.artist}</p>
              <h3 className="font-display text-5xl leading-[1.1] text-ink">{product.title}</h3>
              <p className="text-base leading-relaxed text-slate-600">{product.description}</p>
              {product.model && (
                <div className="inline-flex flex-wrap gap-2 rounded-full border border-slate-200/70 bg-white/80 px-4 py-1.5 text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">
                  <span>Model</span>
                  <span className="font-semibold text-ink/80">{product.model}</span>
                </div>
              )}
            </div>

            {/* Price and CTA - Moved to top for visibility */}
            <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-[0.4em] text-mist">Price</span>
                <p className="font-display text-4xl text-ink">
                  ${product.price}
                </p>
              </div>
              <button
                type="button"
                className="group relative w-full overflow-hidden rounded-full bg-ink px-6 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
                onClick={onAddToCart}
              >
                Add to Cart
              </button>
              <p className="text-center text-xs uppercase tracking-[0.35em] text-mist">
                Collector proof · Limited digital edition
              </p>
            </div>
            {product.prompt && (
              <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-br from-white/95 via-white/80 to-slate-50/60 p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-ink text-white shadow-lg shadow-ink/30">
                    <FaLock className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-mist">Creator Prompt</p>
                      <p className="text-xs text-slate-400">Unlocks after purchase</p>
                    </div>
                    <p className="relative rounded-2xl border border-dashed border-slate-200/80 bg-white/70 p-4 text-sm leading-relaxed text-slate-500">
                      <span className="block select-none text-slate-500/80 blur-sm">
                        {product.prompt}
                      </span>
                      <span className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-gradient-to-r from-white/80 via-white/40 to-white/80" aria-hidden="true" />
                    </p>
                  </div>
                </div>
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
              <DetailBadge label="Model" value={product.model || 'Not specified'} />
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
                        className={`flex-shrink-0 rounded-2xl border-2 p-1.5 transition-all hover:scale-105 ${
                          isActive ? 'border-ink bg-ink/5 shadow-md' : 'border-transparent bg-white/70 hover:border-slate-200'
                        }`}
                        aria-label={`View alternate angle of ${product.title}`}
                      >
                        <img
                          src={imageUrl}
                          alt={`${product.title} preview`}
                          className="h-24 w-24 rounded-xl object-cover shadow-sm"
                          loading="lazy"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Share panel at bottom */}
            <SharePanel className="md:hidden" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProductModal;
