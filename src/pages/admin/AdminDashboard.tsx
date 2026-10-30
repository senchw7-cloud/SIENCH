/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { StorageService, formatRupiah, formatDate } from '../../services/storage';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  Clock,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  TrendingUp,
  Plus
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { navigate, products } = useApp();
  const orders = StorageService.getOrders();
  const customers = StorageService.getCustomers();

  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Calculate metrics directly from actual stored data
  const totalSales = orders
    .filter((o) => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending').length;
  const processingOrders = orders.filter((o) => o.orderStatus === 'Processing').length;
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock);

  // Best seller ranking
  const bestSellers = [...products]
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
    .slice(0, 5);

  // Chart data simulation breakdown
  const chartData = {
    daily: [
      { label: 'Sen', sales: 1250000, orders: 2 },
      { label: 'Sel', sales: 1890000, orders: 3 },
      { label: 'Rab', sales: 2450000, orders: 4 },
      { label: 'Kam', sales: 1980000, orders: 3 },
      { label: 'Jum', sales: 3200000, orders: 5 },
      { label: 'Sab', sales: 4100000, orders: 7 },
      { label: 'Min', sales: 3600000, orders: 6 },
    ],
    weekly: [
      { label: 'M1 Okt', sales: 12400000, orders: 20 },
      { label: 'M2 Okt', sales: 18600000, orders: 28 },
      { label: 'M3 Okt', sales: 24800000, orders: 37 },
      { label: 'M4 Okt', sales: 31200000, orders: 46 },
    ],
    monthly: [
      { label: 'Jul', sales: 48000000, orders: 75 },
      { label: 'Agt', sales: 62000000, orders: 94 },
      { label: 'Sep', sales: 74000000, orders: 112 },
      { label: 'Okt', sales: 86500000, orders: 131 },
    ],
  }[period];

  const maxSales = Math.max(...chartData.map((d) => d.sales));

  return (
    <AdminLayout
      title="Dashboard Overview"
      subtitle="Ringkasan operasional bisnis, penjualan, dan inventaris produk SIENCH"
    >
      <div className="space-y-8">
        
        {/* Top Action Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-2 text-xs text-[#888]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sistem Operasional Aktif · Database Sinkron</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/products?action=new')}
              className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5 hover:bg-[#DDD] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Produk Baru</span>
            </button>
          </div>
        </div>

        {/* 8 Metric KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Total Penjualan */}
          <div className="p-5 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-2">
            <div className="flex items-center justify-between text-[#888] text-xs">
              <span className="uppercase font-semibold tracking-wider">Total Omzet</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white font-brand">
              {formatRupiah(totalSales)}
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#777]">
              <span>Pesanan Berhasil</span>
              <span className="bg-[#181818] px-1.5 py-0.5 rounded text-[#999] font-mono">
                {orders.filter((o) => o.paymentStatus === 'Paid').length} trx
              </span>
            </div>
          </div>

          {/* 2. Total Pesanan */}
          <div className="p-5 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-2">
            <div className="flex items-center justify-between text-[#888] text-xs">
              <span className="uppercase font-semibold tracking-wider">Total Pesanan</span>
              <FileTextIcon className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white font-brand">
              {totalOrders}
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#777]">
              <span>Keseluruhan</span>
              <span className="bg-[#181818] px-1.5 py-0.5 rounded text-[#999]">
                Live & Demo
              </span>
            </div>
          </div>

          {/* 3. Total Produk */}
          <div className="p-5 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-2">
            <div className="flex items-center justify-between text-[#888] text-xs">
              <span className="uppercase font-semibold tracking-wider">Katalog Produk</span>
              <ShoppingBag className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white font-brand">
              {products.length}
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#777]">
              <span>Aktif: {products.filter((p) => p.isActive).length}</span>
              <button
                onClick={() => navigate('/admin/products')}
                className="hover:text-white underline text-[10px]"
              >
                Kelola
              </button>
            </div>
          </div>

          {/* 4. Total Pelanggan */}
          <div className="p-5 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-2">
            <div className="flex items-center justify-between text-[#888] text-xs">
              <span className="uppercase font-semibold tracking-wider">Total Pelanggan</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white font-brand">
              {customers.length}
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#777]">
              <span>Terdaftar</span>
              <button
                onClick={() => navigate('/admin/customers')}
                className="hover:text-white underline text-[10px]"
              >
                Detail
              </button>
            </div>
          </div>

          {/* 5. Pesanan Menunggu */}
          <div className="p-5 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-2">
            <div className="flex items-center justify-between text-[#888] text-xs">
              <span className="uppercase font-semibold tracking-wider">Menunggu Bayar</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-amber-400 font-brand">
              {pendingOrders}
            </div>
            <div className="text-[10px] text-[#777]">Perlu konfirmasi pembayaran</div>
          </div>

          {/* 6. Pesanan Diproses */}
          <div className="p-5 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-2">
            <div className="flex items-center justify-between text-[#888] text-xs">
              <span className="uppercase font-semibold tracking-wider">Sedang Diproses</span>
              <Package className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-blue-400 font-brand">
              {processingOrders}
            </div>
            <div className="text-[10px] text-[#777]">Siap kirim & buat resi</div>
          </div>

          {/* 7. Stok Menipis Alert */}
          <div className="p-5 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-2">
            <div className="flex items-center justify-between text-[#888] text-xs">
              <span className="uppercase font-semibold tracking-wider">Stok Menipis</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-rose-400 font-brand">
              {lowStockProducts.length}
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#777]">
              <span>Stok &le; Min</span>
              <button
                onClick={() => navigate('/admin/inventory')}
                className="hover:text-white underline text-[10px]"
              >
                Restock
              </button>
            </div>
          </div>

          {/* 8. Produk Terlaris Utama */}
          <div className="p-5 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-2">
            <div className="flex items-center justify-between text-[#888] text-xs">
              <span className="uppercase font-semibold tracking-wider">Top Best Seller</span>
              <Flame className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-sm font-bold text-white truncate font-brand">
              {bestSellers[0]?.name || 'N/A'}
            </div>
            <div className="text-[10px] text-[#777]">
              Terjual: <strong className="text-white">{bestSellers[0]?.salesCount || 0} unit</strong>
            </div>
          </div>

        </div>

        {/* Sales Chart Section with Period Tabs */}
        <div className="p-6 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1C1C1C]">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-white" />
                <h3 className="font-brand text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  Grafik Pertumbuhan Penjualan SIENCH
                </h3>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 bg-[#222] text-[#888] rounded">
                  DEMO DATA
                </span>
              </div>
              <p className="text-xs text-[#777] mt-0.5">
                Estimasi performa omzet dan volume transaksi berkala
              </p>
            </div>

            {/* Period Switcher */}
            <div className="flex items-center bg-[#141414] p-1 rounded border border-[#262626]">
              {(['daily', 'weekly', 'monthly'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 text-xs font-semibold rounded uppercase tracking-wider transition-colors ${
                    period === p ? 'bg-white text-black' : 'text-[#888] hover:text-white'
                  }`}
                >
                  {p === 'daily' ? 'Harian' : p === 'weekly' ? 'Mingguan' : 'Bulanan'}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Bars Visualizer */}
          <div className="pt-6">
            <div className="grid grid-flow-col auto-cols-fr gap-4 items-end h-52 pb-4 border-b border-[#222]">
              {chartData.map((d, idx) => {
                const heightPercent = Math.max(15, Math.round((d.sales / maxSales) * 100));
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white bg-[#1A1A1A] px-2 py-1 rounded border border-[#333] whitespace-nowrap">
                      {formatRupiah(d.sales)} ({d.orders} pesanan)
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[48px] bg-gradient-to-t from-[#222] to-white/80 group-hover:to-white rounded-t transition-all"
                    />
                    <span className="text-xs text-[#888] group-hover:text-white font-medium">
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#666] pt-3">
              <span>*Data agregasi transaksi disinkronkan secara berkala</span>
              <button
                onClick={() => navigate('/admin/reports')}
                className="text-white hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Lihat Laporan Lengkap & Ekspor CSV</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 2 Bottom Tables: Recent Orders & Best Selling Bags */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Recent Orders (7 cols) */}
          <div className="lg:col-span-7 p-6 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C]">
              <h3 className="font-brand text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Pesanan Masuk Terbaru
              </h3>
              <button
                onClick={() => navigate('/admin/orders')}
                className="text-xs text-[#888] hover:text-white"
              >
                Semua Pesanan &rarr;
              </button>
            </div>

            <div className="divide-y divide-[#1A1A1A] overflow-x-auto">
              {orders.slice(0, 5).map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between text-xs gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">#{ord.orderNumber}</span>
                      {ord.isDemo && (
                        <span className="text-[9px] bg-[#222] text-[#888] px-1 rounded">DEMO</span>
                      )}
                    </div>
                    <span className="text-[#888] text-[11px] block mt-0.5">
                      {ord.customerName} · {formatDate(ord.createdAt)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-white block">{formatRupiah(ord.totalAmount)}</span>
                    <span
                      className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        ord.orderStatus === 'Completed'
                          ? 'text-emerald-400 bg-emerald-950/40'
                          : ord.orderStatus === 'Shipped'
                          ? 'text-blue-400 bg-blue-950/40'
                          : 'text-amber-400 bg-amber-950/40'
                      }`}
                    >
                      {ord.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Bag Masterpieces (5 cols) */}
          <div className="lg:col-span-5 p-6 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C]">
              <h3 className="font-brand text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Produk Terlaris
              </h3>
              <span className="text-xs text-[#777]">Berdasarkan Penjualan</span>
            </div>

            <div className="space-y-3">
              {bestSellers.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 bg-[#121212] rounded border border-[#1E1E1E]"
                >
                  <span className="w-5 text-center font-mono text-xs font-bold text-[#888]">
                    0{idx + 1}
                  </span>
                  <div className="w-10 h-12 bg-[#181818] rounded overflow-hidden p-0.5 shrink-0 flex items-center justify-center">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.src = '/images/products/siench-shadow-tote.jpg';
                      }}
                      className="max-h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                    <span className="text-[11px] text-[#888]">{formatRupiah(item.price)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white">{item.salesCount || 0} unit</span>
                    <span className="text-[10px] text-[#777] block">Sisa: {item.stock}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
};

// Helper icon
const FileTextIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);
