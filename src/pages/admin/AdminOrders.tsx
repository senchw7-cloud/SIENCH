/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { StorageService, formatRupiah, formatDate } from '../../services/storage';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import {
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  X,
  ShieldCheck,
  Send
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { addToast } = useApp();
  const [orders, setOrders] = useState<Order[]>(() => StorageService.getOrders());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Form inside modal for updating status & tracking number
  const [newOrderStatus, setNewOrderStatus] = useState<OrderStatus>('Pending');
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus>('Pending');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [courierInput, setCourierInput] = useState('');

  const refreshOrders = () => {
    setOrders(StorageService.getOrders());
  };

  const handleOpenDetail = (ord: Order) => {
    setSelectedOrder(ord);
    setNewOrderStatus(ord.orderStatus);
    setNewPaymentStatus(ord.paymentStatus);
    setTrackingNumberInput(ord.trackingNumber || '');
    setCourierInput(ord.shippingCourier || 'JNE Reguler');
  };

  const handleSaveOrderUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    // Update order status & tracking number
    StorageService.updateOrderStatus(
      selectedOrder.id,
      newOrderStatus,
      trackingNumberInput.trim() || undefined,
      courierInput.trim() || undefined
    );

    // Update payment status
    StorageService.updatePaymentStatus(selectedOrder.id, newPaymentStatus);

    refreshOrders();
    addToast(`Pesanan #${selectedOrder.orderNumber} berhasil diperbarui!`, 'success');
    setSelectedOrder(null);
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerWhatsApp.includes(search) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(search.toLowerCase()));

    const matchStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
    const matchPayment = paymentFilter === 'All' || o.paymentStatus === paymentFilter;

    return matchSearch && matchStatus && matchPayment;
  });

  return (
    <AdminLayout
      title="Manajemen Pesanan & Resi"
      subtitle="Kelola pesanan pelanggan, verifikasi pembayaran, dan input nomor resi pengiriman"
    >
      <div className="space-y-6">
        
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#666]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari no. pesanan, nama, nomor WA, resi..."
                className="w-full bg-[#111] border border-[#252525] rounded py-2 pl-9 pr-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white"
              />
            </div>

            {/* Filter Order Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#111] border border-[#252525] rounded py-2 px-3 text-xs text-white focus:outline-none"
            >
              <option value="All">Semua Status Pesanan</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Filter Payment Status */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-[#111] border border-[#252525] rounded py-2 px-3 text-xs text-white focus:outline-none"
            >
              <option value="All">Semua Status Pembayaran</option>
              <option value="Pending">Bayar: Pending</option>
              <option value="Paid">Bayar: Paid</option>
              <option value="Failed">Bayar: Failed</option>
              <option value="Refunded">Bayar: Refunded</option>
            </select>
          </div>

          <div className="text-xs text-[#888]">
            Total Ditemukan: <strong className="text-white">{filteredOrders.length}</strong>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#0E0E0E] border border-[#1E1E1E] rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141414] text-[#888] uppercase tracking-wider text-[10px] border-b border-[#222]">
                <tr>
                  <th className="py-3 px-4">No. Pesanan</th>
                  <th className="py-3 px-4">Pelanggan</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status Bayar</th>
                  <th className="py-3 px-4">Status Pesanan</th>
                  <th className="py-3 px-4">Nomor Resi</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181818] text-[#CCC]">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#121212] transition-colors">
                    {/* Order Number */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-white">
                        <span>#{ord.orderNumber}</span>
                        {ord.isDemo && (
                          <span className="text-[9px] uppercase px-1 py-0.2 bg-[#222] text-[#888] rounded">
                            DEMO
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#777] block mt-0.5">
                        Metode: {ord.paymentMethod.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-white block">{ord.customerName}</span>
                      <span className="text-[10px] text-[#777] block">{ord.customerWhatsApp}</span>
                      <span className="text-[10px] text-[#555] truncate max-w-[150px] block">
                        {ord.shippingAddress.city}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-[#888]">
                      {formatDate(ord.createdAt)}
                    </td>

                    {/* Total Amount */}
                    <td className="py-3 px-4 font-bold text-white">
                      {formatRupiah(ord.totalAmount)}
                    </td>

                    {/* Payment Status (Separated) */}
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border inline-block ${
                          ord.paymentStatus === 'Paid'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                            : ord.paymentStatus === 'Pending'
                            ? 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                            : ord.paymentStatus === 'Refunded'
                            ? 'bg-purple-950/60 text-purple-400 border-purple-800/40'
                            : 'bg-rose-950/60 text-rose-400 border-rose-800/40'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>

                    {/* Order Status (Separated) */}
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border inline-block ${
                          ord.orderStatus === 'Completed'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                            : ord.orderStatus === 'Shipped'
                            ? 'bg-blue-950/60 text-blue-400 border-blue-800/40'
                            : ord.orderStatus === 'Processing'
                            ? 'bg-cyan-950/60 text-cyan-400 border-cyan-800/40'
                            : ord.orderStatus === 'Pending'
                            ? 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                            : 'bg-neutral-900 text-[#777] border-[#333]'
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>

                    {/* Tracking Number */}
                    <td className="py-3 px-4">
                      {ord.trackingNumber ? (
                        <div className="font-mono text-xs font-bold text-emerald-400">
                          {ord.trackingNumber}
                          <span className="text-[10px] text-[#777] block font-sans">
                            {ord.shippingCourier || 'JNE'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#555] italic">Belum ada resi</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(ord)}
                        className="px-3 py-1 bg-[#1C1C1C] hover:bg-white text-white hover:text-black rounded text-[11px] font-semibold transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail & Update</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Order Detail & Update Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0F0F0F] border border-[#262626] rounded-lg max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#222]">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#888] font-mono">
                  Rincian Transaksi
                </span>
                <h3 className="font-brand text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span>Pesanan #{selectedOrder.orderNumber}</span>
                  {selectedOrder.isDemo && (
                    <span className="text-[9px] px-1.5 py-0.2 bg-[#222] text-[#888] rounded">DEMO</span>
                  )}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-[#888] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#141414] rounded border border-[#222] text-xs">
              <div>
                <span className="text-[#666] uppercase tracking-wider text-[10px] block mb-1">
                  Data Pelanggan
                </span>
                <span className="text-white font-bold block">{selectedOrder.customerName}</span>
                <span className="text-[#AAA] block">WhatsApp: {selectedOrder.customerWhatsApp}</span>
                {selectedOrder.customerEmail && (
                  <span className="text-[#AAA] block">Email: {selectedOrder.customerEmail}</span>
                )}
              </div>

              <div>
                <span className="text-[#666] uppercase tracking-wider text-[10px] block mb-1">
                  Alamat Kirim
                </span>
                <span className="text-white font-medium block">
                  {selectedOrder.shippingAddress.address}
                </span>
                <span className="text-[#AAA] block">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province}{' '}
                  {selectedOrder.shippingAddress.postalCode}
                </span>
              </div>
            </div>

            {/* Items Table in Modal */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Produk Pesanan ({selectedOrder.items.length})
              </span>
              <div className="divide-y divide-[#222] border border-[#222] rounded p-2 bg-[#121212]">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-12 bg-[#1A1A1A] rounded p-0.5 flex items-center justify-center shrink-0">
                        <img
                          src={it.image}
                          alt={it.name}
                          className="max-h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/products/siench-shadow-tote.jpg';
                          }}
                        />
                      </div>
                      <div>
                        <span className="text-white font-bold block">{it.name}</span>
                        <span className="text-[#777] text-[10px]">SKU: {it.sku} · {it.quantity} unit</span>
                      </div>
                    </div>
                    <span className="font-bold text-white">
                      {formatRupiah(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[#121212] rounded border border-[#222] text-xs space-y-1 text-[#888]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-white">{formatRupiah(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Diskon Kupon ({selectedOrder.couponCode}):</span>
                    <span>-{formatRupiah(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Ongkir:</span>
                  <span className="text-white">{formatRupiah(selectedOrder.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#222]">
                  <span>Total Tagihan:</span>
                  <span>{formatRupiah(selectedOrder.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Status & Resi Update Form */}
            <form onSubmit={handleSaveOrderUpdate} className="space-y-4 pt-4 border-t border-[#222] text-xs">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Update Status Pesanan & Nomor Resi
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Order Status */}
                <div>
                  <label className="text-[#AAA] block mb-1 font-semibold">
                    Status Pemrosesan Pesanan
                  </label>
                  <select
                    value={newOrderStatus}
                    onChange={(e) => setNewOrderStatus(e.target.value as OrderStatus)}
                    className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
                  >
                    <option value="Pending">Pending (Menunggu)</option>
                    <option value="Processing">Processing (Sedang Dikemas)</option>
                    <option value="Shipped">Shipped (Dalam Pengiriman)</option>
                    <option value="Completed">Completed (Selesai Diterima)</option>
                    <option value="Cancelled">Cancelled (Dibatalkan)</option>
                  </select>
                </div>

                {/* Payment Status (Separated) */}
                <div>
                  <label className="text-[#AAA] block mb-1 font-semibold">
                    Status Validasi Pembayaran
                  </label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
                  >
                    <option value="Pending">Pending (Belum Dibayar)</option>
                    <option value="Paid">Paid (Terverifikasi Lunas)</option>
                    <option value="Failed">Failed (Gagal / Ditolak)</option>
                    <option value="Refunded">Refunded (Dana Dikembalikan)</option>
                  </select>
                </div>

                {/* Courier */}
                <div>
                  <label className="text-[#AAA] block mb-1 font-semibold">
                    Ekspedisi Kurir
                  </label>
                  <input
                    type="text"
                    value={courierInput}
                    onChange={(e) => setCourierInput(e.target.value)}
                    placeholder="Contoh: JNE Reguler / SiCepat BEST"
                    className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
                  />
                </div>

                {/* Tracking Number */}
                <div>
                  <label className="text-[#AAA] block mb-1 font-semibold">
                    Nomor Resi Pengiriman
                  </label>
                  <input
                    type="text"
                    value={trackingNumberInput}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    placeholder="Contoh: JNE-9920194819"
                    className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-[#222]">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-[#2B2B2B] text-[#888] hover:text-white rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-white text-black font-bold uppercase tracking-wider rounded hover:bg-[#DDD]"
                >
                  Simpan Perubahan
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </AdminLayout>
  );
};
