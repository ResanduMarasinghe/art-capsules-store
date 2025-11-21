import ImageUploadButton from './ImageUploadButton';

const formatLabelFromMetadata = (metadata) => {
  const width = Number(metadata?.width);
  const height = Number(metadata?.height);
  if (!width || !height) return '';
  return `${Math.round(width)}x${Math.round(height)}`;
};

const ResolutionsInput = ({ values = [], onChange }) => {
  const items = values.length ? values : [{ label: '', url: '' }];

  const updateField = (index, key, value) => {
    const next = items.map((entry, idx) =>
      idx === index ? { ...entry, [key]: value } : entry
    );
    onChange?.(next);
  };

  const handleUpload = (index, url, metadata) => {
    const detectedLabel = formatLabelFromMetadata(metadata);
    const next = items.map((entry, idx) => {
      if (idx !== index) return entry;
      const hasLabel = Boolean(entry.label?.trim());
      return {
        ...entry,
        url,
        label: hasLabel ? entry.label : detectedLabel || entry.label,
      };
    });
    onChange?.(next);
  };

  const addResolution = () => {
    onChange?.([...items, { label: '', url: '' }]);
  };

  const removeResolution = (index) => {
    const next = items.filter((_, idx) => idx !== index);
    onChange?.(next.length ? next : [{ label: '', url: '' }]);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs uppercase tracking-[0.35em] text-mist">
        Resolutions
      </label>
      <div className="space-y-3">
        {items.map((entry, index) => (
          <div
            key={`resolution-${index}`}
            className="space-y-2 rounded-2xl border border-slate-200 p-3"
          >
            <div className="grid gap-3 sm:grid-cols-[1fr,2fr]">
              <input
                type="text"
                placeholder="2048x2048"
                value={entry.label}
                onChange={(event) => updateField(index, 'label', event.target.value)}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-ink"
              />
              <div className="space-y-2">
                <input
                  type="url"
                  placeholder="https://cdn.framevist.com/capsule-2048.jpg"
                  value={entry.url}
                  onChange={(event) => updateField(index, 'url', event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-ink"
                />
                <div className="flex flex-wrap gap-2">
                  <ImageUploadButton
                    size="sm"
                    label={entry.url ? 'Replace Upload' : 'Upload'}
                    onUploadComplete={(url, metadata) => handleUpload(index, url, metadata)}
                  />
                  <button
                    type="button"
                    onClick={() => removeResolution(index)}
                    className="rounded-2xl border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-rose-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addResolution}
          className="rounded-2xl border border-dashed border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500"
        >
          + Add resolution
        </button>
      </div>
    </div>
  );
};

export default ResolutionsInput;
