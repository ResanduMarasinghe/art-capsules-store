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
        <div className="flex w-full snap-x gap-2 overflow-x-auto rounded-full border border-slate-200/70 bg-white/80 px-3 py-2 text-xs uppercase tracking-[0.3em] text-slate-500 shadow-sm lg:max-w-2xl">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagChange?.(tag)}
              className={`flex-shrink-0 snap-start rounded-full px-4 py-1.5 transition ${
                activeTag === tag
                  ? 'bg-ink text-white shadow-md'
                  : 'border border-transparent hover:border-ink/30 hover:text-ink'
              }`}
              aria-pressed={activeTag === tag}
            >
              {tag === 'all' ? 'All tags' : tag}
            </button>
          ))}
        </div>
        <label className="relative w-full lg:max-w-sm lg:ml-auto">
          <span className="sr-only">Search capsules</span>
          <input
            type="search"
            placeholder="Search titles, artists, tags..."
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
          placeholder="Search titles, artists, tags..."
          value={searchQuery}
          onChange={(event) => onSearchChange?.(event.target.value)}
          className="w-full rounded-full border border-slate-200/80 bg-white px-5 py-2.5 text-sm text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
        />
      </label>
    </div>
  );
};

export default CatalogueControls;
