/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../services/storage';
import { Heart, Eye, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigate, addToCart, toggleWishlist, isWishlisted, setQuickViewProduct } = useApp();
  const wishlisted = isWishlisted(product.id);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="group relative flex flex-col bg-[#0D0D0D] border border-[#1A1A1A] hover:border-[#333333] transition-all duration-300 rounded overflow-hidden">
      {/* Product Image Frame */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#141414] cursor-pointer" onClick={() => navigate(`/product/${product.slug}`)}>
        <img
          src={product.images[0] || '/images/products/siench-shadow-tote.jpg'}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src = '/images/products/siench-shadow-tote.jpg';
          }}
          className="w-full h-full object-contain sm:object-cover p-2 sm:p-0 transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Ambient Dark Gradient on bottom */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0D0D0D] to-transparent opacity-60" />

        {/* Quiet unboxed label overlay (Top Left) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
          {product.tags && product.tags.length > 0 && (
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#F5F5F5] bg-black/70 backdrop-blur-sm px-2 py-0.5 border border-white/10">
              {product.tags[0]}
            </span>
          )}
          {discountPercent && (
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 bg-black/70 backdrop-blur-sm px-2 py-0.5 border border-rose-900/40">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            wishlisted
              ? 'bg-white text-rose-600'
              : 'bg-black/60 text-[#A7A7A7] hover:text-white hover:bg-black/80'
          }`}
          aria-label={wishlisted ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick View Button (Desktop Hover overlay / Mobile button) */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 py-2 bg-black/80 hover:bg-white hover:text-black backdrop-blur-md text-[#F5F5F5] border border-white/20 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Info Section */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Category & Status metadata line */}
          <div className="flex items-center justify-between text-[11px] text-[#888888] tracking-widest uppercase mb-1">
            <span>{product.category}</span>
            {product.stock <= 4 && product.stock > 0 && (
              <span className="text-amber-500 font-medium">Sisa {product.stock}</span>
            )}
            {product.stock === 0 && (
              <span className="text-rose-500 font-medium">Stok Habis</span>
            )}
          </div>

          {/* Product Name */}
          <h3
            onClick={() => navigate(`/product/${product.slug}`)}
            className="font-display text-sm sm:text-base font-bold text-[#F5F5F5] hover:text-white transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Quiet short description */}
          <p className="text-xs text-[#777777] line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-2 border-t border-[#1C1C1C] flex items-center justify-between gap-2">
          <div>
            <div className="text-sm sm:text-base font-bold text-[#F5F5F5] tracking-tight">
              {formatRupiah(product.price)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-[11px] text-[#666666] line-through -mt-0.5">
                {formatRupiah(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className={`p-2.5 sm:px-3 sm:py-2 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              product.stock <= 0
                ? 'bg-[#1C1C1C] text-[#555555] cursor-not-allowed'
                : 'bg-[#1F1F1F] hover:bg-[#F5F5F5] text-[#F5F5F5] hover:text-[#080808]'
            }`}
            aria-label="Tambah ke keranjang"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
