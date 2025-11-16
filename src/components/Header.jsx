import { useMemo } from 'react';
import CatalogueControls from './CatalogueControls';
import { useCart } from '../context/CartContext';

const sectionProgress = [
  { key: 'experience', label: 'Experience' },
  { key: 'about', label: 'About' },
  { key: 'capsules', label: 'Capsules' },
];

const Header = ({
  onOpenCart,
  showFilters = false,
  showProgress = true,
  activeSection = 'experience',
  searchQuery,
  onSearchChange,
  tags,
  activeTag,
  onTagChange,
}) => {
  const { cartSummary } = useCart();
  const countLabel = useMemo(
    () => `${cartSummary.count} item${cartSummary.count === 1 ? '' : 's'}`,
    [cartSummary.count]
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-6 py-3">
        <a href="#top" className="font-display text-xl tracking-[0.3em] text-ink flex-shrink-0">
          Frame Vist
        </a>
        <div className="flex flex-1 items-center justify-center">
          {showFilters ? (
            <div className="w-full max-w-4xl rounded-[999px] border border-slate-200/70 bg-white px-6 py-2.5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <CatalogueControls
                variant="compact"
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                tags={tags}
                activeTag={activeTag}
                onTagChange={onTagChange}
              />
            </div>
          ) : showProgress ? (
            <div className="h-12 w-full max-w-4xl" aria-hidden="true" />
          ) : null}
        </div>
        <button
          type="button"
          aria-label={`Open cart, ${countLabel}`}
          className="relative flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-ink shadow-sm transition hover:border-ink/40"
          onClick={onOpenCart}
        >
          <span className="sr-only">Cart</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-5 w-5"
          >
            <circle cx="9" cy="21" r="1.2" />
            <circle cx="18" cy="21" r="1.2" />
            <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.8a1 1 0 0 0 1-.76L21 7H7" />
          </svg>
          <span className="text-[0.6rem] uppercase tracking-[0.35em] text-mist">Cart</span>
          <span className="rounded-full bg-ink px-2 py-0.5 text-[0.6rem] font-semibold text-white">
            {cartSummary.count}
          </span>
        </button>
      </div>
      {showProgress ? (
        <div className="mx-auto hidden w-full max-w-4xl items-center justify-between gap-4 px-8 pb-3 text-[0.6rem] uppercase tracking-[0.35em] text-slate-400 sm:flex">
          {sectionProgress.map((section, index) => {
            const isActive = section.key === activeSection;
            const isCompleted =
              sectionProgress.findIndex((item) => item.key === activeSection) > index;
            return (
              <div key={section.key} className="flex w-full items-center gap-3">
                <div
                  className={`flex h-2 w-2 items-center justify-center rounded-full border border-slate-300 transition ${
                    isActive ? 'border-ink bg-ink' : isCompleted ? 'bg-slate-300' : 'bg-transparent'
                  }`}
                />
                <span className={isActive ? 'text-ink' : isCompleted ? 'text-slate-500' : ''}>
                  {section.label}
                </span>
                {index < sectionProgress.length - 1 && (
                  <div
                    className={`h-px flex-1 bg-gradient-to-r ${
                      isCompleted
                        ? 'from-ink/80 via-ink/60 to-slate-300'
                        : 'from-slate-200 via-slate-200 to-slate-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : null}
    </header>
  );
};

export default Header;
