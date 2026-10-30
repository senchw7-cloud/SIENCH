/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StorageService, formatRupiah, formatDate } from '../services/storage';
import {
  CheckCircle,
  Copy,
  Clock,
  Truck,
  MessageCircle,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface OrderSuccessPageProps {
  orderNumber?: string;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderNumber }) => {
  const { navigate, addToast, siteSettings, lastOrder } = useApp();

  // Try to find order from storage or fallback to lastOrder
  const orders = StorageService.getOrders();
  const order =
    (orderNumber ? orders.find((o) => o.orderNumber === orderNumber) : null) ||
    lastOrder ||
    orders[0];

  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Pesanan Tidak Ditemukan</h2>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider rounded"
        >
          Ke Katalog
        </button>
      </div>
    );
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    addToast(`${label} disalin ke clipboard!`, 'success');
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handleWhatsAppConfirm = () => {
    const phone = siteSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Halo SIENCH Care, saya sudah melakukan pembayaran untuk Pesanan #${order.orderNumber} atas nama ${order.customerName} sebesar ${formatRupiah(order.totalAmount)}. Mohon bantuan verifikasi dan proses pengiriman. Terima kasih.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="bg-[#080808] min-h-screen py-8 sm:py-16 border-b border-[#1A1A1A]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Card Header */}
        <div className="text-center p-8 bg-[#0D0D0D] border border-[#222222] rounded-t-lg">
          <div className="w-14 h-14 bg-emerald-950/60 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <CheckCircle className="w-8 h-8" />
          </div>

          <span className="text-[11px] uppercase tracking-[0.25em] text-[#888] font-semibold block mb-1">
            Pesanan Berhasil Dibuat
          </span>
          <h1 className="font-brand text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase mb-2">
            TERIMA KASIH ATAS PESANAN ANDA
          </h1>
          <p className="text-xs text-[#999] max-w-md mx-auto leading-relaxed">
            Nomor referensi pesanan Anda:{' '}
            <strong className="text-white font-mono">{order.orderNumber}</strong>. Simpan nomor ini untuk keperluan pelacakan.
          </p>
        </div>

        {/* Payment Instructions Box */}
        <div className="p-6 bg-[#121212] border-x border-[#222222] space-y-6">
          
          {order.paymentMethod === 'bank_transfer' && (
            <div className="p-5 bg-[#171717] border border-[#2B2B2B] rounded space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#282828]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Instruksi Pembayaran Transfer Bank
                  </span>
                </div>
                <span className="text-[10px] text-amber-400 font-semibold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                  Status: Menunggu Pembayaran
                </span>
              </div>

              <p className="text-xs text-[#AAA]">
                Silakan transfer nominal tepat sejumlah{' '}
                <strong className="text-white text-sm">{formatRupiah(order.totalAmount)}</strong> ke salah satu rekening resmi SIENCH:
              </p>

              <div className="space-y-3">
                {/* BCA */}
                <div className="flex items-center justify-between p-3 bg-[#0A0A0A] border border-[#222] rounded">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#888] block">Bank BCA</span>
                    <span className="font-mono text-sm font-bold text-white">8802 9103 8102 938</span>
                    <span className="text-[10px] text-[#777] block">a.n. PT SIENCH KREASI INDONESIA</span>
                  </div>
                  <button
                    onClick={() => handleCopy('880291038102938', 'BCA')}
                    className="p-2 text-xs bg-[#222] hover:bg-white text-white hover:text-black rounded transition-colors flex items-center gap-1 font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedAccount === 'BCA' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>

                {/* Mandiri */}
                <div className="flex items-center justify-between p-3 bg-[#0A0A0A] border border-[#222] rounded">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#888] block">Bank Mandiri</span>
                    <span className="font-mono text-sm font-bold text-white">1370 0928 4719 0</span>
                    <span className="text-[10px] text-[#777] block">a.n. SIENCH OFFICIAL STORE</span>
                  </div>
                  <button
                    onClick={() => handleCopy('1370092847190', 'Mandiri')}
                    className="p-2 text-xs bg-[#222] hover:bg-white text-white hover:text-black rounded transition-colors flex items-center gap-1 font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedAccount === 'Mandiri' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-[#111] rounded border border-[#262626] text-[11px] text-[#888] flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Sesuai kebijakan sistem, pembayaran Anda akan diverifikasi oleh finance kami sebelum nomor resi diterbitkan.
                </span>
              </div>
            </div>
          )}

          {order.paymentMethod === 'qris' && (
            <div className="p-5 bg-[#171717] border border-[#2B2B2B] rounded text-center space-y-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Pindai QRIS Resmi SIENCH
              </span>
              <p className="text-xs text-[#AAA]">
                Gunakan aplikasi mobile banking atau e-wallet apa saja untuk memindai kode QR di bawah ini:
              </p>

              {/* Dynamic QR SVG */}
              <div className="w-48 h-48 mx-auto bg-white p-3 rounded shadow-lg flex flex-col items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=SIENCH-ORDER-${order.orderNumber}-AMOUNT-${order.totalAmount}`}
                  alt="QRIS Code"
                  onError={(e) => {
                    // Fallback to offline SVG QR placeholder
                    e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="black"><rect width="100" height="100" fill="white"/><rect x="10" y="10" width="30" height="30" fill="black"/><rect x="15" y="15" width="20" height="20" fill="white"/><rect x="20" y="20" width="10" height="10" fill="black"/><rect x="60" y="10" width="30" height="30" fill="black"/><rect x="65" y="15" width="20" height="20" fill="white"/><rect x="70" y="20" width="10" height="10" fill="black"/><rect x="10" y="60" width="30" height="30" fill="black"/><rect x="15" y="65" width="20" height="20" fill="white"/><rect x="20" y="70" width="10" height="10" fill="black"/><rect x="50" y="50" width="15" height="15" fill="black"/><rect x="75" y="60" width="15" height="15" fill="black"/><rect x="50" y="75" width="20" height="15" fill="black"/></svg>';
                  }}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-xs font-bold text-white">
                Total Nominal:{' '}
                <span className="text-emerald-400 text-sm">{formatRupiah(order.totalAmount)}</span>
              </div>
            </div>
          )}

          {/* WhatsApp Direct Confirmation Button */}
          <button
            onClick={handleWhatsAppConfirm}
            className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Konfirmasi Pembayaran via WhatsApp CS</span>
          </button>

          {/* Order Details Breakdown */}
          <div className="pt-4 border-t border-[#222] space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Rincian Pengiriman & Pesanan
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#AAA]">
              <div>
                <span className="text-[#666] block">Penerima:</span>
                <span className="text-white font-medium">{order.customerName}</span>
                <span className="text-[#888] block">{order.customerWhatsApp}</span>
              </div>

              <div>
                <span className="text-[#666] block">Tujuan Pengiriman:</span>
                <span className="text-white font-medium">{order.shippingAddress.address}</span>
                <span className="text-[#888] block">
                  {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
                </span>
              </div>

              <div>
                <span className="text-[#666] block">Ekspedisi:</span>
                <span className="text-white font-medium">{order.shippingCourier || 'JNE Reguler'}</span>
                {order.trackingNumber && (
                  <span className="text-emerald-400 font-mono block mt-0.5">Resi: {order.trackingNumber}</span>
                )}
              </div>

              <div>
                <span className="text-[#666] block">Tanggal Dibuat:</span>
                <span className="text-white font-medium">{formatDate(order.createdAt)}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="pt-3 border-t border-[#222] space-y-2">
              <span className="text-[11px] text-[#777] uppercase font-semibold block">Daftar Tas:</span>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs py-1">
                  <span className="text-white">
                    {item.name} <span className="text-[#777]">({item.quantity}x)</span>
                  </span>
                  <span className="text-[#CCC] font-medium">{formatRupiah(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#222] flex justify-between items-center text-sm font-bold text-white">
              <span>Total Akhir:</span>
              <span>{formatRupiah(order.totalAmount)}</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#0D0D0D] border border-[#222222] rounded-b-lg flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => navigate('/account/orders')}
            className="w-full sm:w-auto text-xs text-[#888] hover:text-white transition-colors"
          >
            Lacak Pesanan di Menu Akun &rarr;
          </button>

          <button
            onClick={() => navigate('/shop')}
            className="w-full sm:w-auto px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider rounded hover:bg-[#DDD] transition-colors"
          >
            Kembali Belanja
          </button>
        </div>

      </div>
    </div>
  );
};
