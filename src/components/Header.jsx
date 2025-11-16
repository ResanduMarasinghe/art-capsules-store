import { useMemo } from 'react';
import { useCart } from '../context/CartContext';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Capsules', href: '#capsules' },
  { label: 'About', href: '#about' },
];

const Header = ({ onOpenCart }) => {
  const { cartSummary } = useCart();
  const countLabel = useMemo(
    () => `${cartSummary.count} item${cartSummary.count === 1 ? '' : 's'}`,
    [cartSummary.count]
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <a href="#top" className="font-display text-xl tracking-[0.25em] text-ink flex-shrink-0">
          Frame Vist
        </a>
        <nav className="flex flex-1 items-center justify-center gap-6 text-xs font-medium uppercase tracking-[0.35em] text-mist sm:text-sm">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="group relative transition hover:text-ink"
            >
              {item.label}
              <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-full scale-x-0 bg-ink transition group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
        <button
          type="button"
          aria-label={`Open cart, ${countLabel}`}
          className="relative flex items-center gap-3 rounded-full border border-slate-200/70 bg-white/80 px-4 py-2 text-sm font-medium text-ink shadow-sm transition hover:border-ink/40"
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
          <span className="text-xs uppercase tracking-[0.35em] text-mist">Cart</span>
          <span className="rounded-full bg-ink px-2 py-0.5 text-xs font-semibold text-white">
            {cartSummary.count}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
