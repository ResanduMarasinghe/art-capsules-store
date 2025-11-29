import { FaBagShopping, FaFacebook, FaInstagram, FaLock, FaShareNodes, FaTwitter } from 'react-icons/fa6';

const CapsulePreview = ({ capsule }) => {
  const heroImage = capsule?.mainImage || '/images/about-visual.jpg';
  const tags = capsule?.tags?.length ? capsule.tags.slice(0, 4) : [];
  const palette = capsule?.colorPalette?.slice(0, 4) || [];
  const statusCopy = capsule?.published ? 'Live capsule' : 'Draft preview';
  const variations = capsule?.variations?.filter(Boolean) || [];
  const hasVariations = variations.length > 0;
  const promptPreview = capsule?.prompt ||
    'Prompt text is locked until purchase. Use this field to store the full creative brief.';
  const metadata = [
    { label: 'Model', value: capsule?.model || 'Not set' },
    { label: 'Aspect', value: capsule?.aspectRatio || '—' },
    { label: 'Primary Resolution', value: capsule?.resolution || '—' },
    {
      label: 'File Type',
      value: capsule?.fileType || 'JPG',
    },
  ];

  const shareTargets = [
    { id: 'twitter', label: 'Twitter', icon: <FaTwitter className="h-3.5 w-3.5" aria-hidden="true" /> },
    { id: 'facebook', label: 'Facebook', icon: <FaFacebook className="h-3.5 w-3.5" aria-hidden="true" /> },
    { id: 'instagram', label: 'Instagram', icon: <FaInstagram className="h-3.5 w-3.5" aria-hidden="true" /> },
  ];

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

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <figure
          className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-slate-50"
          style={{ aspectRatio: capsule?.aspectRatioValue || '4 / 5', minHeight: '280px' }}
        >
          <img
            src={heroImage}
            alt={capsule?.title || 'Capsule preview'}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </figure>
        <div className="space-y-5">
          <p className="text-sm text-slate-500 max-h-32 overflow-hidden">
            {capsule?.description || 'A short description will appear here once provided.'}
          </p>
          <p className="font-display text-3xl text-ink">${capsule?.price || '—'}</p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {palette.length > 0 && (
            <div className="flex items-center gap-3">
              {palette.map((hex) => (
                <span
                  key={hex}
                  className="h-10 w-10 rounded-2xl border border-white/70 shadow-inner"
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
              ))}
            </div>
          )}
          <div className="rounded-3xl border border-slate-100 bg-white/80 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-white">
                <FaLock className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-mist">Prompt preview</p>
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-400">
                  Locked until purchase
                </p>
              </div>
            </div>
            <p className="mt-3 rounded-2xl border border-dashed border-slate-200/80 bg-white/60 p-3 text-sm text-slate-400">
              <span className="block max-h-16 overflow-hidden text-ellipsis blur-sm select-none">{promptPreview}</span>
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {metadata.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3"
              >
                <p className="text-[0.6rem] uppercase tracking-[0.35em] text-mist">{item.label}</p>
                <p className="font-display text-lg text-ink">{item.value}</p>
              </div>
            ))}
          </div>
          {hasVariations && (
              <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-mist">Variations</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {[heroImage, ...variations].slice(0, 6).map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="h-20 w-20 flex-shrink-0 rounded-2xl border border-slate-200/70 bg-slate-50"
                  >
                    <img src={image} alt="Capsule variation" className="h-full w-full rounded-2xl object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.35em] text-mist">Share capsule</p>
            <span className="text-[0.55rem] uppercase tracking-[0.4em] text-slate-400">Demo</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-slate-600"
              disabled
            >
              <FaShareNodes className="h-3.5 w-3.5" aria-hidden="true" />
              Quick share
            </button>
            {shareTargets.map((target) => (
              <button
                key={target.id}
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-slate-600"
                disabled
              >
                {target.icon}
                {target.label}
              </button>
            ))}
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-dashed border-slate-200 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500"
              disabled
            >
              Copy link
            </button>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-slate-50 p-4 text-center shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-mist">Call to action</p>
          <button
            type="button"
            disabled
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white opacity-70"
          >
            <FaBagShopping className="h-4 w-4" aria-hidden="true" />
            Add to Cart
          </button>
          <p className="mt-2 text-xs text-slate-500">
            Preview mirrors the storefront modal. Button interactions are disabled here.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CapsulePreview;
