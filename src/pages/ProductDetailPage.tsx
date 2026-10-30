/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { StorageService, formatRupiah } from '../services/storage';
import { ProductCard } from '../components/ProductCard';
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCw,
  Share2,
  ChevronRight,
  MessageCircle,
  ArrowLeft
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const { products, addToCart, navigate, toggleWishlist, isWishlisted, addToast, siteSettings } = useApp();

  // Find product by slug or id
  const product = products.find((p) => p.slug === slug || p.id === slug) || products[0];

  const [selectedImage, setSelectedImage] = useState<string>(product?.images[0] || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping'>('desc');

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0]);
      setQuantity(1);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Produk Tidak Ditemukan</h2>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider rounded"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  // Recommendations: Other products in same category or other core bags
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.isActive)
    .slice(0, 4);

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.name} — SIENCH`,
        text: product.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Tautan produk telah disalin ke clipboard!', 'success');
    }
  };

  const handleWhatsAppConsult = () => {
    const phone = siteSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Halo SIENCH, saya ingin bertanya tentang ${product.name} (${formatRupiah(product.price)}). Apakah stok masih tersedia?`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="bg-[#080808] min-h-screen py-6 sm:py-12 border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#777] mb-6 overflow-x-auto whitespace-nowrap">
          <button onClick={() => navigate('/')} className="hover:text-white transition-colors">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#444]" />
          <button onClick={() => navigate('/shop')} className="hover:text-white transition-colors">
            Shop
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#444]" />
          <span className="text-[#AAA]">{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#444]" />
          <span className="text-white font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Image Gallery (6 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnails (Vertical on tablet/desktop, horizontal on mobile) */}
            {product.images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-20 sm:w-20 sm:h-24 rounded border p-1 bg-[#121212] overflow-hidden transition-all shrink-0 ${
                      selectedImage === img
                        ? 'border-white ring-1 ring-white/50'
                        : 'border-[#262626] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumb ${idx}`}
                      onError={(e) => {
                        e.currentTarget.src = '/images/products/siench-shadow-tote.jpg';
                      }}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="flex-1 relative aspect-[4/5] bg-[#0E0E0E] border border-[#1E1E1E] rounded-lg overflow-hidden flex items-center justify-center p-4 sm:p-8">
              <img
                src={selectedImage || product.images[0]}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src = '/images/products/siench-shadow-tote.jpg';
                }}
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] transition-all duration-300"
              />

              {/* Tag overlay */}
              {product.tags && product.tags.length > 0 && (
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white bg-black/80 px-2.5 py-1 border border-white/20">
                    {product.tags[0]}
                  </span>
                </div>
              )}

              {/* Wishlist button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all ${
                  wishlisted
                    ? 'bg-white text-rose-600'
                    : 'bg-black/60 text-[#AAA] hover:text-white hover:bg-black/90'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

          </div>

          {/* Right Column: Information & Purchasing (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-[#888] uppercase tracking-wider mb-2">
                <span>{product.category}</span>
                <span className="font-mono text-[#666]">SKU: {product.sku}</span>
              </div>

              {/* Product Title */}
              <h1 className="font-brand text-2xl sm:text-4xl font-extrabold text-[#F5F5F5] uppercase tracking-tight mb-3">
                {product.name}
              </h1>

              {/* Price Block */}
              <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-[#1C1C1C]">
                <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {formatRupiah(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-[#777] line-through">
                    {formatRupiah(product.originalPrice)}
                  </span>
                )}
                {product.stock <= 4 && product.stock > 0 && (
                  <span className="text-xs text-amber-400 font-medium ml-auto">
                    Tersisa {product.stock} unit
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="text-xs text-rose-400 font-medium ml-auto">
                    Stok Habis
                  </span>
                )}
              </div>

              {/* Short summary description */}
              <p className="text-sm text-[#AAAAAA] font-light leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Material & Size preview specs */}
              <div className="p-4 bg-[#111111] border border-[#202020] rounded space-y-2 text-xs mb-6">
                {product.material && (
                  <div className="flex justify-between">
                    <span className="text-[#777]">Bahan / Material:</span>
                    <span className="text-white font-medium text-right max-w-[65%]">{product.material}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex justify-between">
                    <span className="text-[#777]">Ukuran / Dimensi:</span>
                    <span className="text-white font-medium">{product.dimensions}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#777]">Kelengkapan:</span>
                  <span className="text-white font-medium">Box Eksklusif SIENCH & Dust Bag</span>
                </div>
              </div>

              {/* Quantity selector */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs text-[#888] uppercase tracking-wider font-semibold">
                    Jumlah Pesanan:
                  </span>
                  <div className="flex items-center border border-[#333] rounded bg-[#121212]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="px-3.5 py-2 text-white hover:bg-[#222] disabled:opacity-40 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-5 py-2 text-sm font-bold text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="px-3.5 py-2 text-white hover:bg-[#222] disabled:opacity-40 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 mb-8">
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="w-full py-4 bg-[#F5F5F5] hover:bg-white text-[#080808] text-xs font-bold uppercase tracking-[0.2em] transition-colors disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                >
                  <span>Beli Sekarang — {formatRupiah(product.price * quantity)}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(product, quantity)}
                    disabled={product.stock <= 0}
                    className="flex-1 py-3.5 bg-[#1A1A1A] hover:bg-[#282828] text-white text-xs font-bold uppercase tracking-widest border border-[#333] transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Tambah ke Keranjang</span>
                  </button>

                  <button
                    onClick={handleWhatsAppConsult}
                    className="px-4 py-3.5 bg-[#121212] hover:bg-[#1E1E1E] text-[#25D366] border border-[#2B2B2B] rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Konsultasi Produk via WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Tanya CS</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-3.5 bg-[#121212] hover:bg-[#1E1E1E] text-[#AAA] hover:text-white border border-[#2B2B2B] rounded transition-colors"
                    title="Bagikan Tautan Produk"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#1C1C1C] text-center text-[#888]">
                <div className="flex flex-col items-center">
                  <Truck className="w-4 h-4 text-white mb-1" />
                  <span className="text-[10px] uppercase font-bold text-[#CCC]">Kirim Seluruh RI</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-white mb-1" />
                  <span className="text-[10px] uppercase font-bold text-[#CCC]">100% Original</span>
                </div>
                <div className="flex flex-col items-center">
                  <RefreshCw className="w-4 h-4 text-white mb-1" />
                  <span className="text-[10px] uppercase font-bold text-[#CCC]">Garansi 7 Hari</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Detailed Tabs: Description, Specs, Shipping */}
        <div className="mt-16 pt-8 border-t border-[#1C1C1C]">
          <div className="flex items-center gap-6 border-b border-[#222] pb-2 text-xs uppercase tracking-widest font-semibold">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-2 relative transition-colors ${
                activeTab === 'desc' ? 'text-white' : 'text-[#777] hover:text-[#CCC]'
              }`}
            >
              Deskripsi Produk
              {activeTab === 'desc' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />}
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-2 relative transition-colors ${
                activeTab === 'specs' ? 'text-white' : 'text-[#777] hover:text-[#CCC]'
              }`}
            >
              Spesifikasi & Material
              {activeTab === 'specs' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />}
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-2 relative transition-colors ${
                activeTab === 'shipping' ? 'text-white' : 'text-[#777] hover:text-[#CCC]'
              }`}
            >
              Pengiriman & Garansi
              {activeTab === 'shipping' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />}
            </button>
          </div>

          <div className="py-6 text-xs text-[#AAA] leading-relaxed max-w-3xl">
            {activeTab === 'desc' && (
              <div className="space-y-4">
                <p className="text-sm font-light leading-relaxed">
                  {product.description}
                </p>
                <p>
                  Dirancang khusus bagi pencinta estetika <em>dark luxury</em> di Indonesia, tas SIENCH menggabungkan fungsionalitas harian dengan keanggunan monokromatik. Setiap lekukan, tarikan ritsleting, dan konstruksi jahitan melalui uji ketahanan yang ketat sebelum sampai ke tangan Anda.
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-[#111] rounded border border-[#222]">
                    <span className="text-[#666] block mb-1">Bahan Utama</span>
                    <span className="text-white font-medium">{product.material || 'Material Kulit Berkualitas Tinggi'}</span>
                  </div>
                  <div className="p-3 bg-[#111] rounded border border-[#222]">
                    <span className="text-[#666] block mb-1">Dimensi Produk</span>
                    <span className="text-white font-medium">{product.dimensions || '38 x 32 x 12 cm'}</span>
                  </div>
                  <div className="p-3 bg-[#111] rounded border border-[#222]">
                    <span className="text-[#666] block mb-1">Kode Identifikasi SKU</span>
                    <span className="text-white font-mono">{product.sku}</span>
                  </div>
                  <div className="p-3 bg-[#111] rounded border border-[#222]">
                    <span className="text-[#666] block mb-1">Kategori Produk</span>
                    <span className="text-white font-medium">{product.category}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4">
                <p>
                  <strong>Kebijakan Pengiriman:</strong> {siteSettings.shippingPolicy}
                </p>
                <p>
                  <strong>Kebijakan Retur:</strong> {siteSettings.returnPolicy}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recommended / Related Products */}
        <div className="mt-20 pt-10 border-t border-[#1C1C1C]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-brand text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
              Koleksi Terkait Lainnya
            </h3>
            <button
              onClick={() => navigate('/shop')}
              className="text-xs uppercase tracking-wider text-[#888] hover:text-white"
            >
              Lihat Katalog &rarr;
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
