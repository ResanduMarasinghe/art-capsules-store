import { useEffect, useMemo, useState } from 'react';
import BentoGrid from '../components/BentoGrid';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

const getColumnsForViewport = (width) => {
  if (width >= 1280) return 4;
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
};

const Home = ({
  capsules = [],
  capsulesLoading = false,
  capsulesError = null,
  searchQuery,
  onSearchChange,
  activeTag,
  onTagChange,
  tags = ['all'],
}) => {
  const { addToCart } = useCart();
  const [gridCols, setGridCols] = useState(() => {
    if (typeof window === 'undefined') return 1;
    return getColumnsForViewport(window.innerWidth);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleResize = () => {
      setGridCols(getColumnsForViewport(window.innerWidth));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const normalizeText = (value) => (typeof value === 'string' ? value : '');

  const filteredProducts = useMemo(() => {
    const query = (searchQuery || '').trim().toLowerCase();
    return capsules.filter((product) => {
      const title = normalizeText(product?.title).toLowerCase();
      const description = normalizeText(product?.description).toLowerCase();
      const artist = normalizeText(product?.artist).toLowerCase();
      const tagsText = Array.isArray(product?.tags)
        ? product.tags.join(' ').toLowerCase()
        : '';
      const matchesSearch = query
        ? title.includes(query) ||
          description.includes(query) ||
          artist.includes(query) ||
          tagsText.includes(query)
        : true;
      const matchesTag = activeTag === 'all' ? true : product.tags?.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  }, [searchQuery, activeTag, capsules]);

  const bentoItems = useMemo(() => {
    return filteredProducts.map((product, index) => ({
      id: product.id ?? index,
      element: <ProductCard product={product} onAddToCart={addToCart} />,
    }));
  }, [filteredProducts, addToCart]);

  return (
    <>
      <section
        id="hero"
        className="relative isolate overflow-hidden bg-white px-4 py-20 text-center sm:px-6 md:py-32"
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.08),_transparent_55%)] opacity-40"
          aria-hidden="true"
        />
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 text-center sm:gap-6 lg:gap-8 animate-hero-fade-in">
          <p className="text-[0.65rem] uppercase tracking-[0.45em] text-slate-400 sm:text-xs">
            Frame Vist
          </p>
          <h1 className="font-display text-3xl leading-tight text-ink sm:text-5xl lg:text-6xl">
            Where Imagination Meets Vision.
          </h1>
          <p className="text-sm leading-relaxed text-slate-500 sm:text-base">
            Frame Vist is a curated space of digital artistry, crafted, refined, and delivered as immersive art capsules.
            Every piece is a moment, a visual experience waiting to be explored.
          </p>
          <a
            href="#catalogue"
            className="mx-auto inline-flex items-center rounded-full border border-ink bg-ink px-8 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-transparent hover:text-ink sm:text-sm"
          >
            Explore Capsules
          </a>
        </div>
      </section>

      <section
        id="about"
        className="mx-auto mt-10 flex max-w-6xl flex-col rounded-[32px] border border-slate-200/60 bg-white px-8 py-12 shadow-frame"
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center animate-about-reveal">
          <div className="space-y-5 text-left">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">About</p>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">About Frame Vist</h2>
            <p className="text-base leading-relaxed text-slate-600">
              Frame Vist began as a simple idea — turning digital imagination into visually striking moments that anyone can own.
              What started with experimental AI-generated concepts evolved into a curated collection of art capsules, each designed to express a feeling, a story, or a frame in time.
            </p>
            <p className="text-base leading-relaxed text-slate-600">
              This platform isn’t just a store; it’s an evolving gallery. Every capsule is crafted with intention and shaped through a blend of technology, creativity, and modern design aesthetics.
              Whether you’re here to collect, explore, or get inspired, Frame Vist is your space to experience digital art in its purest form.
            </p>
          </div>
          <div className="relative flex h-64 w-full max-w-md items-center justify-center lg:h-[22rem]">
            <div className="relative h-56 w-56 rounded-[30%] border border-slate-200/80 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.1),_transparent_65%)] overflow-hidden">
              <img
                src="/images/about-visual.jpg"
                alt="Curated digital art composition for Frame Vist"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div
              className="absolute -right-6 top-10 hidden h-16 w-16 overflow-hidden rounded-full border border-slate-200/80 md:block"
            >
              <img
                src="/images/about-visual.jpg"
                alt="Curated detail"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto mt-10 flex max-w-7xl flex-col gap-10 px-8 py-12 lg:px-12">
        <section
          id="catalogue"
          className="glass-panel flex flex-col gap-6 rounded-[28px] border border-slate-200/60 p-8 shadow-frame"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-mist">Catalogue</p>
              <h3 className="font-display text-3xl text-ink">Find your next capsule</h3>
            </div>
            <label className="relative w-full md:w-80">
              <span className="sr-only">Search capsules</span>
              <input
                type="search"
                placeholder="Search titles, artists, tags..."
                value={searchQuery}
                onChange={(event) => onSearchChange?.(event.target.value)}
                className="w-full rounded-full border border-slate-200 bg-white/80 px-5 py-3 text-sm text-ink outline-none transition focus:border-ink focus:bg-white"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            {tags?.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onTagChange?.(tag)}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.35em] transition ${
                  activeTag === tag
                    ? 'border-ink bg-ink text-white'
                    : 'border-slate-200 text-slate-500 hover:border-ink/50 hover:text-ink'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        <section>
          {capsulesLoading ? (
            <div className="glass-panel rounded-[28px] border border-slate-200/80 p-12 text-center text-slate-500">
              <p className="text-sm uppercase tracking-[0.35em] text-mist">Loading capsules…</p>
            </div>
          ) : capsulesError ? (
            <div className="glass-panel rounded-[28px] border border-rose-200 bg-rose-50/50 p-12 text-center text-rose-600">
              <p className="text-sm uppercase tracking-[0.35em]">Error loading capsules</p>
              <p className="mt-3 text-base">{capsulesError}</p>
            </div>
          ) : filteredProducts.length ? (
            <>
              {/* Desktop Masonry Layout */}
              <div className="hidden md:block">
                <BentoGrid
                  items={bentoItems}
                  columns={Math.max(2, gridCols)}
                  className="w-full"
                />
              </div>
              
              {/* Mobile Simple Grid */}
              <div className="grid gap-6 md:hidden">
                {filteredProducts.map((product, index) => (
                  <ProductCard 
                    key={product.id ?? index} 
                    product={product} 
                    onAddToCart={addToCart} 
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="glass-panel rounded-[28px] border border-dashed border-slate-200 p-12 text-center text-slate-500">
              <p className="text-sm uppercase tracking-[0.35em] text-mist">No capsules found</p>
              <p className="mt-3 text-base text-slate-500">
                Try another search term or explore a different tag.
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Home;
