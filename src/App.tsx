/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { ToastNotification } from './components/ToastNotification';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer } from './components/CartDrawer';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AccountPage } from './pages/AccountPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminPromotions } from './pages/admin/AdminPromotions';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminActivityLogs } from './pages/admin/AdminActivityLogs';

const AppContent: React.FC = () => {
  const { currentPath, navigate } = useApp();

  // Parse path without query or hash parameters
  const cleanPath = currentPath.split('?')[0].replace(/\/+$/, '') || '/';
  const isAdminRoute = cleanPath.startsWith('/admin');

  // Router renderer
  const renderPage = () => {
    // 1. Admin Routes
    if (cleanPath === '/admin/login') return <AdminLogin />;
    if (cleanPath === '/admin/dashboard' || cleanPath === '/admin') return <AdminDashboard />;
    if (cleanPath === '/admin/products' || cleanPath === '/admin/products/new') return <AdminProducts />;
    if (cleanPath === '/admin/categories') return <AdminCategories />;
    if (cleanPath === '/admin/orders') return <AdminOrders />;
    if (cleanPath === '/admin/customers') return <AdminCustomers />;
    if (cleanPath === '/admin/inventory') return <AdminInventory />;
    if (cleanPath === '/admin/promotions') return <AdminPromotions />;
    if (cleanPath === '/admin/reports') return <AdminReports />;
    if (cleanPath === '/admin/settings') return <AdminSettings />;
    if (cleanPath === '/admin/activity-logs') return <AdminActivityLogs />;

    // 2. Customer Routes
    if (cleanPath === '/' || cleanPath === '') return <HomePage />;
    if (cleanPath === '/shop') return <ShopPage />;
    if (cleanPath === '/collections') return <CollectionsPage />;
    if (cleanPath === '/cart') return <CartPage />;
    if (cleanPath === '/checkout') return <CheckoutPage />;
    if (cleanPath === '/about') return <AboutPage />;
    if (cleanPath === '/contact') return <ContactPage />;
    if (cleanPath === '/account' || cleanPath === '/account/orders' || cleanPath === '/login' || cleanPath === '/register') {
      return <AccountPage />;
    }

    // Dynamic Product Detail: /product/:slug
    if (cleanPath.startsWith('/product/')) {
      const slug = cleanPath.replace('/product/', '');
      return <ProductDetailPage slug={slug} />;
    }

    // Dynamic Order Success: /order-success/:orderNumber
    if (cleanPath.startsWith('/order-success')) {
      const parts = cleanPath.split('/order-success/');
      const orderNumber = parts[1] || '';
      return <OrderSuccessPage orderNumber={orderNumber} />;
    }

    // 3. 404 Fallback
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#080808]">
        <span className="font-brand text-6xl font-black text-[#222] mb-2">404</span>
        <h2 className="font-brand text-2xl font-bold text-white mb-2 uppercase">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-xs text-[#777] max-w-sm mb-6 font-light">
          Halaman yang Anda tuju mungkin telah dipindahkan atau tautan salah.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-[#DDD] transition-colors"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] flex flex-col font-sans selection:bg-white selection:text-black">
      {/* Toast Notifications */}
      <ToastNotification />

      {/* Customer Header */}
      {!isAdminRoute && <Navbar />}

      {/* Main Routed Content */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Customer Footer */}
      {!isAdminRoute && <Footer />}

      {/* Customer Android Bottom Bar (Only on mobile for customer routes) */}
      {!isAdminRoute && <MobileBottomNav />}

      {/* Global Drawers & Modals */}
      <CartDrawer />
      <QuickViewModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
