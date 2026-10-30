/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react';
import { formatRupiah } from '../services/storage';

export const HeroSection: React.FC = () => {
  const { navigate, products, siteSettings, addToCart } = useApp();
  const [activeBagIndex, setActiveBagIndex] = useState(0);

  // Take the 5 authentic bags
  const heroBags = products.slice(0, 5);
  const currentBag = heroBags[activeBagIndex] || heroBags[0];

  return (
    <section className="relative overflow-hidden bg-[#080808] border-b border-[#1A1A1A] pt-6 pb-12 sm:py-16 lg:py-24">
      {/* Ambient background light gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-white/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -top-24 right-0 w-[400px] h-[400px] bg-neutral-800/[0.1] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand Statement & Headlines */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Minimalist Kicker */}
            <div className="inline-flex items-center gap-2 mb-4 text-[#A7A7A7] text-xs uppercase tracking-[0.3em] font-semibold">
              <span className="w-8 h-[1px] bg-[#A7A7A7]" />
              <span>Indonesian Dark Luxury Bag Label</span>
            </div>

            {/* Giant Title */}
            <h1 className="font-brand text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F5F5F5] uppercase leading-[1.05] mb-4">
              SIENCH
              <span className="block text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#CCCCCC] to-[#777777] mt-1 font-display">
                {siteSettings.mainSlogan}
              </span>
            </h1>

            {/* Sub-headline & Description */}
            <p className="text-base sm:text-lg text-[#B0B0B0] font-light max-w-xl leading-relaxed mb-6">
              <strong className="text-white font-medium">{siteSettings.subSlogan}</strong>{' '}
              {siteSettings.heroSubheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-8">
              <button
                onClick={() => navigate('/shop')}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#F5F5F5] hover:bg-white text-[#080808] font-bold text-xs uppercase tracking-[0.2em] transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-white/5"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => navigate('/collections')}
                className="w-full sm:w-auto px-8 py-3.5 bg-transparent hover:bg-[#1A1A1A] text-[#F5F5F5] border border-[#333333] hover:border-[#666666] font-bold text-xs uppercase tracking-[0.2em] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>{siteSettings.heroButtonText}</span>
              </button>
            </div>

            {/* Value Pillars */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#1C1C1C] w-full text-left">
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-[#777777] font-medium">Material</span>
                <span className="text-xs sm:text-sm font-semibold text-[#F5F5F5] mt-0.5 block">Premium Grain</span>
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-[#777777] font-medium">Craft</span>
                <span className="text-xs sm:text-sm font-semibold text-[#F5F5F5] mt-0.5 block">Dark Luxury</span>
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-[#777777] font-medium">Delivery</span>
                <span className="text-xs sm:text-sm font-semibold text-[#F5F5F5] mt-0.5 block">Nationwide ID</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Bag Spotlight */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-md aspect-square bg-[#0D0D0D] border border-[#222222] rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center group overflow-hidden">
              
              {/* Subtle spotlight radial */}
              <div className="absolute inset-0 bg-radial from-white/[0.06] to-transparent pointer-events-none" />

              {/* Bag Image with smooth transition */}
              <div className="relative w-full h-64 sm:h-72 flex items-center justify-center z-10 cursor-pointer" onClick={() => currentBag && navigate(`/product/${currentBag.slug}`)}>
                {currentBag && (
                  <img
                    key={currentBag.id}
                    src={currentBag.images[0]}
                    alt={currentBag.name}
                    onError={(e) => {
                      e.currentTarget.src = '/images/products/siench-shadow-tote.jpg';
                    }}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] transition-all duration-500 ease-out transform group-hover:scale-105"
                  />
                )}
              </div>

              {/* Current Bag Floating Info */}
              {currentBag && (
                <div className="w-full mt-4 pt-4 border-t border-[#1C1C1C] flex items-center justify-between z-10">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#888888]">
                      Featured Bag 0{activeBagIndex + 1}
                    </span>
                    <h4 className="text-sm font-bold text-white tracking-wide">
                      {currentBag.name}
                    </h4>
                    <span className="text-xs text-[#CCCCCC] font-semibold">
                      {formatRupiah(currentBag.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => currentBag && addToCart(currentBag, 1)}
                    className="px-4 py-2 bg-[#F5F5F5] hover:bg-white text-[#080808] text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Quick Add
                  </button>
                </div>
              )}
            </div>

            {/* Bag Switcher Thumbnails (Mobile-friendly tap selector) */}
            <div className="flex items-center justify-center gap-2 mt-4 overflow-x-auto py-1 max-w-full">
              {heroBags.map((bag, idx) => (
                <button
                  key={bag.id}
                  onClick={() => setActiveBagIndex(idx)}
                  className={`w-12 h-12 rounded border p-1 bg-[#121212] overflow-hidden transition-all shrink-0 ${
                    activeBagIndex === idx
                      ? 'border-white scale-105'
                      : 'border-[#262626] opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`Lihat ${bag.name}`}
                >
                  <img
                    src={bag.images[0]}
                    alt={bag.name}
                    onError={(e) => {
                      e.currentTarget.src = '/images/products/siench-shadow-tote.jpg';
                    }}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
