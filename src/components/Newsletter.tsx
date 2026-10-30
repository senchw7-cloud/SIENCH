/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const { addToast } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Masukkan alamat email yang valid.', 'error');
      return;
    }
    setSubscribed(true);
    addToast('Terima kasih telah bergabung dengan SIENCH Society!', 'success');
  };

  return (
    <section className="py-16 sm:py-20 bg-[#0C0C0C] border-b border-[#1A1A1A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#A7A7A7] font-semibold block mb-2">
          Private Invitation
        </span>
        <h2 className="font-brand text-2xl sm:text-4xl font-extrabold text-[#F5F5F5] uppercase tracking-tight mb-3">
          JOIN THE SIENCH WORLD
        </h2>
        <p className="text-sm text-[#888888] font-light max-w-xl mx-auto mb-8">
          Dapatkan akses prioritas ke koleksi terbatas, invitasi event eksklusif, serta diskon rahasia langsung di kotak masuk Anda.
        </p>

        {subscribed ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#161616] border border-[#2B2B2B] text-white text-xs font-semibold rounded">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Selamat bergabung. Kode voucher khusus Anda: <strong>FIRSTSIENCH</strong></span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan alamat email Anda"
              required
              className="w-full bg-[#060606] border border-[#262626] rounded px-4 py-3 text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#A7A7A7] transition-colors"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-[#F5F5F5] hover:bg-white text-[#080808] text-xs font-bold uppercase tracking-widest transition-colors shrink-0 flex items-center justify-center gap-2"
            >
              <span>Join</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div className="mt-4 text-[10px] text-[#555] tracking-wide">
          Kami menghargai privasi Anda. Tanpa spam, batalkan langganan kapan pun.
        </div>
      </div>
    </section>
  );
};
