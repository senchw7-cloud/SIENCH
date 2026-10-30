/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, SiteSettings, UserProfile } from '../types';
import { StorageService } from '../services/storage';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  // Navigation / Route
  currentPath: string;
  navigate: (path: string) => void;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  // Wishlist
  wishlist: string[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Site Settings
  siteSettings: SiteSettings;
  refreshSiteSettings: () => void;

  // Products
  products: Product[];
  refreshProducts: () => void;

  // User & Admin Auth
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  isAdminLoggedIn: boolean;
  adminLogin: (email: string, pass: string) => boolean;
  adminLogout: () => void;

  // Last Placed Order for Success screen
  lastOrder: Order | null;
  setLastOrder: (order: Order | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Sync URL hash or path
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || window.location.pathname || '/';
  });

  const [cart, setCart] = useState<CartItem[]>(() => StorageService.getCart());
  const [wishlist, setWishlist] = useState<string[]>(() => StorageService.getWishlist());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => StorageService.getSiteSettings());
  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts());
  const [user, setUserState] = useState<UserProfile | null>(() => StorageService.getUserProfile());
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => !!StorageService.getAdminSession());
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Sync route on popstate and hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      const path = hash || window.location.pathname || '/';
      setCurrentPath(path);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = (path: string) => {
    if (path.startsWith('/')) {
      window.location.hash = path;
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshProducts = () => {
    setProducts(StorageService.getProducts());
  };

  const refreshSiteSettings = () => {
    setSiteSettings(StorageService.getSiteSettings());
  };

  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock < quantity) {
      addToast(`Maaf, stok ${product.name} tidak mencukupi.`, 'error');
      return;
    }
    const updated = StorageService.addToCart(product, quantity);
    setCart([...updated]);
    addToast(`${product.name} berhasil ditambahkan ke keranjang.`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    const prod = products.find((p) => p.id === productId);
    if (prod && quantity > prod.stock) {
      addToast(`Maksimum pembelian sesuai stok adalah ${prod.stock} unit.`, 'error');
      return;
    }
    const updated = StorageService.updateCartQuantity(productId, quantity);
    setCart([...updated]);
  };

  const removeFromCart = (productId: string) => {
    const updated = StorageService.removeFromCart(productId);
    setCart([...updated]);
    addToast('Item dihapus dari keranjang.', 'info');
  };

  const clearCart = () => {
    StorageService.clearCart();
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    const added = StorageService.toggleWishlist(product.id);
    setWishlist(StorageService.getWishlist());
    if (added) {
      addToast(`${product.name} ditambahkan ke Wishlist.`, 'success');
    } else {
      addToast(`${product.name} dihapus dari Wishlist.`, 'info');
    }
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const setUser = (newUser: UserProfile | null) => {
    StorageService.setUserProfile(newUser);
    setUserState(newUser);
  };

  const adminLogin = (email: string, pass: string): boolean => {
    // Verified admin credentials with secure simulation
    if (
      (email.trim().toLowerCase() === 'admin@siench.com' && pass === 'darkluxury2026') ||
      (email.trim().toLowerCase() === 'admin' && pass === 'admin')
    ) {
      const session = {
        email: 'admin@siench.com',
        token: 'siench_sec_' + Math.random().toString(36).substr(2, 10),
        loggedInAt: new Date().toISOString(),
      };
      StorageService.setAdminSession(session);
      setIsAdminLoggedIn(true);
      StorageService.logAdminActivity('Admin Login', `Admin login via ${email}`);
      addToast('Selamat datang di SIENCH Admin Control Panel', 'success');
      return true;
    }
    addToast('Email atau password admin salah!', 'error');
    return false;
  };

  const adminLogout = () => {
    StorageService.setAdminSession(null);
    setIsAdminLoggedIn(false);
    StorageService.logAdminActivity('Admin Logout', 'Admin mengakhiri sesi.');
    addToast('Anda telah logout dari Admin Panel', 'info');
    navigate('/admin/login');
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        cart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        isWishlisted,
        toggleWishlist,
        quickViewProduct,
        setQuickViewProduct,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        toasts,
        addToast,
        removeToast,
        siteSettings,
        refreshSiteSettings,
        products,
        refreshProducts,
        user,
        setUser,
        isAdminLoggedIn,
        adminLogin,
        adminLogout,
        lastOrder,
        setLastOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
