import { useEffect, useMemo, useState } from 'react';
import { FaCheck, FaPause } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';
import TagInput from '../components/TagInput';
import ModelInput from '../components/ModelInput';
import ColorPicker from '../components/ColorPicker';
import ResolutionsInput from '../components/ResolutionsInput';
import VariationsInput from '../components/VariationsInput';
import {
  createCapsule,
  fetchCapsuleById,
  fetchCapsules,
  updateCapsule,
} from '../../services/capsules';
import ImageUploadButton from '../components/ImageUploadButton';
import { fetchTags } from '../../services/tags';

const defaultStats = { views: 0, addedToCart: 0, purchases: 0 };

const ASPECT_RATIO_OPTIONS = [
  '1:1',
  '4:3',
  '5:4',
  '3:4',
  '4:5',
  '3:2',
  '2:3',
  '16:9',
  '9:16',
  '2:1',
  '1:2',
];

const STANDARD_RATIOS = ASPECT_RATIO_OPTIONS.map((ratio) => {
  const [w, h] = ratio.split(':').map(Number);
  return { label: ratio, value: w / h };
});

const ASPECT_STATUS_COPY = {
  idle: '',
  pending: 'Awaiting image…',
  detecting: 'Detecting…',
  success: 'Auto-detected',
  error: 'Unable to detect',
  manual: 'Manual override',
};

const RESOLUTION_STATUS_COPY = {
  idle: '',
  pending: 'Awaiting image…',
  detecting: 'Detecting…',
  success: 'Auto-detected',
  error: 'Unable to detect',
  manual: 'Manual override',
};

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

const evaluateAspectConfidence = (width, height) => {
  if (!width || !height) return null;
  const ratioValue = width / height;
  let bestMatch = { label: null, diff: Number.POSITIVE_INFINITY };
  STANDARD_RATIOS.forEach((candidate) => {
    const diff = Math.abs(candidate.value - ratioValue);
    if (diff < bestMatch.diff) {
      bestMatch = { label: candidate.label, diff };
    }
  });
  const diff = bestMatch.diff;
  let level = 'approximate';
  if (diff <= 0.01) {
    level = 'excellent';
  } else if (diff <= 0.03) {
    level = 'good';
  }
  return {
    level,
    match: bestMatch.label,
    ratioValue: Number(ratioValue.toFixed(3)),
    diff: Number(diff.toFixed(3)),
  };
};

const isLikelyUrl = (value) => /^https?:\/\//i.test(value?.trim() || '');

const computeDetectionStatus = (value) => {
  if (!value?.trim()) return 'idle';
  return isLikelyUrl(value) ? 'detecting' : 'pending';
};

const withCacheBuster = (url) => {
  if (!url) return '';
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}aspect=${Date.now()}`;
};

const guessFileTypeFromUrl = (url = '') => {
  if (!url) return '';
  const match = url.match(/\.([a-zA-Z0-9]{2,5})(?:\?|$)/);
  if (!match) return '';
  const ext = match[1].toUpperCase();
  if (ext === 'JPEG') return 'JPG';
  if (ext === 'WEBP') return 'WEBP';
  if (ext === 'PNG') return 'PNG';
  if (ext === 'JPG' || ext === 'HEIC' || ext === 'TIFF') return ext;
  return ext.slice(0, 4);
};

const baseState = {
  title: '',
  price: '',
  mainImage: '',
  description: '',
  tags: [],
  model: '',
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

const RequiredMark = () => (
  <span className="ml-1 inline-flex items-center">
    <span className="text-base font-semibold leading-none text-rose-500" aria-hidden="true">
      *
    </span>
    <span className="sr-only">required</span>
  </span>
);

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
  const [aspectConfidence, setAspectConfidence] = useState(null);
  const [resolutionStatus, setResolutionStatus] = useState('idle');
  const [resolutionManuallySet, setResolutionManuallySet] = useState(false);
  const [detectedResolution, setDetectedResolution] = useState('');
  const [fileTypeManuallySet, setFileTypeManuallySet] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const capsule = await fetchCapsuleById(id);
        const variationSources = capsule.variations?.length ? capsule.variations : [''];
        setFormState({
          ...baseState,
          ...capsule,
          price: capsule.price ?? '',
          tags: capsule.tags || [],
          model: capsule.model || '',
          colorPalette: capsule.colorPalette || [],
          aspectRatio: capsule.aspectRatio || '',
          prompt: capsule.prompt || '',
          variations: variationSources,
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

  useEffect(() => {
    let cancelled = false;
    const loadMetadata = async () => {
      try {
        const [docs, tags] = await Promise.all([fetchCapsules(), fetchTags()]);
        if (cancelled) return;
        const modelSet = new Set();
        docs.forEach((capsule) => {
          if (capsule.model) {
            modelSet.add(capsule.model);
          }
        });
        setAvailableTags(tags);
        setAvailableModels(Array.from(modelSet).sort((a, b) => a.localeCompare(b)));
      } catch (err) {
        console.warn('Unable to load tag/model suggestions', err);
      }
    };
    loadMetadata();
    return () => {
      cancelled = true;
    };
  }, []);

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

    if (name === 'fileType') {
      const hasValue = Boolean(value.trim());
      setFileTypeManuallySet(hasValue);
      if (!hasValue) {
        const guess = guessFileTypeFromUrl(formState.mainImage);
        if (guess) {
          setFormState((prev) => ({ ...prev, fileType: guess }));
        }
      }
    }

    if (name === 'aspectRatio') {
      const hasValue = Boolean(value);
      setAspectManuallySet(hasValue);
      setAspectStatus(hasValue ? 'manual' : 'idle');
      setAspectConfidence(null);
    }

    if (name === 'mainImage') {
      const nextStatus = computeDetectionStatus(value);
      setAspectManuallySet(false);
      setAspectStatus(nextStatus);
      setAspectConfidence(null);
      setResolutionManuallySet(false);
      setResolutionStatus(nextStatus);
      setDetectedResolution('');
      if (!fileTypeManuallySet) {
        const guess = guessFileTypeFromUrl(value);
        if (guess) {
          setFormState((prev) => ({ ...prev, fileType: guess }));
        }
      }
    }

    if (name === 'resolution') {
      const hasValue = Boolean(value);
      setResolutionManuallySet(hasValue);
      setResolutionStatus(hasValue ? 'manual' : 'idle');
    }
  };

  useEffect(() => {
    const imageUrl = formState.mainImage.trim();

    if (!imageUrl) {
      if (!aspectManuallySet) {
        setFormState((prev) => ({ ...prev, aspectRatio: '' }));
      }
      if (!resolutionManuallySet) {
        setFormState((prev) => ({ ...prev, resolution: '' }));
      }
      setAspectConfidence(null);
      setDetectedResolution('');
      setAspectStatus('idle');
      setResolutionStatus('idle');
      return;
    }

    if (!isLikelyUrl(imageUrl)) {
      setAspectStatus(aspectManuallySet ? 'manual' : 'pending');
      setResolutionStatus(resolutionManuallySet ? 'manual' : 'pending');
      return;
    }

    if (aspectManuallySet && resolutionManuallySet) {
      setAspectStatus('manual');
      setResolutionStatus('manual');
      return;
    }

    let cancelled = false;
    setAspectStatus(aspectManuallySet ? 'manual' : 'detecting');
    setResolutionStatus(resolutionManuallySet ? 'manual' : 'detecting');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      const { naturalWidth, naturalHeight } = img;

      if (!aspectManuallySet) {
        const ratio = formatAspectRatioFromDimensions(naturalWidth, naturalHeight);
        if (ratio) {
          setFormState((prev) => ({ ...prev, aspectRatio: ratio }));
          setAspectStatus('success');
          setAspectConfidence(evaluateAspectConfidence(naturalWidth, naturalHeight));
        } else {
          setAspectStatus('error');
          setAspectConfidence(null);
        }
      }

      const detected = `${Math.round(naturalWidth)}x${Math.round(naturalHeight)}`;
      setDetectedResolution(detected);

      if (!resolutionManuallySet) {
        setFormState((prev) => ({ ...prev, resolution: detected }));
        setResolutionStatus('success');
      }
    };
    img.onerror = () => {
      if (cancelled) return;
      if (!aspectManuallySet) {
        setAspectStatus('error');
        setAspectConfidence(null);
      }
      if (!resolutionManuallySet) {
        setResolutionStatus('error');
      }
      setDetectedResolution('');
    };
    img.src = withCacheBuster(imageUrl);

    return () => {
      cancelled = true;
    };
  }, [formState.mainImage, aspectManuallySet, resolutionManuallySet]);

  useEffect(() => {
    if (fileTypeManuallySet) return;
    const guess = guessFileTypeFromUrl(formState.mainImage);
    if (!guess) return;
    setFormState((prev) => {
      if (prev.fileType === guess) return prev;
      return { ...prev, fileType: guess };
    });
  }, [formState.mainImage, fileTypeManuallySet]);

  const aspectStatusMessage = useMemo(() => {
    if (aspectStatus === 'success' && aspectConfidence) {
      const levelCopy = {
        excellent: 'High confidence',
        good: 'Good confidence',
        approximate: 'Approximate match',
      }[aspectConfidence.level];
      const matchCopy = aspectConfidence.match ? ` · near ${aspectConfidence.match}` : '';
      return `${ASPECT_STATUS_COPY.success} · ${levelCopy}${matchCopy}`;
    }
    return ASPECT_STATUS_COPY[aspectStatus];
  }, [aspectStatus, aspectConfidence]);

  const resolutionStatusMessage = useMemo(() => {
    if (resolutionStatus === 'success' && detectedResolution) {
      return `${RESOLUTION_STATUS_COPY.success} · ${detectedResolution.replace('x', ' × ')}`;
    }
    return RESOLUTION_STATUS_COPY[resolutionStatus];
  }, [resolutionStatus, detectedResolution]);

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
      description: formState.description.trim(),
      tags: formState.tags,
  model: formState.model.trim(),
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
          <span className="inline-flex items-center text-xs uppercase tracking-[0.35em] text-mist">
            Title
            <RequiredMark />
          </span>
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
          <span className="inline-flex items-center text-xs uppercase tracking-[0.35em] text-mist">
            Price (USD)
            <RequiredMark />
          </span>
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
          <span className="inline-flex items-center text-xs uppercase tracking-[0.35em] text-mist">
            Main Image
            <RequiredMark />
          </span>
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
          <span className="text-xs uppercase tracking-[0.35em] text-mist">
            Primary Resolution
            {resolutionStatusMessage && (
              <span className="ml-2 text-[0.55rem] tracking-[0.2em] text-slate-400">
                {resolutionStatusMessage}
              </span>
            )}
          </span>
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

      <section className="space-y-2">
        <span className="inline-flex items-center text-xs uppercase tracking-[0.35em] text-mist">
          Catalogue Description
          <RequiredMark />
        </span>
        <textarea
          name="description"
          rows="4"
          value={formState.description}
          onChange={handleChange}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-ink"
          required
        />
        <p className="text-xs text-slate-400">
          Appears on the storefront card and modal. Keep it concise but descriptive.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.35em] text-mist">
            Aspect Ratio
            {aspectStatusMessage && (
              <span className="ml-2 text-[0.55rem] tracking-[0.2em] text-slate-400">
                {aspectStatusMessage}
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
            {ASPECT_RATIO_OPTIONS.map((ratio) => (
              <option key={ratio} value={ratio}>
                {ratio}
              </option>
            ))}
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
        <div className="space-y-2 md:col-span-2">
          <span className="text-xs uppercase tracking-[0.35em] text-mist">Prompt</span>
          <textarea
            name="prompt"
            rows="3"
            value={formState.prompt}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-ink"
          />
          <p className="text-xs text-slate-400">
            Stored securely — the storefront blurs this field until a purchase unlocks it.
          </p>
        </div>
      </section>

      <div className="space-y-2">
        <VariationsInput
          placeholder="https://cdn.framevist.com/capsule-variation.jpg"
          values={formState.variations}
          onChange={(variations) => setFormState((prev) => ({ ...prev, variations }))}
          enableUpload
          uploadLabel="Upload"
        />
        <p className="text-xs text-slate-400">
          Variations replace the old gallery and appear as selectable thumbnails in the storefront modal.
        </p>
      </div>

      <TagInput
        values={formState.tags}
        onChange={(tags) => setFormState((prev) => ({ ...prev, tags }))}
        suggestions={availableTags}
      />

      <ModelInput
        value={formState.model}
        onChange={(model) => setFormState((prev) => ({ ...prev, model }))}
        suggestions={availableModels}
      />

      <ColorPicker
        values={formState.colorPalette}
        onChange={(colorPalette) => setFormState((prev) => ({ ...prev, colorPalette }))}
      />

      <ResolutionsInput
        values={formState.resolutions}
        onChange={(resolutions) => setFormState((prev) => ({ ...prev, resolutions }))}
      />

      <section className="flex flex-col gap-4 rounded-[28px] border border-slate-200/60 bg-white/80 p-5 shadow-inner md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-mist">Visibility</p>
          <p className="text-sm text-slate-500">
            {formState.published
              ? 'This capsule is live on the storefront.'
              : 'Keep as draft until you toggle publishing.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setFormState((prev) => ({
              ...prev,
              published: !prev.published,
            }))
          }
          aria-pressed={formState.published}
          className={`group relative flex w-full max-w-sm items-center gap-4 rounded-[999px] border px-4 py-3 text-left transition ${
            formState.published
              ? 'border-emerald-200 bg-emerald-50/70'
              : 'border-slate-200 bg-white'
          }`}
        >
          <span className="sr-only">Toggle published</span>
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-lg transition ${
              formState.published ? 'bg-emerald-500' : 'bg-slate-300 text-slate-600'
            }`}
            aria-hidden="true"
          >
            {formState.published ? <FaCheck className="h-4 w-4" /> : <FaPause className="h-4 w-4" />}
          </span>
          <div className="flex flex-col">
            <span className="text-[0.55rem] uppercase tracking-[0.35em] text-slate-400">Publishing</span>
            <span className="font-semibold text-ink">
              {formState.published ? 'Live for collectors' : 'Hidden draft'}
            </span>
            <span className="text-xs text-slate-500">
              {formState.published ? 'Visible across the storefront' : 'Stays private until you publish'}
            </span>
          </div>
          <span
            className={`ml-auto inline-flex h-7 w-14 items-center rounded-full transition ${
              formState.published ? 'bg-emerald-500/70' : 'bg-slate-300/80'
            }`}
            aria-hidden="true"
          >
            <span
              className={`h-5 w-5 rounded-full bg-white shadow-sm transition ${
                formState.published ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </span>
        </button>
      </section>

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
