/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight } from 'lucide-react';

export const CollectionsPage: React.FC = () => {
  const { navigate } = useApp();

  const collections = [
    {
      title: 'THE BLACK COLLECTION',
      tagline: 'Signature Dark Luxury Core',
      desc: 'Fondasi utama identitas SIENCH. Seluruh 5 desain tas hitam ikonik yang dirancang untuk ekspresi gaya percaya diri.',
      image: '/images/categories/tote-bags.jpg',
      category: 'Tote Bags',
      itemCount: 2,
    },
    {
      title: 'FLORAL & ARTWORK SERIES',
      tagline: 'Monochrome Botany in Darkness',
      desc: 'Sentuhan artistik sulaman flora perak dan putih di atas latar kain pekat dan aksen rantai metalik.',
      image: '/images/categories/floral-bags.jpg',
      category: 'Floral Bags',
      itemCount: 2,
    },
    {
      title: 'URBAN METAL EDITIONS',
      tagline: 'Defiant & Metallic Hardware',
      desc: 'Konstruksi tangguh dengan stud baja, handle ganda, dan tali selempang modular untuk mobilitas perkotaan.',
      image: '/images/categories/sling-bags.jpg',
      category: 'Sling Bags',
      itemCount: 1,
    },
    {
      title: 'MINIMALIST HOBO SILHOUETTES',
      tagline: 'Fluidity in Pure Black Leather',
      desc: 'Bentuk hobo lentur dengan tekstur kulit lembut yang memeluk tubuh secara ergonomis dan santai.',
      image: '/images/categories/hobo-bags.jpg',
      category: 'Hobo Bags',
      itemCount: 1,
    },
    {
      title: 'CARD HOLDERS & ESSENTIALS',
      tagline: 'Precision Leather Craft',
      desc: 'Dompet kartu ramping bertekstur kulit premium dengan jahitan presisi untuk mobilitas harian.',
      image: '/images/categories/card-holders.jpg',
      category: 'Card Holders',
      itemCount: 1,
    },
    {
      title: 'NOIR POUCHES & CLUTCHES',
      tagline: 'Tactile Leather Versatility',
      desc: 'Pouch serbaguna berbalut kulit hitam dengan ritsleting gunmetal kokoh untuk menyimpan esensial.',
      image: '/images/categories/pouches.jpg',
      category: 'Pouches',
      itemCount: 1,
    },
  ];

  return (
    <div className="bg-[#080808] min-h-screen py-10 sm:py-16 border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 pb-6 border-b border-[#1C1C1C]">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#888] font-semibold block mb-1">
            Curated Lines
          </span>
          <h1 className="font-brand text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
            THE SIENCH COLLECTIONS
          </h1>
          <p className="text-xs sm:text-sm text-[#888] mt-1 font-light">
            Temukan karakter koleksi tas yang paling mewakili identitas personal Anda.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((col, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (col.category === 'All') {
                  navigate('/shop');
                } else {
                  navigate(`/shop?category=${encodeURIComponent(col.category)}`);
                }
              }}
              className="group relative bg-[#0E0E0E] border border-[#202020] hover:border-[#444] rounded-lg overflow-hidden cursor-pointer flex flex-col justify-between transition-all"
            >
              {/* Image Banner */}
              <div className="relative aspect-[16/9] w-full bg-[#131313] overflow-hidden flex items-center justify-center p-6">
                <img
                  src={col.image}
                  alt={col.title}
                  onError={(e) => {
                    e.currentTarget.src = '/images/products/siench-shadow-tote.jpg';
                  }}
                  className="max-h-full max-w-full object-contain filter drop-shadow-xl transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent opacity-70" />
              </div>

              {/* Text Info */}
              <div className="p-6 sm:p-8 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#888]">
                  <span className="uppercase tracking-widest font-semibold text-[#AAA]">{col.tagline}</span>
                  <span>{col.itemCount} Model</span>
                </div>

                <h3 className="font-brand text-xl sm:text-2xl font-bold text-white group-hover:text-white transition-colors">
                  {col.title}
                </h3>

                <p className="text-xs text-[#888] leading-relaxed font-light">
                  {col.desc}
                </p>

                <div className="pt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group-hover:underline">
                  <span>Lihat Koleksi Ini</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
