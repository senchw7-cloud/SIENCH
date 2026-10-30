/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { ArrowRight } from 'lucide-react';

export const FeaturedCollection: React.FC = () => {
  const { products, navigate } = useApp();

  // Grab the 5 core bags
  const coreBags = products.slice(0, 5);

  return (
    <section className="py-16 sm:py-24 bg-[#080808] border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#1C1C1C] gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#A7A7A7] font-semibold block mb-2">
              Curated Masterpieces
            </span>
            <h2 className="font-brand text-2xl sm:text-4xl font-extrabold text-[#F5F5F5] tracking-tight uppercase">
              THE BLACK COLLECTION
            </h2>
            <p className="text-sm sm:text-base text-[#888888] font-light mt-1">
              Designed for those who stand apart.
            </p>
          </div>

          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#CCCCCC] hover:text-white transition-colors group"
          >
            <span>View All Bags ({products.length})</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 5 Bags Grid: 2 columns on mobile for spacious touch, 3 on tablet, 5 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
          {coreBags.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Brand Guarantee Bar */}
        <div className="mt-14 p-6 bg-[#0E0E0E] border border-[#1C1C1C] rounded grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#F5F5F5] mb-1">
              100% Authentic SIENCH
            </h4>
            <p className="text-[11px] text-[#777777] leading-relaxed">
              Didesain dan dikurasi oleh desainer fashion lokal dengan material premium.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#F5F5F5] mb-1">
              Garansi Penukaran 7 Hari
            </h4>
            <p className="text-[11px] text-[#777777] leading-relaxed">
              Jaminan ganti baru jika barang yang Anda terima terdapat cacat produksi.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#F5F5F5] mb-1">
              Pengiriman Cepat & Aman
            </h4>
            <p className="text-[11px] text-[#777777] leading-relaxed">
              Kemasan box eksklusif dengan dust bag hitam dan bubble wrap berlapis.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
