/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../services/storage';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    navigate,
  } = useApp();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#0E0E0E] border-l border-[#222222] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#1C1C1C] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-white" />
            <h3 className="font-brand text-base font-bold uppercase tracking-wider text-white">
              Keranjang Belanja ({cart.length})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-[#888] hover:text-white transition-colors"
            aria-label="Tutup Keranjang"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body (Items List) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#777]">
              <ShoppingBag className="w-12 h-12 text-[#333] mb-3 stroke-[1.2]" />
              <p className="text-sm font-medium text-white mb-1">Keranjang Masih Kosong</p>
              <p className="text-xs text-[#777] max-w-xs mb-6 font-light">
                Jelajahi koleksi dark luxury SIENCH dan temukan tas yang mendefinisikan karakter Anda.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop');
                }}
                className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-[#DDD] transition-colors"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-3 bg-[#131313] border border-[#1E1E1E] rounded"
              >
                {/* Thumb */}
                <div
                  className="w-16 h-20 bg-[#1A1A1A] rounded overflow-hidden shrink-0 cursor-pointer"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate(`/product/${item.product.slug}`);
                  }}
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    onError={(e) => {
                      e.currentTarget.src = '/images/products/siench-shadow-tote.jpg';
                    }}
                    className="w-full h-full object-contain p-1"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className="text-xs font-bold text-white hover:underline cursor-pointer line-clamp-1"
                        onClick={() => {
                          setIsCartOpen(false);
                          navigate(`/product/${item.product.slug}`);
                        }}
                      >
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#666] hover:text-rose-400 p-0.5"
                        aria-label="Hapus produk"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] text-[#777] tracking-wider uppercase block mt-0.5">
                      {item.product.category}
                    </span>
                    <span className="text-xs font-semibold text-[#DDD] block mt-1">
                      {formatRupiah(item.product.price)}
                    </span>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1E1E1E]">
                    <div className="flex items-center border border-[#2B2B2B] rounded bg-[#0A0A0A]">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-white hover:bg-[#222]"
                      >
                        -
                      </button>
                      <span className="px-3 py-0.5 text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-white hover:bg-[#222]"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-bold text-white">
                      {formatRupiah(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#1C1C1C] bg-[#0A0A0A] space-y-3">
            <div className="flex items-center justify-between text-xs text-[#888]">
              <span>Subtotal:</span>
              <span className="text-base font-bold text-white">
                {formatRupiah(cartSubtotal)}
              </span>
            </div>
            <p className="text-[10px] text-[#666]">
              *Biaya pengiriman dan potongan kode diskon dihitung saat checkout.
            </p>

            <button
              onClick={() => {
                setIsCartOpen(false);
                navigate('/checkout');
              }}
              className="w-full py-3 bg-[#F5F5F5] hover:bg-white text-[#080808] text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              <span>Lanjut ke Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsCartOpen(false);
                navigate('/cart');
              }}
              className="w-full py-2.5 border border-[#262626] hover:border-white text-xs text-[#CCC] hover:text-white uppercase tracking-wider transition-colors"
            >
              Buka Halaman Keranjang Lengkap
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
