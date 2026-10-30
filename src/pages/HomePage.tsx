/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { HeroSection } from '../components/HeroSection';
import { FeaturedCollection } from '../components/FeaturedCollection';
import { CategoryShowcase } from '../components/CategoryShowcase';
import { BrandStatement } from '../components/BrandStatement';
import { BrandGallery } from '../components/BrandGallery';
import { Newsletter } from '../components/Newsletter';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, navigate } = useApp();

  // New Arrivals sorted by createdAt
  const newArrivals = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // Best Sellers sorted by salesCount
  const bestSellers = [...products]
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
    .slice(0, 4);

  return (
    <div className="bg-[#080808]">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Shop By Category Showcase (Tote Bags, Sling Bags, Card Holders, Pouches, Hobo Bags, Floral Bags) */}
      <CategoryShowcase />

      {/* 3. Featured Collection: THE BLACK COLLECTION (5 authentic bags) */}
      <FeaturedCollection />

      {/* 4. Brand Statement ("BLACK IS NOT JUST A COLOR. IT'S AN ATTITUDE.") */}
      <BrandStatement />

      {/* 4. New Arrivals Section */}
      <section className="py-16 sm:py-20 bg-[#0A0A0A] border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-[#1C1C1C]">
            <div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#A7A7A7] font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Rilis Terbaru</span>
              </div>
              <h2 className="font-brand text-2xl sm:text-3xl font-extrabold text-[#F5F5F5] uppercase tracking-tight">
                NEW ARRIVALS
              </h2>
            </div>
            <button
              onClick={() => navigate('/shop?filter=new')}
              className="text-xs uppercase tracking-widest text-[#999] hover:text-white transition-colors flex items-center gap-1 group font-semibold"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {newArrivals.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Editorial Lookbook Gallery */}
      <BrandGallery />

      {/* 6. Best Sellers Section */}
      <section className="py-16 sm:py-20 bg-[#080808] border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-[#1C1C1C]">
            <div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#A7A7A7] font-semibold mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Favorit Konsumen</span>
              </div>
              <h2 className="font-brand text-2xl sm:text-3xl font-extrabold text-[#F5F5F5] uppercase tracking-tight">
                BEST SELLERS
              </h2>
            </div>
            <button
              onClick={() => navigate('/shop?sort=bestseller')}
              className="text-xs uppercase tracking-widest text-[#999] hover:text-white transition-colors flex items-center gap-1 group font-semibold"
            >
              <span>Koleksi Populer</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {bestSellers.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Newsletter Invitation */}
      <Newsletter />
    </div>
  );
};
