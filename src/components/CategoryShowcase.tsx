/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/storage';
import { ArrowRight, Layers } from 'lucide-react';

export const CategoryShowcase: React.FC = () => {
  const { navigate } = useApp();
  const categories = StorageService.getCategories();

  return (
    <section className="py-16 sm:py-20 bg-[#090909] border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#1C1C1C] gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#A7A7A7] font-semibold mb-1">
              <Layers className="w-3.5 h-3.5 text-white" />
              <span>Kategori Pilihan</span>
            </div>
            <h2 className="font-brand text-2xl sm:text-3xl font-extrabold text-[#F5F5F5] uppercase tracking-tight">
              SHOP BY CATEGORY
            </h2>
            <p className="text-xs sm:text-sm text-[#888] font-light mt-1">
              Temukan koleksi tas, dompet kartu, hingga aksesoris dark luxury sesuai kebutuhan Anda.
            </p>
          </div>

          <button
            onClick={() => navigate('/shop')}
            className="text-xs uppercase tracking-widest text-[#AAA] hover:text-white transition-colors flex items-center gap-1 group font-semibold"
          >
            <span>Lihat Semua ({categories.length} Kategori)</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Categories Grid (2 cols mobile, 3 cols tablet, 6 cols desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.name)}`)}
              className="group relative bg-[#101010] border border-[#202020] hover:border-[#444] rounded overflow-hidden cursor-pointer flex flex-col transition-all duration-300"
            >
              {/* Category Image */}
              <div className="relative aspect-square w-full bg-[#141414] overflow-hidden flex items-center justify-center p-2">
                <img
                  src={cat.image || '/images/categories/tote-bags.jpg'}
                  alt={cat.name}
                  onError={(e) => {
                    // Safe fallback if any image URL is missing
                    e.currentTarget.src = '/images/products/siench-shadow-tote.jpg';
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                <div className="absolute inset-x-2 bottom-2 text-center">
                  <h3 className="font-brand text-xs sm:text-sm font-bold text-white tracking-wide uppercase group-hover:text-white">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-[#AAA] block font-light">
                    {cat.itemCount ? `${cat.itemCount} Koleksi` : 'Eksplorasi'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
