/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StorageService, formatRupiah } from '../services/storage';
import { PaymentMethod, ShippingAddress } from '../types';
import {
  CreditCard,
  QrCode,
  MessageCircle,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, navigate, addToast, siteSettings, setLastOrder } = useApp();

  // Form states
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    province: 'DKI Jakarta',
    postalCode: '',
  });

  const [orderNotes, setOrderNotes] = useState('');
  const [courier, setCourier] = useState<'JNE Reguler' | 'SiCepat BEST' | 'J&T Express'>('JNE Reguler');
  const [courierCost, setCourierCost] = useState<number>(15000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-brand text-2xl font-bold text-white mb-2 uppercase">
          Keranjang Belanja Kosong
        </h2>
        <p className="text-xs text-[#777] mb-6">Silakan pilih produk terlebih dahulu sebelum checkout.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider rounded"
        >
          Ke Toko Tas
        </button>
      </div>
    );
  }

  const handleCourierChange = (selected: 'JNE Reguler' | 'SiCepat BEST' | 'J&T Express', cost: number) => {
    setCourier(selected);
    setCourierCost(cost);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const res = StorageService.validateCoupon(couponCode, cartSubtotal);
    if (res.valid) {
      setAppliedCoupon({ code: res.coupon!.code, discount: res.discount });
      addToast(res.message, 'success');
    } else {
      addToast(res.message, 'error');
    }
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + courierCost);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName.trim()) {
      addToast('Silakan isi nama lengkap penerima.', 'error');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 9) {
      addToast('Silakan isi nomor WhatsApp aktif yang valid.', 'error');
      return;
    }
    if (!formData.address.trim()) {
      addToast('Silakan isi alamat lengkap pengiriman.', 'error');
      return;
    }
    if (!formData.city.trim()) {
      addToast('Silakan isi kota atau kabupaten.', 'error');
      return;
    }

    setIsSubmitting(true);

    // Call storage service with server-side simulation & stock checks
    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images[0],
      sku: item.product.sku,
    }));

    const result = StorageService.createOrder({
      customerName: formData.fullName,
      customerWhatsApp: formData.phone,
      customerEmail: formData.email,
      shippingAddress: formData,
      orderNotes,
      items: orderItems,
      subtotal: cartSubtotal,
      discount: discountAmount,
      shippingCost: courierCost,
      totalAmount: grandTotal,
      paymentMethod,
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      shippingCourier: courier,
      couponCode: appliedCoupon?.code,
    });

    setIsSubmitting(false);

    if (!result.success) {
      addToast(result.error || 'Terjadi kesalahan saat memproses pesanan.', 'error');
      return;
    }

    const newOrder = result.order!;
    setLastOrder(newOrder);

    // If payment method is WhatsApp direct order, prepare formatted WA text
    if (paymentMethod === 'whatsapp') {
      const waNumber = siteSettings.whatsappNumber.replace(/[^0-9]/g, '');
      const itemsListText = newOrder.items
        .map((it) => `- ${it.name} (${it.quantity}x) = ${formatRupiah(it.price * it.quantity)}`)
        .join('\n');

      const waMsg = encodeURIComponent(
        `*PESANAN BARU SIENCH OFFICIAL*\n` +
        `Nomor Pesanan: ${newOrder.orderNumber}\n` +
        `Nama: ${newOrder.customerName}\n` +
        `WhatsApp: ${newOrder.customerWhatsApp}\n` +
        `Alamat: ${newOrder.shippingAddress.address}, ${newOrder.shippingAddress.city}, ${newOrder.shippingAddress.province} ${newOrder.shippingAddress.postalCode}\n` +
        `Kurir: ${newOrder.shippingCourier}\n\n` +
        `*Detail Tas:*\n${itemsListText}\n\n` +
        `Subtotal: ${formatRupiah(newOrder.subtotal)}\n` +
        `Diskon: -${formatRupiah(newOrder.discount)}\n` +
        `Ongkir: ${formatRupiah(newOrder.shippingCost)}\n` +
        `*TOTAL: ${formatRupiah(newOrder.totalAmount)}*\n\n` +
        `Mohon instruksi nomor rekening pembayaran. Terima kasih!`
      );

      window.open(`https://wa.me/${waNumber}?text=${waMsg}`, '_blank');
    }

    addToast(`Pesanan #${newOrder.orderNumber} berhasil dibuat!`, 'success');
    navigate(`/order-success/${newOrder.orderNumber}`);
  };

  return (
    <div className="bg-[#080808] min-h-screen py-8 sm:py-14 border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 pb-4 border-b border-[#1C1C1C]">
          <h1 className="font-brand text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
            Checkout Pesanan
          </h1>
          <p className="text-xs text-[#888] mt-1 font-light">
            Lengkapi data pengiriman dan pilih metode pembayaran pilihan Anda.
          </p>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Shipping & Payment (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Section 1: Data Pengiriman */}
              <div className="p-6 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#1C1C1C]">
                  <Truck className="w-4 h-4 text-white" />
                  <h3 className="font-brand text-sm sm:text-base font-bold uppercase tracking-wider text-white">
                    1. Data Penerima & Alamat Pengiriman
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#AAA] mb-1 font-medium">
                      Nama Lengkap <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Nama lengkap Anda"
                      className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#AAA] mb-1 font-medium">
                      Nomor WhatsApp Aktif <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0812xxxxxxxx"
                      className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-[#AAA] mb-1 font-medium">
                      Email (Opsional untuk konfirmasi faktur)
                    </label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@anda.com"
                      className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-[#AAA] mb-1 font-medium">
                      Alamat Lengkap (Jalan, No Rumah, RT/RW, Patokan) <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Contoh: Jl. Senopati No. 45, Kebayoran Baru"
                      className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#AAA] mb-1 font-medium">
                      Kota / Kabupaten <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Contoh: Jakarta Selatan / Surabaya"
                      className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#AAA] mb-1 font-medium">
                      Provinsi
                    </label>
                    <select
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                    >
                      <option value="DKI Jakarta">DKI Jakarta</option>
                      <option value="Jawa Barat">Jawa Barat</option>
                      <option value="Jawa Tengah">Jawa Tengah</option>
                      <option value="Jawa Timur">Jawa Timur</option>
                      <option value="Banten">Banten</option>
                      <option value="DI Yogyakarta">DI Yogyakarta</option>
                      <option value="Bali">Bali</option>
                      <option value="Sumatera Utara">Sumatera Utara</option>
                      <option value="Sulawesi Selatan">Sulawesi Selatan</option>
                      <option value="Lainnya">Provinsi Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-[#AAA] mb-1 font-medium">
                      Kode Pos
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="12190"
                      className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#AAA] mb-1 font-medium">
                      Catatan Pesanan (Opsional)
                    </label>
                    <input
                      type="text"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Misal: Harap titipkan ke satpam"
                      className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Pilihan Kurir */}
              <div className="p-6 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#1C1C1C]">
                  <Truck className="w-4 h-4 text-white" />
                  <h3 className="font-brand text-sm sm:text-base font-bold uppercase tracking-wider text-white">
                    2. Pilih Layanan Ekspedisi
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { name: 'JNE Reguler', time: '1-3 Hari', cost: 15000 },
                    { name: 'SiCepat BEST', time: '1-2 Hari', cost: 18000 },
                    { name: 'J&T Express', time: '2-3 Hari', cost: 16000 },
                  ].map((c) => (
                    <div
                      key={c.name}
                      onClick={() => handleCourierChange(c.name as any, c.cost)}
                      className={`p-3.5 rounded border cursor-pointer transition-all ${
                        courier === c.name
                          ? 'border-white bg-[#1A1A1A]'
                          : 'border-[#222] bg-[#101010] hover:border-[#444]'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-white">{c.name}</span>
                        {courier === c.name && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <span className="text-[11px] text-[#777] block">{c.time}</span>
                      <span className="text-xs font-semibold text-[#CCC] block mt-1">
                        {formatRupiah(c.cost)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Metode Pembayaran */}
              <div className="p-6 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#1C1C1C]">
                  <CreditCard className="w-4 h-4 text-white" />
                  <h3 className="font-brand text-sm sm:text-base font-bold uppercase tracking-wider text-white">
                    3. Metode Pembayaran Terverifikasi
                  </h3>
                </div>

                <div className="space-y-3">
                  {/* Bank Transfer */}
                  <label
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`flex items-start gap-3 p-4 rounded border cursor-pointer transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-white bg-[#161616]'
                        : 'border-[#222] bg-[#101010] hover:border-[#333]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mt-1 accent-white"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">Transfer Virtual Account / Manual (BCA / Mandiri)</span>
                        <span className="text-[10px] text-[#888] uppercase tracking-wider">Verifikasi Manual</span>
                      </div>
                      <p className="text-[#888] mt-1 leading-relaxed">
                        Instruksi transfer dan nomor rekening resmi SIENCH akan ditampilkan setelah konfirmasi pesanan.
                      </p>
                    </div>
                  </label>

                  {/* QRIS */}
                  <label
                    onClick={() => setPaymentMethod('qris')}
                    className={`flex items-start gap-3 p-4 rounded border cursor-pointer transition-all ${
                      paymentMethod === 'qris'
                        ? 'border-white bg-[#161616]'
                        : 'border-[#222] bg-[#101010] hover:border-[#333]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'qris'}
                      onChange={() => setPaymentMethod('qris')}
                      className="mt-1 accent-white"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">QRIS (GoPay, OVO, Dana, ShopeePay, BCA QR)</span>
                        <QrCode className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-[#888] mt-1 leading-relaxed">
                        Pindai kode QR instan dari semua aplikasi e-wallet atau mobile banking.
                      </p>
                    </div>
                  </label>

                  {/* WhatsApp Direct Order */}
                  <label
                    onClick={() => setPaymentMethod('whatsapp')}
                    className={`flex items-start gap-3 p-4 rounded border cursor-pointer transition-all ${
                      paymentMethod === 'whatsapp'
                        ? 'border-white bg-[#161616]'
                        : 'border-[#222] bg-[#101010] hover:border-[#333]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'whatsapp'}
                      onChange={() => setPaymentMethod('whatsapp')}
                      className="mt-1 accent-white"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#25D366]">Pesan Otomatis via WhatsApp Resmi</span>
                        <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      </div>
                      <p className="text-[#888] mt-1 leading-relaxed">
                        Data pesanan akan langsung tersusun rapi dan terhubung ke Customer Support SIENCH via WhatsApp.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="p-3 bg-[#121212] border border-[#222] rounded flex items-center gap-2 text-[11px] text-[#888]">
                  <Info className="w-4 h-4 text-[#AAA] shrink-0" />
                  <span>
                    Status pembayaran akan diverifikasi oleh sistem / finance sebelum barang diproses dan dikirim.
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-5 sticky top-24">
                <h3 className="font-brand text-base font-bold uppercase tracking-wider text-white pb-3 border-b border-[#1C1C1C]">
                  Ringkasan Pesanan ({cart.length} item)
                </h3>

                {/* Items Mini List */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-3 text-xs">
                      <div className="w-12 h-14 bg-[#141414] rounded overflow-hidden shrink-0 p-1 flex items-center justify-center">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          onError={(e) => {
                            e.currentTarget.src = '/images/products/siench-shadow-tote.jpg';
                          }}
                          className="max-h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white line-clamp-1">{item.product.name}</h4>
                        <span className="text-[11px] text-[#777]">{item.quantity} x {formatRupiah(item.product.price)}</span>
                      </div>
                      <div className="font-bold text-white">
                        {formatRupiah(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Input */}
                <div className="pt-3 border-t border-[#1C1C1C]">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="KODE PROMO"
                      className="w-full bg-[#080808] border border-[#2B2B2B] rounded py-2 px-3 text-xs uppercase text-white placeholder-[#666] focus:outline-none focus:border-white"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-3.5 py-2 bg-[#222] hover:bg-white text-white hover:text-black font-bold text-xs uppercase tracking-wider rounded transition-colors"
                    >
                      Pakai
                    </button>
                  </div>
                  {appliedCoupon && (
                    <span className="text-[11px] text-emerald-400 mt-1 block">
                      Diskon voucher {appliedCoupon.code}: -{formatRupiah(discountAmount)}
                    </span>
                  )}
                </div>

                {/* Calculations */}
                <div className="space-y-2.5 text-xs text-[#888] pt-3 border-t border-[#1C1C1C]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-white font-medium">{formatRupiah(cartSubtotal)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Diskon Kupon:</span>
                      <span>-{formatRupiah(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Ongkir ({courier}):</span>
                    <span className="text-white font-medium">{formatRupiah(courierCost)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-[#222]">
                    <span>Total Pembayaran:</span>
                    <span>{formatRupiah(grandTotal)}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#F5F5F5] hover:bg-white text-[#080808] text-xs font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSubmitting ? 'Memproses...' : 'Konfirmasi & Buat Pesanan'}</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-[#666]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Data Anda dilindungi enkripsi standar bank</span>
                </div>
              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
};
