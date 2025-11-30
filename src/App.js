import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import PageBackground from './components/PageBackground';
import Footer from './components/Footer';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import CartDrawer from './components/CartDrawer';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import RequireAdmin from './admin/routes/RequireAdmin';
import AdminLayout from './admin/components/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import CapsulesList from './admin/pages/CapsulesList';
import CapsuleForm from './admin/pages/CapsuleForm';
import Analytics from './admin/pages/Analytics';
import Promos from './admin/pages/Promos';
import { useCapsules } from './hooks/useCapsules';

const Storefront = () => {
  const [mainHeight, setMainHeight] = useState(window.innerHeight);
  const mainRef = useRef(null);
  useLayoutEffect(() => {
    function updateHeight() {
      if (mainRef.current) {
        setMainHeight(mainRef.current.offsetHeight);
      }
    }
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);
  const [activePage, setActivePage] = useState('home');
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showStickyFilters, setShowStickyFilters] = useState(false);
  const [activeSection, setActiveSection] = useState('experience');
  const { capsules, loading: capsulesLoading, error: capsulesError, tags } = useCapsules();

  // Batik pattern height logic
  useLayoutEffect(() => {
    function updateHeight() {
      if (mainRef.current) {
        setMainHeight(mainRef.current.offsetHeight);
      }
    }
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    document.title =
      activePage === 'checkout' ? 'Frame Vist — Checkout' : 'Frame Vist — Capsules';
  }, [activePage]);


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

  const returnToHome = () => {
    setActivePage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTagToggle = (tag) => {
    if (tag === 'all') {
      setSelectedTags([]);
      return;
    }
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const isHomeView = activePage === 'home';

  return (
    <>
      <div className="min-h-screen bg-pearl" style={{position: 'relative'}} ref={mainRef}>
        <PageBackground height={mainHeight} />
        <Header
          onOpenCart={() => setCartOpen(true)}
          onNavigateHome={returnToHome}
          showFilters={isHomeView && showStickyFilters}
          showProgress={isHomeView}
          isHomeView={isHomeView}
          activeSection={activeSection}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        {isHomeView ? (
          <Home
            capsules={capsules}
            capsulesLoading={capsulesLoading}
            capsulesError={capsulesError}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            tags={tags}
          />
        ) : (
          <Checkout />
        )}
        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          onCheckout={() => {
            goToCheckout();
          }}
          onContinueExploring={returnToHome}
        />
      </div>
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Storefront />} />
            <Route path="/admin" element={<RequireAdmin />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="capsules" element={<CapsulesList />} />
                <Route path="capsules/new" element={<CapsuleForm />} />
                <Route path="capsules/:id/edit" element={<CapsuleForm />} />
                <Route path="promos" element={<Promos />} />
                <Route path="analytics" element={<Analytics />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
