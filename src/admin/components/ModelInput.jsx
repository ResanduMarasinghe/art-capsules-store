import { useMemo, useState } from 'react';

const ModelInput = ({
  label = 'Model',
  value = '',
  onChange,
  suggestions = [],
  placeholder = 'e.g. Midjourney v6',
}) => {
  const [focused, setFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const normalizedValue = value.trim().toLowerCase();

  const filteredSuggestions = useMemo(() => {
    if (!suggestions.length) return [];
    return suggestions
      .filter(Boolean)
      .filter((suggestion) =>
        normalizedValue ? suggestion.toLowerCase().includes(normalizedValue) : true
      )
      .slice(0, 6);
  }, [suggestions, normalizedValue]);

  const showSuggestions = focused && filteredSuggestions.length > 0;

  const applyValue = (nextValue) => {
    onChange?.(nextValue.trim());
    setFocused(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (showSuggestions && highlightedIndex >= 0) {
        applyValue(filteredSuggestions[highlightedIndex]);
        return;
      }
      applyValue(value);
    }

    if (event.key === 'ArrowDown' && showSuggestions) {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % filteredSuggestions.length);
    }

    if (event.key === 'ArrowUp' && showSuggestions) {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev - 1 < 0 ? filteredSuggestions.length - 1 : prev - 1
      );
    }

    if (event.key === 'Escape') {
      setFocused(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-[0.35em] text-mist">{label}</label>
      <div className="relative flex gap-2">
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange?.(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 120)}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-ink"
        />
        {value && (
          <button
            type="button"
            onClick={() => applyValue('')}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500"
          >
            Clear
          </button>
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
                onClick={() => applyValue(suggestion)}
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
        Capture the exact AI model, version, or workflow (e.g., Midjourney, SDXL, Runway).
      </p>
    </div>
  );
};

export default ModelInput;
