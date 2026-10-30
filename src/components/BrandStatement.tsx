/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Compass, Sparkles, Feather, Shield } from 'lucide-react';

export const BrandStatement: React.FC = () => {
  const { siteSettings, navigate } = useApp();

  return (
    <section className="py-20 sm:py-28 bg-[#0A0A0A] border-b border-[#1A1A1A] relative overflow-hidden">
      {/* Decorative background grid subtle lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Filosofi Tag */}
        <span className="text-[11px] uppercase tracking-[0.35em] text-[#A7A7A7] font-semibold block mb-4">
          Brand Philosophy · {siteSettings.brandPhilosophy}
        </span>

        {/* Big Statement Headline */}
        <h2 className="font-brand text-3xl sm:text-5xl lg:text-6xl font-black text-[#F5F5F5] tracking-tight uppercase leading-[1.1] mb-6">
          BLACK IS NOT JUST A COLOR.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#B0B0B0] to-[#555555]">
            IT&apos;S AN ATTITUDE.
          </span>
        </h2>

        {/* Description */}
        <p className="text-base sm:text-xl text-[#999999] max-w-3xl mx-auto leading-relaxed font-light mb-12">
          {siteSettings.brandStatementDesc}
        </p>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
          <div className="p-5 bg-[#0F0F0F] border border-[#1E1E1E] rounded">
            <Sparkles className="w-5 h-5 text-[#CCCCCC] mb-3" />
            <h4 className="text-xs uppercase font-bold tracking-wider text-white mb-1">
              Dark Luxury
            </h4>
            <p className="text-[11px] text-[#777777] leading-relaxed">
              Konsep visual monokromatik pekat dengan aura misterius dan elegan.
            </p>
          </div>

          <div className="p-5 bg-[#0F0F0F] border border-[#1E1E1E] rounded">
            <Feather className="w-5 h-5 text-[#CCCCCC] mb-3" />
            <h4 className="text-xs uppercase font-bold tracking-wider text-white mb-1">
              Refined Details
            </h4>
            <p className="text-[11px] text-[#777777] leading-relaxed">
              Jahitan presisi, aksen metalik gunmetal, serta motif floral bernilai seni tinggi.
            </p>
          </div>

          <div className="p-5 bg-[#0F0F0F] border border-[#1E1E1E] rounded">
            <Compass className="w-5 h-5 text-[#CCCCCC] mb-3" />
            <h4 className="text-xs uppercase font-bold tracking-wider text-white mb-1">
              Bold Silhouette
            </h4>
            <p className="text-[11px] text-[#777777] leading-relaxed">
              Bentuk tas ergonomis dari tote bag luas hingga hobo bag yang lentur.
            </p>
          </div>

          <div className="p-5 bg-[#0F0F0F] border border-[#1E1E1E] rounded">
            <Shield className="w-5 h-5 text-[#CCCCCC] mb-3" />
            <h4 className="text-xs uppercase font-bold tracking-wider text-white mb-1">
              Identity First
            </h4>
            <p className="text-[11px] text-[#777777] leading-relaxed">
              Setiap tas adalah pernyataan personal pemakainya untuk tampil percaya diri.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <button
            onClick={() => navigate('/about')}
            className="px-6 py-3 border border-[#333333] hover:border-white text-xs uppercase tracking-[0.2em] font-semibold text-[#CCCCCC] hover:text-white transition-colors"
          >
            Baca Kisah & Filosofi SIENCH
          </button>
        </div>

      </div>
    </section>
  );
};
