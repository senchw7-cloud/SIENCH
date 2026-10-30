/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { adminLogin, navigate } = useApp();
  const [email, setEmail] = useState('admin@siench.com');
  const [password, setPassword] = useState('darkluxury2026');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(email, password);
    if (success) {
      navigate('/admin/dashboard');
    }
  };

  const handleQuickDemoLogin = () => {
    setEmail('admin@siench.com');
    setPassword('darkluxury2026');
    adminLogin('admin@siench.com', 'darkluxury2026');
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0F0F0F] border border-[#222222] rounded-lg shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto text-white">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="font-brand text-2xl font-black tracking-widest text-white uppercase">
            SIENCH ADMIN
          </h1>
          <p className="text-xs text-[#888] tracking-wider uppercase">
            Internal Management Control Panel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#AAA] mb-1 font-semibold">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#666]" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@siench.com"
                className="w-full bg-[#080808] border border-[#282828] rounded py-2.5 pl-10 pr-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#AAA] mb-1 font-semibold">
              Secret Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#666]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#080808] border border-[#282828] rounded py-2.5 pl-10 pr-10 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#666] hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-white hover:bg-[#DDD] text-black font-bold text-xs uppercase tracking-[0.2em] rounded transition-colors flex items-center justify-center gap-2 mt-2 shadow-lg"
          >
            <span>Masuk ke Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Login Preset */}
        <div className="pt-4 border-t border-[#1C1C1C] space-y-3">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 bg-[#171717] hover:bg-[#222] border border-[#2D2D2D] text-xs font-semibold text-[#CCC] hover:text-white rounded transition-colors flex items-center justify-center gap-2"
          >
            <span>1-Click Demo Login (Admin Access)</span>
          </button>

          <div className="p-3 bg-[#0A0A0A] rounded border border-[#1E1E1E] text-[11px] text-[#777] space-y-1">
            <div>Default Email: <strong className="text-white font-mono">admin@siench.com</strong></div>
            <div>Default Password: <strong className="text-white font-mono">darkluxury2026</strong></div>
          </div>
        </div>

        {/* Back to store */}
        <div className="text-center pt-2">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-[#777] hover:text-white transition-colors"
          >
            &larr; Kembali ke Website Belanja
          </button>
        </div>

      </div>
    </div>
  );
};
