import { useMemo, useState } from 'react';
import products from '../data/products.json';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

const Home = () => {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('all');

  const tags = useMemo(() => {
    const unique = new Set();
    products.forEach((product) => {
      product.tags?.forEach((tag) => unique.add(tag));
    });
    return ['all', ...Array.from(unique)];
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch = query
        ? product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.artist.toLowerCase().includes(query)
        : true;
      const matchesTag = activeTag === 'all' ? true : product.tags?.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  }, [searchQuery, activeTag]);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
      <section className="glass-panel rounded-[36px] border border-slate-200/50 p-10 shadow-frame">
        <p className="text-xs uppercase tracking-[0.45em] text-mist">Frame Vist Capsules</p>
        <h2 className="mt-5 max-w-3xl font-display text-4xl leading-tight text-ink sm:text-5xl">
          Curated AI capsules crafted for calm, modern interiors.
        </h2>
        <p className="mt-4 max-w-3xl text-base text-slate-500">
          Explore compositions shaped by analog tactility, cinematic gradients, and gentle contrast ratios.
        </p>
      </section>

      <section className="glass-panel flex flex-col gap-6 rounded-[28px] border border-slate-200/60 p-8 shadow-frame">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-mist">Catalogue</p>
            <h3 className="font-display text-3xl text-ink">Find your next capsule</h3>
          </div>
          <label className="relative w-full md:w-80">
            <span className="sr-only">Search capsules</span>
            <input
              type="search"
              placeholder="Search titles, artists, moods..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white/80 px-5 py-3 text-sm text-ink outline-none transition focus:border-ink focus:bg-white"
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
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
        {filteredProducts.length ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
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
  );
};

export default Home;
