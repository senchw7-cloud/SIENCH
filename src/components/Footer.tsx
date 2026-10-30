/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, Instagram, ShieldCheck, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, siteSettings, isAdminLoggedIn } = useApp();

  const handleWhatsAppClick = () => {
    const phone = siteSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Halo SIENCH Official Customer Care, saya tertarik dengan koleksi tas SIENCH. Mohon informasinya.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <footer className="bg-[#050505] border-t border-[#181818] text-[#888888] text-xs pt-16 pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#181818]">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2">
            <button
              onClick={() => navigate('/')}
              className="text-left group inline-block mb-3"
            >
              <span className="font-brand text-2xl font-black tracking-[0.25em] text-[#F5F5F5] group-hover:text-white transition-colors">
                {siteSettings.brandName}
              </span>
              <span className="block text-[10px] tracking-[0.3em] text-[#777777] uppercase mt-0.5">
                {siteSettings.mainSlogan}
              </span>
            </button>
            <p className="text-xs text-[#777777] leading-relaxed max-w-sm mb-4 font-light">
              {siteSettings.brandStatementDesc}
            </p>
            <div className="text-[11px] text-[#666666]">
              <strong className="text-[#AAAAAA]">Showroom:</strong> {siteSettings.storeAddress}
            </div>
          </div>

          {/* Col 2: Shop Links */}
          <div>
            <h5 className="font-semibold text-xs uppercase tracking-widest text-[#F5F5F5] mb-4">
              Koleksi
            </h5>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => navigate('/shop')}
                  className="hover:text-white transition-colors"
                >
                  Semua Produk (Catalog)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/shop?category=tote-bag')}
                  className="hover:text-white transition-colors"
                >
                  Tote Bags
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/shop?category=floral-bag')}
                  className="hover:text-white transition-colors"
                >
                  Floral & Artwork Series
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/shop?category=urban-collection')}
                  className="hover:text-white transition-colors"
                >
                  Urban Metal Studs
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/shop?category=hobo-bag')}
                  className="hover:text-white transition-colors"
                >
                  Essential Hobo
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div>
            <h5 className="font-semibold text-xs uppercase tracking-widest text-[#F5F5F5] mb-4">
              Bantuan & Layanan
            </h5>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-white transition-colors"
                >
                  Tentang SIENCH
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-white transition-colors"
                >
                  Hubungi Kami
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/account/orders')}
                  className="hover:text-white transition-colors"
                >
                  Lacak Pesanan / Resi
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact?tab=shipping')}
                  className="hover:text-white transition-colors"
                >
                  Kebijakan Pengiriman
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact?tab=return')}
                  className="hover:text-white transition-colors"
                >
                  Garansi & Retur (7 Hari)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Contacts & Social */}
          <div>
            <h5 className="font-semibold text-xs uppercase tracking-widest text-[#F5F5F5] mb-4">
              Terhubung
            </h5>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center gap-2 text-xs text-[#25D366] hover:underline"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Hotline</span>
                <ArrowUpRight className="w-3 h-3 text-[#777]" />
              </button>

              <a
                href={siteSettings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs text-[#F5F5F5] hover:text-white hover:underline"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram @siench.official</span>
                <ArrowUpRight className="w-3 h-3 text-[#777]" />
              </a>

              <a
                href={siteSettings.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs text-[#F5F5F5] hover:text-white hover:underline"
              >
                <span className="w-4 h-4 flex items-center justify-center font-bold text-[11px]">♪</span>
                <span>TikTok @siench.official</span>
                <ArrowUpRight className="w-3 h-3 text-[#777]" />
              </a>

              <div className="pt-2 text-[11px] text-[#777777]">
                Jam Operasional:
                <br />Senin - Sabtu: 09.00 - 18.00 WIB
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Admin Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} SIENCH Indonesia. All Rights Reserved. &quot;{siteSettings.brandPhilosophy}&quot;
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(isAdminLoggedIn ? '/admin/dashboard' : '/admin/login')}
              className="inline-flex items-center gap-1.5 text-[#666666] hover:text-[#CCCCCC] transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/80" />
              <span>{isAdminLoggedIn ? 'Admin Panel' : 'Staff Login'}</span>
            </button>
            <span className="text-[#333]">|</span>
            <span className="text-[#555]">Dark Luxury Bag E-Commerce Platform</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
