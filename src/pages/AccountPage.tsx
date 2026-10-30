/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StorageService, formatRupiah, formatDate } from '../services/storage';
import { ProductCard } from '../components/ProductCard';
import {
  Package,
  Heart,
  User,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Search
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { navigate, wishlist, products, user, setUser, addToast } = useApp();
  const orders = StorageService.getOrders();

  // Tab: 'orders' | 'wishlist' | 'profile'
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const initialTab = (urlParams.get('tab') as any) || 'orders';
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>(initialTab);

  const [orderSearch, setOrderSearch] = useState('');

  // Wishlisted product models
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (!orderSearch.trim()) return true;
    const q = orderSearch.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-[#080808] min-h-screen py-8 sm:py-14 border-b border-[#1A1A1A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#1C1C1C] mb-8 gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#888] font-semibold block mb-1">
              Customer Portal
            </span>
            <h1 className="font-brand text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
              Akun & Pelacakan Pesanan
            </h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 bg-[#121212] p-1 rounded border border-[#222]">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'orders' ? 'bg-white text-black' : 'text-[#888] hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Pesanan ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'wishlist' ? 'bg-white text-black' : 'text-[#888] hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Wishlist ({wishlist.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'profile' ? 'bg-white text-black' : 'text-[#888] hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profil</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Orders Tracking */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#666]" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Cari nomor pesanan atau no. resi..."
                  className="w-full bg-[#101010] border border-[#242424] rounded py-2 pl-9 pr-3 text-xs text-white placeholder-[#666] focus:outline-none focus:border-white"
                />
              </div>
              <span className="text-xs text-[#777]">
                Total: <strong>{filteredOrders.length}</strong> transaksi
              </span>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center bg-[#0E0E0E] border border-[#1E1E1E] rounded">
                <Package className="w-10 h-10 text-[#444] mx-auto mb-2" />
                <p className="text-sm font-bold text-white mb-1">Belum Ada Riwayat Pesanan</p>
                <p className="text-xs text-[#777] mb-4">Semua pesanan yang Anda buat akan tercatat rapi di sini.</p>
                <button
                  onClick={() => navigate('/shop')}
                  className="px-5 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider rounded"
                >
                  Mulai Belanja
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-4"
                  >
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1C1C1C] gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-white">
                          #{ord.orderNumber}
                        </span>
                        {ord.isDemo && (
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 bg-[#222] text-[#888] rounded">
                            DEMO
                          </span>
                        )}
                        <span className="text-xs text-[#777]">· {formatDate(ord.createdAt)}</span>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-2">
                        {/* Order status */}
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                            ord.orderStatus === 'Completed'
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                              : ord.orderStatus === 'Shipped'
                              ? 'bg-blue-950/40 text-blue-400 border-blue-800/40'
                              : ord.orderStatus === 'Processing'
                              ? 'bg-amber-950/40 text-amber-400 border-amber-800/40'
                              : 'bg-neutral-900 text-[#AAA] border-[#333]'
                          }`}
                        >
                          Status: {ord.orderStatus}
                        </span>

                        {/* Payment status */}
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                            ord.paymentStatus === 'Paid'
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                              : ord.paymentStatus === 'Pending'
                              ? 'bg-amber-950/40 text-amber-400 border-amber-800/40'
                              : 'bg-rose-950/40 text-rose-400 border-rose-800/40'
                          }`}
                        >
                          Bayar: {ord.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Items and Delivery info */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                      <div className="md:col-span-8 space-y-2">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between py-1">
                            <span className="text-white font-medium">
                              {it.name} <span className="text-[#777]">({it.quantity}x)</span>
                            </span>
                            <span className="text-[#CCC]">{formatRupiah(it.price * it.quantity)}</span>
                          </div>
                        ))}

                        <div className="pt-2 border-t border-[#1C1C1C] flex justify-between text-white font-bold">
                          <span>Total Pembayaran:</span>
                          <span className="text-sm">{formatRupiah(ord.totalAmount)}</span>
                        </div>
                      </div>

                      <div className="md:col-span-4 bg-[#141414] p-3 rounded border border-[#222] space-y-1.5 text-[11px] text-[#888]">
                        <span className="text-white font-semibold block uppercase tracking-wider">
                          Pengiriman:
                        </span>
                        <div>Kurir: <strong className="text-[#CCC]">{ord.shippingCourier || 'JNE'}</strong></div>
                        <div>Tujuan: {ord.shippingAddress.city}, {ord.shippingAddress.province}</div>
                        {ord.trackingNumber ? (
                          <div className="pt-1 border-t border-[#222]">
                            <span className="text-[#777] block">Nomor Resi:</span>
                            <span className="font-mono text-xs font-bold text-emerald-400">
                              {ord.trackingNumber}
                            </span>
                          </div>
                        ) : (
                          <div className="text-amber-500/80 italic">Nomor resi sedang disiapkan</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistedProducts.length === 0 ? (
              <div className="p-12 text-center bg-[#0E0E0E] border border-[#1E1E1E] rounded">
                <Heart className="w-10 h-10 text-[#444] mx-auto mb-2" />
                <p className="text-sm font-bold text-white mb-1">Wishlist Anda Masih Kosong</p>
                <p className="text-xs text-[#777] mb-4">Simpan tas favorit Anda dengan menekan ikon hati pada katalog.</p>
                <button
                  onClick={() => navigate('/shop')}
                  className="px-5 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider rounded"
                >
                  Jelajahi Produk
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {wishlistedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Profile */}
        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto p-6 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-4">
            <h3 className="font-brand text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-[#222]">
              Profil Konsumen SIENCH
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#777] block mb-1">Nama</label>
                <div className="p-2.5 bg-[#141414] rounded border border-[#222] text-white">
                  {user?.name || 'Tamu / Pelanggan SIENCH'}
                </div>
              </div>

              <div>
                <label className="text-[#777] block mb-1">Email</label>
                <div className="p-2.5 bg-[#141414] rounded border border-[#222] text-white">
                  {user?.email || 'customer@siench.id'}
                </div>
              </div>

              <div>
                <label className="text-[#777] block mb-1">Nomor WhatsApp Terhubung</label>
                <div className="p-2.5 bg-[#141414] rounded border border-[#222] text-white">
                  {user?.phone || '0812xxxxxxxx'}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#222] flex justify-between items-center text-[11px] text-[#666]">
              <span>SIENCH Membership Tier: <strong>Black Member</strong></span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
