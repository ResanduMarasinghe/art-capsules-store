import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import CartDrawer from './components/CartDrawer';
import { CartProvider } from './context/CartContext';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [cartOpen, setCartOpen] = useState(false);

  const goToCheckout = () => {
    setActivePage('checkout');
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-pearl">
        <Header onOpenCart={() => setCartOpen(true)} />
        <nav className="mx-auto mt-6 flex max-w-6xl justify-end gap-4 px-6">
          <button
            className={`rounded-full border px-6 py-2 text-sm transition ${
              activePage === 'home'
                ? 'border-ink bg-ink text-white'
                : 'border-slate-200 text-ink hover:border-ink/50'
            }`}
            onClick={() => setActivePage('home')}
          >
            Gallery
          </button>
          <button
            className={`rounded-full border px-6 py-2 text-sm transition ${
              activePage === 'checkout'
                ? 'border-ink bg-ink text-white'
                : 'border-slate-200 text-ink hover:border-ink/50'
            }`}
            onClick={() => setActivePage('checkout')}
          >
            Checkout
          </button>
        </nav>
        {activePage === 'home' ? <Home /> : <Checkout />}
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
