/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, Instagram, MapPin, Mail, Clock, Send, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { siteSettings, addToast } = useApp();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Konsultasi Produk Tas',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      addToast('Harap lengkapi nama, nomor WhatsApp, dan pesan Anda.', 'error');
      return;
    }
    setSubmitted(true);
    addToast('Pesan Anda berhasil dikirim ke tim customer care SIENCH.', 'success');
  };

  const handleWhatsAppDirect = () => {
    const phone = siteSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Halo SIENCH Care, saya ingin menanyakan informasi tentang produk tas.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-[#080808] min-h-screen py-10 sm:py-16 border-b border-[#1A1A1A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 pb-6 border-b border-[#1C1C1C]">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#888] font-semibold block mb-1">
            Customer Care & Showroom
          </span>
          <h1 className="font-brand text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
            Hubungi SIENCH
          </h1>
          <p className="text-xs sm:text-sm text-[#888] mt-1 font-light">
            Tim konsultan gaya dan layanan pelanggan kami siap membantu pertanyaan Anda setiap hari kerja.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct Info & Social (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick WhatsApp Action Card */}
            <div className="p-6 bg-[#0E0E0E] border border-[#222] rounded space-y-3">
              <div className="flex items-center gap-2 text-[#25D366]">
                <MessageCircle className="w-5 h-5" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Respon Cepat WhatsApp
                </h3>
              </div>
              <p className="text-xs text-[#AAA] leading-relaxed">
                Butuh panduan ukuran, ketersediaan stok, atau konfirmasi pesanan secara instan?
              </p>
              <button
                onClick={handleWhatsAppDirect}
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat via WhatsApp Official</span>
              </button>
            </div>

            {/* Address & Hours */}
            <div className="p-6 bg-[#0E0E0E] border border-[#222] rounded space-y-4 text-xs text-[#AAA]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Showroom & Flagship:</strong>
                  <span>{siteSettings.storeAddress}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Jam Layanan:</strong>
                  <span>Senin - Sabtu: 09.00 - 18.00 WIB</span>
                  <span className="text-[#666] block">Minggu & Libur Nasional: Tutup (Konsultasi via WA tetap diterima)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Email Support:</strong>
                  <span>{siteSettings.supportEmail}</span>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div className="p-6 bg-[#0E0E0E] border border-[#222] rounded space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider">
                Kanal Sosial Media Resmi
              </h4>
              <div className="space-y-2">
                <a
                  href={siteSettings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 bg-[#141414] rounded hover:bg-[#1A1A1A] text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4" />
                    <span>Instagram</span>
                  </div>
                  <span className="text-[#888]">@siench.official &rarr;</span>
                </a>

                <a
                  href={siteSettings.tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 bg-[#141414] rounded hover:bg-[#1A1A1A] text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold">♪</span>
                    <span>TikTok</span>
                  </div>
                  <span className="text-[#888]">@siench.official &rarr;</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Inquiry Form & Policies (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Inquiry Form */}
            <div className="p-6 sm:p-8 bg-[#0E0E0E] border border-[#222] rounded space-y-4">
              <h3 className="font-brand text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-[#222]">
                Kirim Pesan / Permintaan Kerjasama
              </h3>

              {submitted ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-12 h-12 bg-emerald-950/60 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white text-sm">Pesan Telah Diterima</h4>
                  <p className="text-xs text-[#888] max-w-sm mx-auto">
                    Terima kasih telah menghubungi SIENCH. Kami akan merespon dalam waktu maksimal 1x24 jam kerja.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#AAA] block mb-1 font-medium">Nama Anda *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Nama lengkap"
                        className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2.5 text-white focus:outline-none focus:border-white"
                      />
                    </div>

                    <div>
                      <label className="text-[#AAA] block mb-1 font-medium">Nomor WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="0812xxxxxxxx"
                        className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2.5 text-white focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#AAA] block mb-1 font-medium">Email Anda (Opsional)</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="email@anda.com"
                      className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2.5 text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="text-[#AAA] block mb-1 font-medium">Subjek Pertanyaan</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2.5 text-white focus:outline-none focus:border-white"
                    >
                      <option value="Konsultasi Produk Tas">Konsultasi Produk Tas</option>
                      <option value="Cek Status Pengiriman / Resi">Cek Status Pengiriman / Resi</option>
                      <option value="Klaim Garansi / Retur">Klaim Garansi / Retur</option>
                      <option value="Kerjasama Bisnis / Reseller">Kerjasama Bisnis / Reseller</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[#AAA] block mb-1 font-medium">Pesan Lengkap *</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tuliskan pertanyaan atau kebutuhan Anda secara detail..."
                      className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2.5 text-white focus:outline-none focus:border-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-white hover:bg-[#DDD] text-black font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Pesan</span>
                  </button>
                </form>
              )}
            </div>

            {/* Official Policies Highlight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-[#0E0E0E] border border-[#222] rounded space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                  <Truck className="w-4 h-4" />
                  <span>Kebijakan Pengiriman</span>
                </div>
                <p className="text-[11px] text-[#777] leading-relaxed">
                  {siteSettings.shippingPolicy}
                </p>
              </div>

              <div className="p-5 bg-[#0E0E0E] border border-[#222] rounded space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                  <RefreshCw className="w-4 h-4" />
                  <span>Garansi Retur 7 Hari</span>
                </div>
                <p className="text-[11px] text-[#777] leading-relaxed">
                  {siteSettings.returnPolicy}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
