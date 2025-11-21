import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
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
import { useCapsules } from './hooks/useCapsules';

const Storefront = () => {
  const [activePage, setActivePage] = useState('home');
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('all');
  const [showStickyFilters, setShowStickyFilters] = useState(false);
  const [activeSection, setActiveSection] = useState('experience');
  const { capsules, loading: capsulesLoading, error: capsulesError, tags } = useCapsules();

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

  const isHomeView = activePage === 'home';

  return (
    <div className="min-h-screen bg-pearl">
      <Header
        onOpenCart={() => setCartOpen(true)}
        showFilters={isHomeView && showStickyFilters}
        showProgress={isHomeView}
        activeSection={activeSection}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTag={activeTag}
        onTagChange={setActiveTag}
      />
      {isHomeView ? (
        <Home
          capsules={capsules}
          capsulesLoading={capsulesLoading}
          capsulesError={capsulesError}
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
