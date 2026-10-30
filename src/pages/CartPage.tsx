/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StorageService, formatRupiah } from '../services/storage';
import { Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, cartSubtotal, updateCartQuantity, removeFromCart, navigate, addToast } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

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
  const estimatedShipping = cart.length > 0 ? 15000 : 0;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + estimatedShipping);

  if (cart.length === 0) {
    return (
      <div className="bg-[#080808] min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#121212] border border-[#222] flex items-center justify-center text-[#555] mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-brand text-2xl font-bold text-white mb-2 uppercase">
          Keranjang Anda Kosong
        </h2>
        <p className="text-xs text-[#777] max-w-sm mb-6 font-light">
          Belum ada tas SIENCH yang Anda pilih. Kunjungi katalog kami dan temukan tas yang sesuai karakter Anda.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-8 py-3.5 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-[#DDD] transition-colors"
        >
          Lihat Koleksi Tas
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#080808] min-h-screen py-8 sm:py-14 border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 pb-4 border-b border-[#1C1C1C]">
          <h1 className="font-brand text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
            Keranjang Belanja
          </h1>
          <p className="text-xs text-[#888] mt-1 font-light">
            Periksa pilihan tas Anda sebelum melanjutkan proses pembayaran.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 bg-[#0E0E0E] border border-[#1E1E1E] rounded items-center"
              >
                {/* Thumb */}
                <div
                  className="w-24 h-28 bg-[#141414] rounded overflow-hidden shrink-0 cursor-pointer flex items-center justify-center p-2"
                  onClick={() => navigate(`/product/${item.product.slug}`)}
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    onError={(e) => {
                      e.currentTarget.src = '/images/products/siench-shadow-tote.jpg';
                    }}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 w-full flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-[#777] tracking-wider uppercase block">
                        {item.product.category} · {item.product.sku}
                      </span>
                      <h3
                        onClick={() => navigate(`/product/${item.product.slug}`)}
                        className="font-brand text-base font-bold text-white hover:underline cursor-pointer"
                      >
                        {item.product.name}
                      </h3>
                      <span className="text-xs font-semibold text-[#CCC] block mt-1">
                        {formatRupiah(item.product.price)} / unit
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-[#666] hover:text-rose-400 transition-colors"
                      aria-label="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity & Item Total */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#1C1C1C]">
                    <div className="flex items-center border border-[#2B2B2B] rounded bg-[#121212]">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="px-3 py-1 text-xs text-white hover:bg-[#222]"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="px-3 py-1 text-xs text-white hover:bg-[#222]"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-sm font-bold text-white">
                      {formatRupiah(item.product.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Back button */}
            <div className="pt-2">
              <button
                onClick={() => navigate('/shop')}
                className="text-xs text-[#888] hover:text-white uppercase tracking-wider transition-colors"
              >
                &larr; Lanjut Tambah Koleksi Tas Lain
              </button>
            </div>
          </div>

          {/* Summary Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-6">
              <h3 className="font-brand text-base font-bold uppercase tracking-wider text-white pb-3 border-b border-[#1C1C1C]">
                Ringkasan Belanja
              </h3>

              {/* Coupon Form */}
              <div>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-3 w-4 h-4 text-[#666]" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="KODE PROMO (mis: SIENCHDARK)"
                      className="w-full bg-[#080808] border border-[#2B2B2B] rounded py-2.5 pl-9 pr-3 text-xs uppercase text-white placeholder-[#666] focus:outline-none focus:border-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#222] hover:bg-white text-white hover:text-black font-bold text-xs uppercase tracking-wider rounded transition-colors"
                  >
                    Terapkan
                  </button>
                </form>

                {appliedCoupon && (
                  <div className="mt-2 text-[11px] text-emerald-400 flex items-center justify-between">
                    <span>Kupon {appliedCoupon.code} aktif</span>
                    <span>- {formatRupiah(appliedCoupon.discount)}</span>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-xs text-[#888] pt-4 border-t border-[#1C1C1C]">
                <div className="flex justify-between">
                  <span>Subtotal Produk:</span>
                  <span className="text-white font-medium">{formatRupiah(cartSubtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Diskon Promo:</span>
                    <span>- {formatRupiah(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimasi Ongkos Kirim:</span>
                  <span className="text-white font-medium">{formatRupiah(estimatedShipping)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-[#222]">
                  <span>Total Tagihan:</span>
                  <span>{formatRupiah(grandTotal)}</span>
                </div>
              </div>

              {/* Proceed to Checkout button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-[#F5F5F5] hover:bg-white text-[#080808] text-xs font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Proses Pesanan (Checkout)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-[11px] text-[#666] text-center flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#888]" />
                <span>Transaksi Terenkripsi & Dijamin Aman</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
