/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { StorageService } from '../../services/storage';
import { Save, RefreshCw, CheckCircle2, MessageCircle, Instagram } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { siteSettings, refreshSiteSettings, addToast } = useApp();
  const [form, setForm] = useState({ ...siteSettings });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updateSiteSettings(form);
    refreshSiteSettings();
    addToast('Pengaturan website SIENCH berhasil disimpan dan diterapkan!', 'success');
  };

  const handleResetDefaults = () => {
    if (confirm('Kembalikan seluruh teks & pengaturan ke pengaturan pabrik SIENCH?')) {
      StorageService.resetAll();
      refreshSiteSettings();
      setForm(StorageService.getSiteSettings());
      addToast('Pengaturan telah di-reset ke nilai bawaan.', 'info');
    }
  };

  return (
    <AdminLayout
      title="Pengaturan Website SIENCH"
      subtitle="Kustomisasi konten, nomor WhatsApp CS, media sosial, banner promo, dan kebijakan tanpa edit kode"
    >
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        
        {/* Section 1: Identitas & Teks Brand */}
        <div className="p-6 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-4">
          <h3 className="font-brand text-sm sm:text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-[#1C1C1C]">
            1. Identitas & Slogan Brand
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[#AAA] block mb-1 font-semibold">Nama Brand</label>
              <input
                type="text"
                required
                value={form.brandName}
                onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="text-[#AAA] block mb-1 font-semibold">Filosofi Brand</label>
              <input
                type="text"
                required
                value={form.brandPhilosophy}
                onChange={(e) => setForm({ ...form, brandPhilosophy: e.target.value })}
                className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="text-[#AAA] block mb-1 font-semibold">Slogan Utama (Headline)</label>
              <input
                type="text"
                required
                value={form.mainSlogan}
                onChange={(e) => setForm({ ...form, mainSlogan: e.target.value })}
                className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white font-brand"
              />
            </div>

            <div>
              <label className="text-[#AAA] block mb-1 font-semibold">Sub-Slogan</label>
              <input
                type="text"
                required
                value={form.subSlogan}
                onChange={(e) => setForm({ ...form, subSlogan: e.target.value })}
                className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[#AAA] block mb-1 font-semibold">Hero Deskripsi</label>
              <textarea
                rows={2}
                value={form.heroSubheadline}
                onChange={(e) => setForm({ ...form, heroSubheadline: e.target.value })}
                className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[#AAA] block mb-1 font-semibold">URL Banner Hero (Opsional)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.heroBannerImage || ''}
                  onChange={(e) => setForm({ ...form, heroBannerImage: e.target.value })}
                  placeholder="/images/banners/hero-banner.jpg"
                  className="flex-1 bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-white"
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, heroBannerImage: '/images/banners/hero-banner.jpg' })}
                  className="px-3 py-1 bg-[#1C1C1C] hover:bg-[#252525] text-xs text-white rounded border border-[#333]"
                >
                  Bawaan
                </button>
              </div>
              <span className="text-[10px] text-[#777] mt-0.5 block">
                Banner editorial hero section lokal: /images/banners/hero-banner.jpg
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Banner Pengumuman Atas */}
        <div className="p-6 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C]">
            <h3 className="font-brand text-sm sm:text-base font-bold text-white uppercase tracking-wider">
              2. Top Announcement Bar (Promo Header)
            </h3>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
              <input
                type="checkbox"
                checked={form.announcementActive}
                onChange={(e) => setForm({ ...form, announcementActive: e.target.checked })}
                className="w-4 h-4 rounded bg-[#111] accent-white"
              />
              <span>Tampilkan Banner</span>
            </label>
          </div>

          <div className="text-xs">
            <label className="text-[#AAA] block mb-1 font-semibold">Teks Pengumuman Promo</label>
            <input
              type="text"
              value={form.announcementText}
              onChange={(e) => setForm({ ...form, announcementText: e.target.value })}
              className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
            />
          </div>
        </div>

        {/* Section 3: Kontak WhatsApp & Sosial Media */}
        <div className="p-6 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-4">
          <h3 className="font-brand text-sm sm:text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-[#1C1C1C]">
            3. Kontak Customer Support & Media Sosial
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[#AAA] block mb-1 font-semibold">
                Nomor WhatsApp Toko (Format: 62812xxxxxxxx) *
              </label>
              <input
                type="text"
                required
                value={form.whatsappNumber}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-white"
              />
              <span className="text-[10px] text-[#777] mt-0.5 block">
                Nomor ini digunakan untuk pesan checkout WA dan tombol konsultasi.
              </span>
            </div>

            <div>
              <label className="text-[#AAA] block mb-1 font-semibold">Email Customer Support</label>
              <input
                type="email"
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="text-[#AAA] block mb-1 font-semibold">Tautan Profil Instagram</label>
              <input
                type="url"
                value={form.instagramUrl}
                onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
                className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="text-[#AAA] block mb-1 font-semibold">Tautan Profil TikTok</label>
              <input
                type="url"
                value={form.tiktokUrl}
                onChange={(e) => setForm({ ...form, tiktokUrl: e.target.value })}
                className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[#AAA] block mb-1 font-semibold">Alamat Showroom / Kantor</label>
              <input
                type="text"
                value={form.storeAddress}
                onChange={(e) => setForm({ ...form, storeAddress: e.target.value })}
                className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Kebijakan Pengiriman & Garansi Retur */}
        <div className="p-6 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-4">
          <h3 className="font-brand text-sm sm:text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-[#1C1C1C]">
            4. Kebijakan Pengiriman & Garansi Retur
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[#AAA] block mb-1 font-semibold">Kebijakan Pengiriman</label>
              <textarea
                rows={3}
                value={form.shippingPolicy}
                onChange={(e) => setForm({ ...form, shippingPolicy: e.target.value })}
                className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white resize-none"
              />
            </div>

            <div>
              <label className="text-[#AAA] block mb-1 font-semibold">Kebijakan Pengembalian & Penukaran (7 Hari)</label>
              <textarea
                rows={3}
                value={form.returnPolicy}
                onChange={(e) => setForm({ ...form, returnPolicy: e.target.value })}
                className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1C1C1C]">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="w-full sm:w-auto px-4 py-2.5 border border-[#2B2B2B] hover:border-white text-xs text-[#888] hover:text-white rounded transition-colors flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset ke Pengaturan Awal</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-white hover:bg-[#DDD] text-black font-bold text-xs uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Pengaturan</span>
          </button>
        </div>

      </form>
    </AdminLayout>
  );
};
