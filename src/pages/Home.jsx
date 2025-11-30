import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MasonryGrid from '../components/MasonryGrid';
import ProductCard from '../components/ProductCard';
import CapsuleSkeleton from '../components/CapsuleSkeleton';
import ProductModal from '../components/ProductModal';
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
  selectedTags = [],
  onTagToggle,
  tags = ['all'],
}) => {
  const { addToCart, cartItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [gridCols, setGridCols] = useState(() => {
    if (typeof window === 'undefined') return 1;
    return getColumnsForViewport(window.innerWidth);
  });
  const [sharedCapsuleId, setSharedCapsuleId] = useState(null);
  const [promoCopied, setPromoCopied] = useState(false);
  const promoCopyTimeout = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    return () => {
      if (promoCopyTimeout.current) {
        clearTimeout(promoCopyTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      const matchesTag = selectedTags.length
        ? selectedTags.some((tag) => product.tags?.includes(tag))
        : true;
      return matchesSearch && matchesTag;
    });
  }, [searchQuery, selectedTags, capsules]);

  const cartItemIds = useMemo(() => {
    return new Set(
      (cartItems || [])
        .map((item) => item?.id)
        .filter((id) => id !== undefined && id !== null)
    );
  }, [cartItems]);

  const masonryItems = useMemo(() => {
    return filteredProducts.map((product, index) => ({
      id: product.id ?? index,
      element: (
        <ProductCard
          key={product.id ?? index}
          product={product}
          onAddToCart={addToCart}
          isInCart={product.id ? cartItemIds.has(product.id) : false}
        />
      ),
    }));
  }, [filteredProducts, addToCart, cartItemIds]);

  const skeletonItems = useMemo(
    () => Array.from({ length: Math.max(4, gridCols * 2) }, (_, index) => index),
    [gridCols]
  );

  const sharedCapsule = useMemo(() => {
    if (!sharedCapsuleId) return null;
    return capsules.find((capsule) => capsule.id === sharedCapsuleId) || null;
  }, [capsules, sharedCapsuleId]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const capsuleParam = params.get('capsule');
    if (!capsuleParam) {
      setSharedCapsuleId(null);
      return;
    }
    setSharedCapsuleId(capsuleParam);
  }, [location.search]);

  const clearCapsuleParam = () => {
    const params = new URLSearchParams(location.search);
    if (params.has('capsule')) {
      params.delete('capsule');
      const nextSearch = params.toString();
      navigate({ pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : '' }, { replace: true });
    }
    setSharedCapsuleId(null);
  };

  const isTagSelected = (tag) => {
    if (tag === 'all') return selectedTags.length === 0;
    return selectedTags.includes(tag);
  };

  const handleTagClick = (tag) => {
    onTagToggle?.(tag);
  };

  const handlePromoCopy = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText('FRAMEVIST2025');
      setPromoCopied(true);
      if (promoCopyTimeout.current) {
        clearTimeout(promoCopyTimeout.current);
      }
      promoCopyTimeout.current = setTimeout(() => {
        setPromoCopied(false);
      }, 1500);
    } catch (err) {
      console.warn('Unable to copy FRAMEVIST2025', err);
    }
  };

  return (
    <>
      <section
        id="hero"
        className="relative isolate overflow-hidden bg-white px-4 py-20 text-center sm:px-6 md:py-32"
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.08),_transparent_55%)] opacity-40 transition-transform duration-75"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          aria-hidden="true"
        />
        <div 
          className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 text-center sm:gap-6 lg:gap-8 animate-hero-fade-in"
          style={{ transform: `translateY(${scrollY * 0.15}px)`, opacity: Math.max(0, 1 - scrollY / 500) }}
        >
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

      {/* Promo Banner - Clean section with compact mobile design */}
      <section className="mx-auto mt-12 mb-8 w-full max-w-6xl px-4 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 p-5 sm:p-8 shadow-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
            {/* Mobile: Compact horizontal layout */}
            <div className="flex items-center gap-3 sm:gap-5 text-left w-full lg:w-auto">
              <div className="flex-shrink-0">
                <div className="inline-flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center rounded-2xl sm:rounded-3xl bg-emerald-500 font-display text-xl sm:text-3xl text-white shadow-lg">
                  10%
                </div>
              </div>
              <div className="space-y-1 sm:space-y-2 flex-1">
                <p className="text-[0.6rem] sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.35em] text-emerald-600 font-semibold">
                  Limited Time Offer
                </p>
                <h2 className="font-display text-lg sm:text-2xl lg:text-3xl text-ink leading-tight">
                  Get 10% off orders over $50
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 hidden sm:block max-w-lg">
                  Use code <span className="font-mono bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-semibold">FRAMEVIST2025</span> at checkout. Discount applies to order total including taxes.
                </p>
              </div>
            </div>
            
            {/* Mobile: Compact stacked buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-3 w-full lg:w-auto lg:flex-shrink-0">
              <button
                type="button"
                onClick={handlePromoCopy}
                className="flex items-center justify-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border-2 border-emerald-400 bg-white px-4 py-3 sm:px-6 sm:py-4 font-mono text-sm sm:text-lg tracking-wider text-emerald-700 shadow-md transition hover:bg-emerald-50 hover:border-emerald-500"
              >
                <span className="font-bold">FRAMEVIST2025</span>
                <span className={`text-[0.65rem] sm:text-xs uppercase ${promoCopied ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {promoCopied ? '✓ Copied' : 'Copy'}
                </span>
              </button>
              <a
                href="#catalogue"
                className="inline-flex items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-500 px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-lg transition hover:bg-emerald-600"
              >
                Shop Now →
              </a>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto mt-10 flex max-w-7xl flex-col gap-10 px-8 py-12 lg:px-12">
        <section
          id="about"
          className="glass-panel flex flex-col rounded-[32px] border border-slate-200/60 bg-white p-8 shadow-frame"
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
          {/* Horizontal Scrollable Tags - Mobile */}
          <div className="flex md:hidden">
            <div className="flex w-full gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {tags?.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className={`flex-shrink-0 rounded-full border px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] transition ${
                    isTagSelected(tag)
                      ? 'border-ink bg-ink text-white shadow-md'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-ink/50 hover:text-ink'
                  }`}
                  aria-pressed={isTagSelected(tag)}
                >
                  {tag === 'all' ? 'All' : tag}
                </button>
              ))}
            </div>
          </div>

          {/* Compact Multi-row Grid - Desktop */}
          <div className="hidden md:flex md:flex-wrap md:gap-2">
            {tags?.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`rounded-full border px-4 py-1.5 text-[0.65rem] uppercase tracking-[0.3em] transition ${
                  isTagSelected(tag)
                    ? 'border-ink bg-ink text-white shadow-md'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-ink/50 hover:text-ink'
                }`}
                aria-pressed={isTagSelected(tag)}
              >
                {tag === 'all' ? 'All' : tag}
              </button>
            ))}
          </div>

          {selectedTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-xs text-slate-600">
              <span className="uppercase tracking-[0.35em] text-[0.55rem] text-slate-400">
                Filtering by
              </span>
              {selectedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[0.65rem] uppercase tracking-[0.25em] text-ink shadow-sm border border-slate-200 hover:border-rose-200 hover:text-rose-500"
                >
                  {tag}
                  <span aria-hidden="true">×</span>
                  <span className="sr-only">Remove {tag} filter</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleTagClick('all')}
                className="text-[0.6rem] uppercase tracking-[0.35em] text-slate-500 underline underline-offset-4 hover:text-ink"
              >
                Clear all
              </button>
            </div>
          )}
        </section>

        <section>
          {capsulesLoading ? (
            <div className="glass-panel rounded-[28px] border border-slate-200/80 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-mist">Loading capsules…</p>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {skeletonItems.map((item) => (
                  <CapsuleSkeleton key={item} />
                ))}
              </div>
            </div>
          ) : capsulesError ? (
            <div className="glass-panel rounded-[28px] border border-rose-200 bg-rose-50/50 p-12 text-center text-rose-600">
              <p className="text-sm uppercase tracking-[0.35em]">Error loading capsules</p>
              <p className="mt-3 text-base">{capsulesError}</p>
            </div>
          ) : filteredProducts.length ? (
            <>
              {/* Desktop Masonry Grid */}
              <div className="hidden md:block">
                <MasonryGrid
                  items={masonryItems}
                  columns={Math.max(2, gridCols)}
                  className="w-full"
                />
              </div>
              
              {/* Mobile Simple Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:hidden">
                {filteredProducts.map((product, index) => (
                  <ProductCard 
                    key={product.id ?? index} 
                    product={product} 
                    onAddToCart={addToCart} 
                    isInCart={product.id ? cartItemIds.has(product.id) : false}
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

      {sharedCapsule && (
        <ProductModal
          product={sharedCapsule}
          onClose={clearCapsuleParam}
          onAddToCart={() => {
            const image =
              sharedCapsule.mainImage ||
              sharedCapsule.image ||
              sharedCapsule.variations?.[0] ||
              '';
            addToCart({ ...sharedCapsule, image });
            clearCapsuleParam();
          }}
        />
      )}
    </>
  );
};

export default Home;
