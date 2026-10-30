/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  FileText,
  Users,
  Boxes,
  TicketPercent,
  BarChart3,
  Settings,
  History,
  LogOut,
  Store,
  Menu,
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, subtitle }) => {
  const { currentPath, navigate, adminLogout, isAdminLoggedIn } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If not logged in, redirect or display warning
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
        <div className="p-8 bg-[#111] border border-[#222] rounded max-w-md text-center space-y-4">
          <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="font-brand text-xl font-bold text-white uppercase">Akses Dibatasi</h2>
          <p className="text-xs text-[#888]">
            Anda harus masuk sebagai administrator untuk melihat halaman kontrol panel ini.
          </p>
          <button
            onClick={() => navigate('/admin/login')}
            className="w-full py-3 bg-white text-black text-xs font-bold uppercase tracking-wider rounded"
          >
            Menuju Login Admin
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Katalog Produk', path: '/admin/products', icon: ShoppingBag },
    { label: 'Kategori', path: '/admin/categories', icon: Layers },
    { label: 'Pesanan & Resi', path: '/admin/orders', icon: FileText },
    { label: 'Pelanggan', path: '/admin/customers', icon: Users },
    { label: 'Manajemen Stok', path: '/admin/inventory', icon: Boxes },
    { label: 'Promo & Voucher', path: '/admin/promotions', icon: TicketPercent },
    { label: 'Laporan Penjualan', path: '/admin/reports', icon: BarChart3 },
    { label: 'Pengaturan Web', path: '/admin/settings', icon: Settings },
    { label: 'Log Aktivitas', path: '/admin/activity-logs', icon: History },
  ];

  return (
    <div className="min-h-screen bg-[#060606] text-[#F5F5F5] flex flex-col md:flex-row">
      
      {/* Mobile Admin Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0A0A0A] border-b border-[#1A1A1A] sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-white bg-[#141414] border border-[#222] rounded"
            aria-label="Buka Menu Admin"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <span className="font-brand text-base font-extrabold tracking-wider text-white">
              SIENCH
            </span>
            <span className="text-[10px] text-emerald-400 font-bold ml-1.5 uppercase">Admin</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="p-1.5 text-xs text-[#AAA] hover:text-white flex items-center gap-1 bg-[#141414] border border-[#222] rounded px-2.5"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Lihat Toko</span>
        </button>
      </div>

      {/* Sidebar for Desktop & Drawer for Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0A0A] border-r border-[#1C1C1C] flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-[#1C1C1C] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-brand text-xl font-black tracking-widest text-white">
                  SIENCH
                </span>
                <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-1.5 py-0.2 rounded font-mono font-bold uppercase">
                  Control
                </span>
              </div>
              <p className="text-[10px] text-[#777] uppercase tracking-wider mt-0.5">
                Internal Management
              </p>
            </div>
            
            {/* Mobile close */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-[#888] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded text-xs font-semibold tracking-wide transition-colors ${
                    isActive
                      ? 'bg-white text-black font-bold'
                      : 'text-[#888] hover:text-white hover:bg-[#141414]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-black" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#1C1C1C] space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#AAA] hover:text-white hover:bg-[#141414] rounded transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>Lihat Website Pelanggan</span>
          </button>

          <button
            onClick={adminLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Admin</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 z-40 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#080808]">
        
        {/* Top bar with Breadcrumbs & Title */}
        <div className="p-6 sm:p-8 pb-4 border-b border-[#1A1A1A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#777] mb-1">
              <span>SIENCH Admin</span>
              <span>/</span>
              <span className="text-[#CCC]">{title}</span>
            </div>
            <h1 className="font-brand text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-[#888] mt-0.5 font-light">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#888] bg-[#111] px-3 py-1.5 rounded border border-[#222]">
              User: <strong className="text-white">admin@siench.com</strong>
            </span>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 sm:p-8 flex-1">
          {children}
        </div>
      </main>

    </div>
  );
};
