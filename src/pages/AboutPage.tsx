/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Compass, Sparkles, Feather, Shield, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { siteSettings, navigate } = useApp();

  return (
    <div className="bg-[#080808] min-h-screen py-10 sm:py-16 border-b border-[#1A1A1A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 pb-8 border-b border-[#1C1C1C]">
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#888] font-semibold block mb-2">
            The SIENCH Story
          </span>
          <h1 className="font-brand text-3xl sm:text-6xl font-black text-white uppercase tracking-tight mb-4">
            OWN YOUR DARK SIDE
          </h1>
          <p className="text-sm sm:text-base text-[#999] max-w-xl mx-auto font-light leading-relaxed">
            &quot;{siteSettings.brandPhilosophy}&quot;
          </p>
        </div>

        {/* Narrative Section 1 */}
        <div className="space-y-12 text-sm sm:text-base text-[#AAAAAA] leading-relaxed font-light">
          <div>
            <h2 className="font-brand text-xl sm:text-2xl font-bold text-white uppercase tracking-wider mb-4">
              Lahir dari Karakter yang Berani
            </h2>
            <p className="mb-4">
              SIENCH bukan sekadar label tas biasa. Kami hadir untuk menantang pakem bahwa warna hitam itu monoton. Bagi kami, hitam adalah pernyataan identitas paling kuat: misterius, percaya diri, elegan, dan abadi.
            </p>
            <p>
              Setiap tas yang kami rancang diciptakan untuk mereka yang menolak menjadi seragam. Melalui perpaduan siluet arsitektural, detail metalik gunmetal yang kokoh, serta aksen motif bunga monokromatik kontemporer, SIENCH mendefinisikan ulang <em>dark luxury fashion</em> di Indonesia.
            </p>
          </div>

          {/* Core Values 3 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 pb-4">
            <div className="p-6 bg-[#0E0E0E] border border-[#202020] rounded">
              <Sparkles className="w-6 h-6 text-white mb-3" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-white mb-2">
                Eksklusivitas Desain
              </h3>
              <p className="text-xs text-[#777] leading-relaxed">
                Setiap seri diproduksi dalam kuantitas terbatas guna menjaga keunikan dan nilai personal bagi pemakainya.
              </p>
            </div>

            <div className="p-6 bg-[#0E0E0E] border border-[#202020] rounded">
              <Feather className="w-6 h-6 text-white mb-3" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-white mb-2">
                Craftsmanship Presisi
              </h3>
              <p className="text-xs text-[#777] leading-relaxed">
                Jahitan ganda yang kokoh, pemilihan kulit bertekstur lembut, serta aksen perangkat keras anti karat.
              </p>
            </div>

            <div className="p-6 bg-[#0E0E0E] border border-[#202020] rounded">
              <Shield className="w-6 h-6 text-white mb-3" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-white mb-2">
                Garansi Kualitas
              </h3>
              <p className="text-xs text-[#777] leading-relaxed">
                Jaminan kepuasan konsumen dengan garansi penukaran 7 hari dan layanan konsultasi gaya personal.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-brand text-xl sm:text-2xl font-bold text-white uppercase tracking-wider mb-4">
              Makna & Filosofi Brand
            </h2>
            <p className="mb-4">
              <strong>&quot;Your Style. Your Identity.&quot;</strong> Kami percaya bahwa tas yang Anda bawa bukanlah sekadar wadah barang bawaan, melainkan perpanjangan dari kepribadian Anda saat melangkah ke ruang publik.
            </p>
            <p>
              Mulai dari kesederhanaan ramping <strong>SIENCH Shadow Tote</strong>, sentuhan seni sulam bunga <strong>SIENCH Noir Blossom</strong> dan <strong>Midnight Floral</strong>, ketegasan urban berdetail stud pada <strong>SIENCH Urban Stud</strong>, hingga fleksibilitas harian <strong>SIENCH Essential Hobo</strong> — setiap produk adalah karya berjiwa.
            </p>
          </div>

          {/* CTA Box */}
          <div className="p-8 bg-[#101010] border border-[#242424] rounded text-center space-y-4">
            <h3 className="font-brand text-lg font-bold text-white uppercase tracking-wider">
              Temukan Karakter Tas Anda
            </h3>
            <p className="text-xs text-[#888] max-w-md mx-auto">
              Lihat katalog lengkap koleksi terbaru dan miliki tas dengan standar kemewahan gelap yang sesungguhnya.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-3.5 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-[#DDD] transition-colors inline-flex items-center gap-2"
            >
              <span>Jelajahi Katalog SIENCH</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
