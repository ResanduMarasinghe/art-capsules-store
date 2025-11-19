import ImageUploadButton from './ImageUploadButton';

const GalleryInput = ({
  label = 'Gallery Images',
  values = [],
  onChange,
  placeholder = 'https://...',
  enableUpload = false,
  uploadLabel = 'Upload',
}) => {
  const items = values.length ? values : [''];

  const updateValue = (index, value) => {
    const next = [...items];
    next[index] = value;
    onChange?.(next);
  };

  const addField = () => {
    onChange?.([...items, '']);
  };

  const removeField = (index) => {
    const next = items.filter((_, idx) => idx !== index);
    onChange?.(next.length ? next : ['']);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs uppercase tracking-[0.35em] text-mist">{label}</label>
      <div className="space-y-3">
        {items.map((url, index) => (
          <div key={`${label}-${index}`} className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="url"
              value={url}
              onChange={(event) => updateValue(index, event.target.value)}
              placeholder={placeholder}
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-ink"
            />
            <div className="flex gap-2">
              {enableUpload && (
                <ImageUploadButton
                  size="sm"
                  label={uploadLabel}
                  onUploadComplete={(uploadedUrl) => updateValue(index, uploadedUrl)}
                />
              )}
              <button
                type="button"
                onClick={() => removeField(index)}
                className="rounded-2xl border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-rose-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addField}
          className="rounded-2xl border border-dashed border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500"
        >
          + Add entry
        </button>
      </div>
    </div>
  );
};

export default GalleryInput;
