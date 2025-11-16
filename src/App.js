import { useEffect, useMemo, useState } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import CartDrawer from './components/CartDrawer';
import { CartProvider } from './context/CartContext';
import products from './data/products.json';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('all');
  const [showStickyFilters, setShowStickyFilters] = useState(false);
  const [activeSection, setActiveSection] = useState('experience');

  const tags = useMemo(() => {
    const unique = new Set();
    products.forEach((product) => {
      product.tags?.forEach((tag) => unique.add(tag));
    });
    return ['all', ...Array.from(unique)];
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const catalogue = document.getElementById('catalogue');
      if (catalogue) {
        const { top } = catalogue.getBoundingClientRect();
        setShowStickyFilters(top <= 120);
      }

      const sections = [
        { id: 'hero', key: 'experience' },
        { id: 'about', key: 'about' },
        { id: 'catalogue', key: 'capsules' },
      ];
      const buffer = window.innerHeight * 0.3;
      const current = sections.reduce((acc, section) => {
        const element = document.getElementById(section.id);
        if (!element) return acc;
        const rect = element.getBoundingClientRect();
        if (rect.top - buffer <= 0) {
          return section.key;
        }
        return acc;
      }, 'experience');
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToCheckout = () => {
    setActivePage('checkout');
  };

  const isHomeView = activePage === 'home';

  return (
    <CartProvider>
      <div className="min-h-screen bg-pearl">
        <Header
          onOpenCart={() => setCartOpen(true)}
          showFilters={isHomeView && showStickyFilters}
          showProgress={isHomeView}
          activeSection={activeSection}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          tags={tags}
          activeTag={activeTag}
          onTagChange={setActiveTag}
        />
        {isHomeView ? (
          <Home
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeTag={activeTag}
            onTagChange={setActiveTag}
            tags={tags}
          />
        ) : (
          <Checkout />
        )}
        <Footer />
        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          onCheckout={() => {
            goToCheckout();
          }}
        />
      </div>
    </CartProvider>
  );
}

export default App;
