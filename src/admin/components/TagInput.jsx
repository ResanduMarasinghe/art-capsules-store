import { useState } from 'react';

const TagInput = ({ label = 'Tags', values = [], onChange }) => {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onChange?.([...values, trimmed]);
    setInput('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAdd();
    }
  };

  const removeTag = (index) => {
    onChange?.(values.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs uppercase tracking-[0.35em] text-mist">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add tag"
          className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-ink"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-2xl border border-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-ink"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs uppercase tracking-[0.35em] text-slate-600"
          >
            {tag}
            <button type="button" onClick={() => removeTag(index)} aria-label={`Remove ${tag}`}>
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
