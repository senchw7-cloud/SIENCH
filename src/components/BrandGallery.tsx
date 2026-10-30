/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';

export const BrandGallery: React.FC = () => {
  const { navigate } = useApp();

  const galleryItems = [
    {
      title: 'Monochrome Floral Embroidery',
      subtitle: 'Detail sulaman flora artistik pada SIENCH Midnight Floral',
      image: '/images/products/siench-midnight-floral.jpg',
      slug: 'siench-midnight-floral',
      span: 'col-span-1 md:col-span-2 row-span-2',
    },
    {
      title: 'Gunmetal Chain Detail',
      subtitle: 'Aksen rantai metalik berpadu kanvas abu pada SIENCH Noir Blossom',
      image: '/images/products/siench-noir-blossom.jpg',
      slug: 'siench-noir-blossom',
      span: 'col-span-1',
    },
    {
      title: 'Glossy Leather Texture',
      subtitle: 'Siluet tegas dengan kilau elegan SIENCH Shadow Tote',
      image: '/images/products/siench-shadow-tote.jpg',
      slug: 'siench-shadow-tote',
      span: 'col-span-1',
    },
    {
      title: 'Urban Metal Studs',
      subtitle: 'Detail stud baja dengan pegangan kokoh SIENCH Urban Stud',
      image: '/images/products/siench-urban-stud.jpg',
      slug: 'siench-urban-stud',
      span: 'col-span-1',
    },
    {
      title: 'Supple Grain Texture',
      subtitle: 'Kelenturan kulit bertekstur hobo bag untuk gaya sehari-hari',
      image: '/images/products/siench-essential-hobo.jpg',
      slug: 'siench-essential-hobo',
      span: 'col-span-1',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#080808] border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#A7A7A7] font-semibold block mb-2">
            Editorial Lookbook
          </span>
          <h2 className="font-brand text-2xl sm:text-4xl font-extrabold text-[#F5F5F5] uppercase tracking-tight">
            THE EDITORIAL GALLERY
          </h2>
          <p className="text-sm text-[#777777] font-light mt-2">
            Setiap sudut, lekukan, dan tekstur dirancang untuk mempertegas ekspresi gaya Anda.
          </p>
        </div>

        {/* Editorial Mosaic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[240px]">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/product/${item.slug}`)}
              className={`group relative rounded overflow-hidden bg-[#111111] border border-[#202020] hover:border-[#444444] transition-all cursor-pointer ${item.span}`}
            >
              <img
                src={item.image}
                alt={item.title}
                onError={(e) => {
                  e.currentTarget.src = '/images/products/siench-shadow-tote.jpg';
                }}
                className="w-full h-full object-cover p-4 transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end text-left">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#A7A7A7] font-semibold">
                  Detail Snapshot
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white tracking-wide mt-1">
                  {item.title}
                </h4>
                <p className="text-xs text-[#999999] line-clamp-1 mt-0.5 font-light">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
