import { useEffect, useMemo, useState } from 'react';

const TagInput = ({ label = 'Tags', values = [], onChange, suggestions = [] }) => {
  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const normalizeTag = (value = '') => value.trim().replace(/\s+/g, ' ');

  const selectedLookup = useMemo(
    () => new Set(values.map((tag) => tag.toLowerCase())),
    [values]
  );

  const addTag = (tagValue) => {
    const normalized = normalizeTag(tagValue);
    if (!normalized) return;
    if (selectedLookup.has(normalized.toLowerCase())) {
      setInput('');
      return;
    }
    onChange?.([...values, normalized]);
    setInput('');
    setHighlightedIndex(-1);
  };

  const handleAdd = () => {
    addTag(input);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (showSuggestions && highlightedIndex >= 0) {
        handleSuggestionSelect(filteredSuggestions[highlightedIndex]);
        return;
      }
      handleAdd();
    }

    if (event.key === ',' && input.trim()) {
      event.preventDefault();
      handleAdd();
    }

    if (event.key === 'ArrowDown' && showSuggestions) {
      event.preventDefault();
      setHighlightedIndex((prev) => {
        const next = prev + 1;
        return next >= filteredSuggestions.length ? 0 : next;
      });
    }

    if (event.key === 'ArrowUp' && showSuggestions) {
      event.preventDefault();
      setHighlightedIndex((prev) => {
        const next = prev - 1;
        return next < 0 ? filteredSuggestions.length - 1 : next;
      });
    }
  };

  const removeTag = (index) => {
    onChange?.(values.filter((_, idx) => idx !== index));
  };

  const filteredSuggestions = useMemo(() => {
    const normalizedInput = input.trim().toLowerCase();
    return suggestions
      .filter(Boolean)
      .filter((tag) => !selectedLookup.has(tag.toLowerCase()))
      .filter((tag) =>
        normalizedInput ? tag.toLowerCase().includes(normalizedInput) : true
      )
      .slice(0, 6);
  }, [input, suggestions, selectedLookup]);

  const showSuggestions = focused && filteredSuggestions.length > 0;

  const handleSuggestionSelect = (tag) => {
    addTag(tag);
    setFocused(false);
  };

  const handleBlur = () => {
    setTimeout(() => setFocused(false), 100);
  };

  useEffect(() => {
    if (showSuggestions) {
      setHighlightedIndex((prev) => (prev === -1 ? 0 : Math.min(prev, filteredSuggestions.length - 1)));
    } else {
      setHighlightedIndex(-1);
    }
  }, [showSuggestions, filteredSuggestions.length]);

  const hasInput = Boolean(input.trim());

  return (
    <div className="space-y-3">
      <label className="block text-xs uppercase tracking-[0.35em] text-mist">{label}</label>
      <div className="relative flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          placeholder="Add tag"
          className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-ink"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!hasInput}
          className="rounded-2xl border border-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-ink transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add
        </button>
        {focused && !showSuggestions && suggestions.length === 0 && (
          <div className="absolute left-0 top-full z-10 mt-2 w-full rounded-2xl border border-dashed border-slate-200 bg-white/90 p-3 text-xs text-slate-400 shadow-xl">
            Suggestions populate automatically as you save more capsules.
          </div>
        )}
        {showSuggestions && (
          <div
            className="absolute left-0 top-full z-10 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-xl"
            role="listbox"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <button
                type="button"
                key={suggestion}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSuggestionSelect(suggestion)}
                className={`flex w-full items-center justify-between px-4 py-2 text-sm transition ${
                  highlightedIndex === index
                    ? 'bg-ink/5 text-ink'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
                role="option"
                aria-selected={highlightedIndex === index}
              >
                <span>{suggestion}</span>
                <span className="text-[0.6rem] uppercase tracking-[0.3em] text-slate-400">Use</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-slate-400">
        Press Enter or comma to commit a tag, or pick from the suggested catalogue keywords.
      </p>
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
