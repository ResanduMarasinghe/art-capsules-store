const CatalogueControls = ({
  searchQuery,
  onSearchChange,
  tags = [],
  activeTag,
  onTagChange,
  variant = 'default',
}) => {
  const isCompact = variant === 'compact';

  if (isCompact) {
    return (
      <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:gap-5">
        <label className="relative w-full lg:max-w-xs">
          <span className="sr-only">Filter capsules by tag</span>
          <select
            value={activeTag}
            onChange={(event) => onTagChange?.(event.target.value)}
            className="w-full appearance-none rounded-full border border-slate-200/80 bg-white px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-600 outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
          >
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-5 top-1/2 inline-flex -translate-y-1/2 items-center text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-4 w-4"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </label>
        <label className="relative w-full lg:max-w-sm lg:ml-auto">
          <span className="sr-only">Search capsules</span>
          <input
            type="search"
            placeholder="Search titles, artists, moods..."
            value={searchQuery}
            onChange={(event) => onSearchChange?.(event.target.value)}
            className="w-full rounded-full border border-slate-200/80 bg-white px-5 py-2.5 text-sm text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10 shadow-sm"
          />
        </label>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onTagChange?.(tag)}
            className={`rounded-full border px-5 py-2 text-[0.65rem] uppercase tracking-[0.3em] transition ${
              activeTag === tag
                ? 'border-ink bg-ink text-white'
                : 'border-slate-200 text-slate-500 hover:border-ink/50 hover:text-ink'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <label className="relative w-full md:w-80">
        <span className="sr-only">Search capsules</span>
        <input
          type="search"
          placeholder="Search titles, artists, moods..."
          value={searchQuery}
          onChange={(event) => onSearchChange?.(event.target.value)}
          className="w-full rounded-full border border-slate-200/80 bg-white px-5 py-2.5 text-sm text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
        />
      </label>
    </div>
  );
};

export default CatalogueControls;
