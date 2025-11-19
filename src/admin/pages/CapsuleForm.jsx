import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GalleryInput from '../components/GalleryInput';
import TagInput from '../components/TagInput';
import ColorPicker from '../components/ColorPicker';
import ResolutionsInput from '../components/ResolutionsInput';
import { createCapsule, fetchCapsuleById, updateCapsule } from '../../services/capsules';
import ImageUploadButton from '../components/ImageUploadButton';

const defaultStats = { views: 0, addedToCart: 0, purchases: 0 };

const gcd = (a, b) => {
  if (!b) return a;
  return gcd(b, a % b);
};

const formatAspectRatioFromDimensions = (width, height) => {
  if (!width || !height) return '';
  const roundedWidth = Math.round(width);
  const roundedHeight = Math.round(height);
  const divisor = gcd(roundedWidth, roundedHeight) || 1;
  const normalizedWidth = Math.max(1, Math.round(roundedWidth / divisor));
  const normalizedHeight = Math.max(1, Math.round(roundedHeight / divisor));
  return `${normalizedWidth}:${normalizedHeight}`;
};

const isLikelyUrl = (value) => /^https?:\/\//i.test(value?.trim() || '');

const withCacheBuster = (url) => {
  if (!url) return '';
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}aspect=${Date.now()}`;
};

const baseState = {
  title: '',
  price: '',
  mainImage: '',
  gallery: [''],
  description: '',
  story: '',
  tags: [],
  mood: '',
  colorPalette: [],
  aspectRatio: '',
  resolutions: [{ label: '', url: '' }],
  prompt: '',
  variations: [''],
  fileType: 'JPG',
  resolution: '',
  published: false,
  stats: defaultStats,
};

const CapsuleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [formState, setFormState] = useState(baseState);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(isEdit);
  const [error, setError] = useState(null);
  const [aspectManuallySet, setAspectManuallySet] = useState(false);
  const [aspectStatus, setAspectStatus] = useState('idle');

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const capsule = await fetchCapsuleById(id);
        setFormState({
          ...baseState,
          ...capsule,
          price: capsule.price ?? '',
          gallery: capsule.gallery && capsule.gallery.length ? capsule.gallery : [''],
          tags: capsule.tags || [],
          colorPalette: capsule.colorPalette || [],
          aspectRatio: capsule.aspectRatio || '',
          prompt: capsule.prompt || '',
          variations: capsule.variations && capsule.variations.length ? capsule.variations : [''],
          resolutions: capsule.resolutions && Object.keys(capsule.resolutions).length
            ? Object.entries(capsule.resolutions).map(([label, url]) => ({ label, url }))
            : [{ label: '', url: '' }],
          stats: capsule.stats || defaultStats,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setInitializing(false);
      }
    };
    load();
  }, [id, isEdit]);

  const title = isEdit ? 'Edit Capsule' : 'Add Capsule';

  const isValid = useMemo(() => {
    return Boolean(
      formState.title.trim() &&
        formState.description.trim() &&
        formState.mainImage.trim() &&
        Number(formState.price) > 0
    );
  }, [formState]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'aspectRatio') {
      setAspectManuallySet(true);
      setAspectStatus(value ? 'manual' : 'manual');
    }

    if (name === 'mainImage') {
      setAspectManuallySet(false);
      setAspectStatus(value ? (isLikelyUrl(value) ? 'detecting' : 'pending') : 'idle');
    }
  };

  useEffect(() => {
    const imageUrl = formState.mainImage.trim();

    if (!imageUrl) {
      if (!aspectManuallySet) {
        setFormState((prev) => ({ ...prev, aspectRatio: '' }));
      }
      setAspectStatus('idle');
      return;
    }

    if (!isLikelyUrl(imageUrl)) {
      setAspectStatus(aspectManuallySet ? 'manual' : 'pending');
      return;
    }

    if (aspectManuallySet) {
      setAspectStatus('manual');
      return;
    }

    let cancelled = false;
    setAspectStatus('detecting');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      const ratio = formatAspectRatioFromDimensions(img.naturalWidth, img.naturalHeight);
      if (ratio) {
        setFormState((prev) => ({ ...prev, aspectRatio: ratio }));
        setAspectStatus('success');
      } else {
        setAspectStatus('error');
      }
    };
    img.onerror = () => {
      if (!cancelled) setAspectStatus('error');
    };
    img.src = withCacheBuster(imageUrl);

    return () => {
      cancelled = true;
    };
  }, [formState.mainImage, aspectManuallySet]);

  const aspectStatusCopy = {
    idle: '',
    pending: 'Awaiting image…',
    detecting: 'Detecting…',
    success: 'Auto-detected',
    error: 'Unable to detect',
    manual: 'Manual override',
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValid) {
      setError('Title, description, main image, and price are required.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      title: formState.title.trim(),
      price: Number(formState.price),
      mainImage: formState.mainImage.trim(),
      gallery: formState.gallery.filter(Boolean),
      description: formState.description.trim(),
      story: formState.story.trim(),
      tags: formState.tags,
      mood: formState.mood.trim(),
      colorPalette: formState.colorPalette,
      aspectRatio: formState.aspectRatio,
      prompt: formState.prompt.trim(),
      variations: formState.variations.filter(Boolean),
      fileType: formState.fileType.trim(),
      resolution: formState.resolution.trim(),
      published: formState.published,
      stats: formState.stats || defaultStats,
      resolutions: formState.resolutions.reduce((acc, entry) => {
        if (entry.label && entry.url) acc[entry.label] = entry.url;
        return acc;
      }, {}),
    };

    try {
      if (isEdit) {
        await updateCapsule(id, payload);
      } else {
        await createCapsule(payload);
      }
      navigate('/admin/capsules');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return <p className="text-sm text-slate-500">Loading capsule…</p>;
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-mist">Capsule</p>
        <h1 className="font-display text-3xl text-ink">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Provide the full context for this curated capsule. Fields map directly to the Frame Vist
          Firestore schema.
        </p>
      </div>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      <section className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.35em] text-mist">Title</span>
          <input
            type="text"
            name="title"
            value={formState.title}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-ink"
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.35em] text-mist">Price (USD)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            name="price"
            value={formState.price}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-ink"
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.35em] text-mist">Main Image</span>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="url"
              name="mainImage"
              value={formState.mainImage}
              onChange={handleChange}
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-ink"
              placeholder="https://cdn.framevist.com/capsule.jpg"
              required
            />
            <ImageUploadButton
              label={formState.mainImage ? 'Replace Upload' : 'Upload Image'}
              onUploadComplete={(url) =>
                setFormState((prev) => ({
                  ...prev,
                  mainImage: url,
                }))
              }
            />
          </div>
          <p className="text-xs text-slate-400">
            Uploads use your unsigned Cloudinary preset and automatically populate the field above.
          </p>
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.35em] text-mist">Primary Resolution</span>
          <input
            type="text"
            name="resolution"
            placeholder="4096x4096"
            value={formState.resolution}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-ink"
          />
        </label>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.35em] text-mist">Description</span>
          <textarea
            name="description"
            rows="3"
            value={formState.description}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-ink"
            required
          />
        </div>
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.35em] text-mist">Story</span>
          <textarea
            name="story"
            rows="3"
            value={formState.story}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-ink"
          />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.35em] text-mist">Mood</span>
          <input
            type="text"
            name="mood"
            value={formState.mood}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-ink"
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.35em] text-mist">
            Aspect Ratio
            {aspectStatusCopy[aspectStatus] && (
              <span className="ml-2 text-[0.55rem] tracking-[0.2em] text-slate-400">
                {aspectStatusCopy[aspectStatus]}
              </span>
            )}
          </span>
          <select
            name="aspectRatio"
            value={formState.aspectRatio}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-ink"
          >
            <option value="">Leave blank</option>
            <option value="1:1">1:1</option>
            <option value="4:3">4:3</option>
            <option value="5:4">5:4</option>
            <option value="3:4">3:4</option>
            <option value="4:5">4:5</option>
            <option value="3:2">3:2</option>
            <option value="2:3">2:3</option>
            <option value="16:9">16:9</option>
            <option value="9:16">9:16</option>
            <option value="2:1">2:1</option>
            <option value="1:2">1:2</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.35em] text-mist">File Type</span>
          <input
            type="text"
            name="fileType"
            value={formState.fileType}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-ink"
          />
        </label>
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.35em] text-mist">Prompt</span>
          <textarea
            name="prompt"
            rows="3"
            value={formState.prompt}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-ink"
          />
        </div>
      </section>

      <GalleryInput
        label="Gallery Images"
        values={formState.gallery}
        onChange={(gallery) => setFormState((prev) => ({ ...prev, gallery }))}
        enableUpload
        uploadLabel="Upload"
      />

      <GalleryInput
        label="Variations"
        placeholder="https://cdn.framevist.com/capsule-variation.jpg"
        values={formState.variations}
        onChange={(variations) => setFormState((prev) => ({ ...prev, variations }))}
        enableUpload
        uploadLabel="Upload"
      />

      <TagInput
        values={formState.tags}
        onChange={(tags) => setFormState((prev) => ({ ...prev, tags }))}
      />

      <ColorPicker
        values={formState.colorPalette}
        onChange={(colorPalette) => setFormState((prev) => ({ ...prev, colorPalette }))}
      />

      <ResolutionsInput
        values={formState.resolutions}
        onChange={(resolutions) => setFormState((prev) => ({ ...prev, resolutions }))}
      />

      <label className="inline-flex items-center gap-3 text-sm text-slate-600">
        <input
          type="checkbox"
          name="published"
          checked={formState.published}
          onChange={handleChange}
          className="h-5 w-5 rounded border-slate-300 text-ink focus:ring-ink"
        />
        <span>Published</span>
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading || !isValid}
          className="rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create capsule'}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-full border border-slate-200 px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CapsuleForm;
