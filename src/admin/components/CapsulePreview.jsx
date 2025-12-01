import { FaLock, FaShareNodes, FaWhatsapp } from 'react-icons/fa6';

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

const CapsulePreview = ({ capsule }) => {
  const heroImage = capsule?.mainImage || '/images/about-visual.jpg';
  const variations = capsule?.variations?.filter(Boolean) || [];
  const colorPalette = capsule?.colorPalette?.filter(Boolean) || [];
  const resolutionEntries = capsule?.resolutions ? Object.entries(capsule.resolutions) : [];
  const aspectRatioValue = capsule?.aspectRatioValue || '1 / 1';
  const statusCopy = capsule?.published ? 'Live capsule' : 'Draft preview';
  const variationSources = Array.from(new Set([heroImage, ...variations].filter(Boolean)));

  const shareTargets = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: <FaWhatsapp className="h-4 w-4" aria-hidden="true" />,
    },
  ];

  const SharePanel = ({ className = '' }) => (
    <div className={`space-y-3 rounded-3xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-sm ${className}`}>
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-mist">
        <span>Share capsule</span>
        <span className="text-[0.55rem] text-slate-400">Preview</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-slate-600 backdrop-blur-sm transition hover:border-ink hover:bg-white hover:text-ink"
          disabled
        >
          <FaShareNodes className="h-3.5 w-3.5" aria-hidden="true" />
          Quick share
        </button>
        {shareTargets.map((target) => (
          <button
            key={target.id}
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-slate-600 backdrop-blur-sm transition hover:border-ink hover:bg-white hover:text-ink"
            disabled
          >
            {target.icon}
            {target.label}
          </button>
        ))}
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-dashed border-slate-200 bg-white/80 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500 backdrop-blur-sm transition hover:border-ink/50 hover:bg-white hover:text-ink"
          disabled
        >
          Copy link
        </button>
      </div>
    </div>
  );

  return (
    <section className="rounded-[32px] border border-slate-200/60 bg-white/70 p-6 shadow-inner">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-mist">Live Preview</p>
          <h3 className="font-display text-2xl text-ink">{capsule?.title || 'Untitled capsule'}</h3>
        </div>
        <span
          className={`rounded-full px-4 py-1 text-[0.6rem] uppercase tracking-[0.35em] ${
            capsule?.published
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              : 'bg-slate-100 text-slate-500 border border-slate-200'
          }`}
        >
          {statusCopy}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-6 md:grid md:grid-cols-[1.1fr,0.9fr]">
        <div className="md:sticky md:top-0 md:self-start">
          <div className="flex flex-col gap-6">
            <figure
              className="relative w-full overflow-hidden rounded-[28px] bg-slate-100 shadow-lg md:rounded-[32px]"
              style={{ aspectRatio: aspectRatioValue, minHeight: '280px' }}
            >
              <img
                src={heroImage}
                alt={capsule?.title || 'Capsule preview'}
                className="absolute inset-0 h-full w-full object-contain"
              />
            </figure>
            <SharePanel className="hidden md:block" />
          </div>
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-mist">{capsule?.artist || 'Frame Vist'}</p>
            <h3 className="font-display text-5xl leading-[1.1] text-ink">{capsule?.title || 'Untitled capsule'}</h3>
            <p className="text-base leading-relaxed text-slate-600">
              {capsule?.description || 'A short description will appear here once provided.'}
            </p>
            {capsule?.model && (
              <div className="inline-flex flex-wrap gap-2 rounded-full border border-slate-200/70 bg-white/80 px-4 py-1.5 text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">
                <span>Model</span>
                <span className="font-semibold text-ink/80">{capsule.model}</span>
              </div>
            )}
          </div>

          {/* Price and CTA */}
          <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-[0.4em] text-mist">Price</span>
              <p className="font-display text-4xl text-ink">
                ${capsule?.price || '—'}
              </p>
            </div>
            <button
              type="button"
              className="group relative w-full overflow-hidden rounded-full bg-ink px-6 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg opacity-70"
              disabled
            >
              Add to Cart
            </button>
            <p className="text-center text-xs uppercase tracking-[0.35em] text-mist">
              Collector proof · Limited digital edition
            </p>
          </div>

          {/* Prompt */}
          {capsule?.prompt && (
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
                      {capsule.prompt}
                    </span>
                    <span className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-gradient-to-r from-white/80 via-white/40 to-white/80" aria-hidden="true" />
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          {capsule?.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {capsule.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200/70 bg-white/70 px-4 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-slate-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {/* Details Grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            <DetailBadge label="Availability" value={capsule?.published ? 'Available now' : 'Coming soon'} />
            <DetailBadge label="Model" value={capsule?.model || 'Not specified'} />
            <DetailBadge label="Aspect" value={capsule?.aspectRatio || '1:1'} />
            <DetailBadge label="Primary Resolution" value={capsule?.resolution || '—'} />
            <DetailBadge label="File Type" value={capsule?.fileType || 'JPG'} />
          </div>

          {/* Resolutions */}
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

          {/* Color Palette */}
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

          {/* Variations */}
          {variationSources.length > 1 && (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-mist">Variations</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {variationSources.map((imageUrl, index) => (
                  <div
                    key={`${imageUrl}-${index}`}
                    className="flex-shrink-0 rounded-2xl border-2 border-transparent bg-white/70 p-1.5"
                  >
                    <img
                      src={imageUrl}
                      alt={`${capsule?.title} preview`}
                      className="h-24 w-24 rounded-xl object-cover shadow-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Share panel at bottom for mobile */}
          <SharePanel className="md:hidden" />
        </div>
      </div>
    </section>
  );
};

export default CapsulePreview;
