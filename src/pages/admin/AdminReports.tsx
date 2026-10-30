/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { StorageService, formatRupiah, formatDate } from '../../services/storage';
import {
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Percent,
  RotateCcw,
  ShoppingBag,
  FileSpreadsheet
} from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { addToast } = useApp();
  const orders = StorageService.getOrders();
  const products = StorageService.getProducts();

  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('monthly');

  // Metrics calculation
  const paidOrders = orders.filter((o) => o.paymentStatus === 'Paid');
  const refundedOrders = orders.filter((o) => o.paymentStatus === 'Refunded');

  const totalOmzet = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalDiskon = orders.reduce((sum, o) => sum + (o.discount || 0), 0);
  const totalRefund = refundedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Estimasi laba kotor (asumsi rata-rata COGS / HPP 45%, laba kotor 55%)
  const estimatedGrossProfit = Math.round(totalOmzet * 0.55);

  // Best selling products
  const topProducts = [...products]
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
    .slice(0, 5);

  // Export to CSV function
  const handleExportCSV = () => {
    try {
      const headers = [
        'Nomor Pesanan',
        'Tanggal',
        'Nama Pelanggan',
        'WhatsApp',
        'Alamat',
        'Kota',
        'Kurir',
        'No. Resi',
        'Status Pesanan',
        'Status Bayar',
        'Subtotal (IDR)',
        'Diskon (IDR)',
        'Ongkir (IDR)',
        'Total Akhir (IDR)',
      ];

      const rows = orders.map((o) => [
        `"${o.orderNumber}"`,
        `"${formatDate(o.createdAt)}"`,
        `"${o.customerName.replace(/"/g, '""')}"`,
        `"${o.customerWhatsApp}"`,
        `"${o.shippingAddress.address.replace(/"/g, '""')}"`,
        `"${o.shippingAddress.city}"`,
        `"${o.shippingCourier || 'JNE'}"`,
        `"${o.trackingNumber || '-'}"`,
        `"${o.orderStatus}"`,
        `"${o.paymentStatus}"`,
        o.subtotal,
        o.discount,
        o.shippingCost,
        o.totalAmount,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `SIENCH_Laporan_Penjualan_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      StorageService.logAdminActivity('Export CSV', 'Laporan penjualan diekspor ke format CSV');
      addToast('File CSV laporan penjualan berhasil diunduh!', 'success');
    } catch {
      addToast('Gagal mengekspor laporan CSV.', 'error');
    }
  };

  return (
    <AdminLayout
      title="Laporan Penjualan & Finansial"
      subtitle="Analisis omzet, estimasi laba kotor, diskon promosi, dan ekspor data CSV transaksi"
    >
      <div className="space-y-8">
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A1A1A]">
          {/* Period Selector */}
          <div className="flex items-center gap-1.5 bg-[#121212] p-1 rounded border border-[#222]">
            {(['daily', 'weekly', 'monthly', 'all'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-colors ${
                  period === p ? 'bg-white text-black' : 'text-[#888] hover:text-white'
                }`}
              >
                {p === 'daily'
                  ? 'Hari Ini'
                  : p === 'weekly'
                  ? 'Minggu Ini'
                  : p === 'monthly'
                  ? 'Bulan Ini'
                  : 'Semua Periode'}
              </button>
            ))}
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Laporan (CSV)</span>
          </button>
        </div>

        {/* 4 Financial Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Omzet */}
          <div className="p-5 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-2">
            <span className="text-xs uppercase tracking-wider text-[#888] font-semibold block">
              Total Omzet Penjualan
            </span>
            <div className="text-2xl font-bold text-white font-brand">
              {formatRupiah(totalOmzet)}
            </div>
            <span className="text-[10px] text-[#777] block">
              Dari {paidOrders.length} transaksi yang lunas
            </span>
          </div>

          {/* Estimasi Laba Kotor */}
          <div className="p-5 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-2">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold block">
              Estimasi Laba Kotor (55%)
            </span>
            <div className="text-2xl font-bold text-emerald-400 font-brand">
              {formatRupiah(estimatedGrossProfit)}
            </div>
            <span className="text-[10px] text-[#777] block">
              Omzet dikurangi estimasi HPP/COGS tas
            </span>
          </div>

          {/* Diskon Terpakai */}
          <div className="p-5 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-2">
            <span className="text-xs uppercase tracking-wider text-[#888] font-semibold block">
              Potongan Diskon Kupon
            </span>
            <div className="text-2xl font-bold text-[#CCC] font-brand">
              {formatRupiah(totalDiskon)}
            </div>
            <span className="text-[10px] text-[#777] block">
              Voucher promo yang diklaim pembeli
            </span>
          </div>

          {/* Pengembalian Dana */}
          <div className="p-5 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-2">
            <span className="text-xs uppercase tracking-wider text-[#888] font-semibold block">
              Total Pengembalian / Retur
            </span>
            <div className="text-2xl font-bold text-rose-400 font-brand">
              {formatRupiah(totalRefund)}
            </div>
            <span className="text-[10px] text-[#777] block">
              {refundedOrders.length} pesanan direfund
            </span>
          </div>

        </div>

        {/* Top Bag Products Performance Table */}
        <div className="p-6 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C]">
            <h3 className="font-brand text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Performa Penjualan Produk Teratas
            </h3>
            <span className="text-xs text-[#777]">Berdasarkan Unit Terjual</span>
          </div>

          <div className="divide-y divide-[#181818]">
            {topProducts.map((p, idx) => {
              const estimatedRevenue = (p.salesCount || 0) * p.price;
              return (
                <div key={p.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-[#777] w-6">0{idx + 1}</span>
                    <div className="w-10 h-12 bg-[#1A1A1A] rounded p-0.5 flex items-center justify-center shrink-0">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="max-h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/products/siench-shadow-tote.jpg';
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{p.name}</h4>
                      <span className="text-[10px] text-[#777]">
                        {p.category} · Harga: {formatRupiah(p.price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 justify-between sm:justify-end text-right">
                    <div>
                      <span className="text-[#888] block text-[10px]">Terjual:</span>
                      <span className="font-bold text-white">{p.salesCount || 0} unit</span>
                    </div>
                    <div>
                      <span className="text-[#888] block text-[10px]">Total Nilai Omzet:</span>
                      <span className="font-bold text-emerald-400">{formatRupiah(estimatedRevenue)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
