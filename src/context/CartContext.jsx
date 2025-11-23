import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { recordCapsuleAddedToCart } from '../services/capsules';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'frame-vist-cart-v1';

const getCoverImage = (product) =>
  product?.mainImage || product?.image || product?.variations?.[0] || '';

const getInitialCartItems = () => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => ({
        ...item,
        quantity: typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1,
      }));
    }
  } catch (error) {
    // ignore malformed storage payloads
  }
  return [];
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(getInitialCartItems);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      // ignore persistence errors
    }
  }, [cartItems]);

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((entry) => entry.id === product.id);
      if (existing) {
        // Track the additional quantity being added
        if (product.id) {
          recordCapsuleAddedToCart(product.id, quantity).catch(error => {
            console.error('Failed to track add to cart:', error);
          });
        }
        return prev.map((entry) =>
          entry.id === product.id
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry
        );
      }
      // Track new item added to cart
      if (product.id) {
        recordCapsuleAddedToCart(product.id, quantity).catch(error => {
          console.error('Failed to track add to cart:', error);
        });
      }
      const image = getCoverImage(product);
      return [...prev, { ...product, image, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const updateQuantity = useCallback(
    (id, quantity) => {
      if (quantity <= 0) {
        removeFromCart(id);
        return;
      }
      setCartItems((prev) =>
        prev.map((entry) => (entry.id === id ? { ...entry, quantity } : entry))
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  const cartSummary = useMemo(() => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const taxRate = 0.0825;
    const taxes = subtotal * taxRate;
    const total = subtotal + taxes;
    const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    return {
      count,
      subtotal,
      taxes,
      total,
    };
  }, [cartItems]);

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartSummary,
      cartTotal: cartSummary.total,
      // legacy aliases for existing consumers
      items: cartItems,
      addItem: addToCart,
      removeItem: removeFromCart,
      summary: cartSummary,
    }),
    [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartSummary]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
};
