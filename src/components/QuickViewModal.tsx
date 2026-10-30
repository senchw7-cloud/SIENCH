/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../services/storage';
import { X, ShoppingBag, ArrowRight, Heart, Check, Shield } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    navigate,
    toggleWishlist,
    isWishlisted,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const wishlisted = isWishlisted(product.id);

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setQuickViewProduct(null);
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-[#0F0F0F] border border-[#262626] rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 text-[#A7A7A7] hover:text-white bg-black/40 rounded-full transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image Gallery */}
        <div className="md:w-1/2 bg-[#141414] p-6 flex flex-col items-center justify-center relative">
          <div className="w-full aspect-[4/5] flex items-center justify-center overflow-hidden">
            <img
              src={product.images[selectedImageIdx] || product.images[0]}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src = '/images/products/siench-shadow-tote.jpg';
              }}
              className="max-h-full max-w-full object-contain filter drop-shadow-xl"
            />
          </div>

          {/* If multiple images */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-12 h-12 rounded border p-0.5 overflow-hidden transition-all ${
                    selectedImageIdx === idx ? 'border-white' : 'border-[#333] opacity-60'
                  }`}
                >
                  <img
                    src={img}
                    alt="thumb"
                    onError={(e) => {
                      e.currentTarget.src = '/images/products/siench-shadow-tote.jpg';
                    }}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Meta kicker */}
            <div className="flex items-center justify-between text-xs text-[#888] uppercase tracking-wider mb-2">
              <span>{product.category}</span>
              <span className="font-mono text-[11px] text-[#666]">{product.sku}</span>
            </div>

            {/* Product Title */}
            <h3 className="font-brand text-xl sm:text-2xl font-bold text-white mb-2">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-xl font-bold text-white">
                {formatRupiah(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-[#777] line-through">
                  {formatRupiah(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-[#A7A7A7] leading-relaxed mb-6 font-light">
              {product.description}
            </p>

            {/* Specifications */}
            <div className="bg-[#161616] border border-[#222] p-3.5 rounded text-xs space-y-1.5 mb-6 text-[#999]">
              {product.material && (
                <div className="flex justify-between">
                  <span className="text-[#666]">Material:</span>
                  <span className="text-[#DDD] font-medium text-right">{product.material}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex justify-between">
                  <span className="text-[#666]">Dimensi:</span>
                  <span className="text-[#DDD] font-medium">{product.dimensions}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#666]">Ketersediaan:</span>
                <span className={product.stock > 0 ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                  {product.stock > 0 ? `Ready Stock (${product.stock} unit)` : 'Stok Habis'}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs text-[#888] uppercase tracking-wider font-semibold">
                  Jumlah:
                </span>
                <div className="flex items-center border border-[#333] rounded bg-[#111]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-1.5 text-white hover:bg-[#222] disabled:opacity-40 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3 py-1.5 text-white hover:bg-[#222] disabled:opacity-40 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#222] flex flex-col gap-2.5">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 py-3 bg-[#222] hover:bg-white text-white hover:text-black text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Tambah ke Keranjang</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 border border-[#333] rounded transition-colors ${
                  wishlisted ? 'bg-white text-rose-600' : 'text-[#888] hover:text-white hover:border-white'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            {product.stock > 0 && (
              <button
                onClick={handleBuyNow}
                className="w-full py-3 bg-[#F5F5F5] hover:bg-white text-[#080808] text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Beli Sekarang (Checkout)
              </button>
            )}

            <button
              onClick={() => {
                setQuickViewProduct(null);
                navigate(`/product/${product.slug}`);
              }}
              className="text-center text-[11px] text-[#777] hover:text-white transition-colors underline pt-1"
            >
              Lihat Halaman Detail Lengkap &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
