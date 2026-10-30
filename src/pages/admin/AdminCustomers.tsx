/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { StorageService, formatRupiah, formatDate } from '../../services/storage';
import { Customer } from '../../types';
import { Users, Search, ShieldCheck, Mail, Phone, ShoppingBag } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const [customers] = useState<Customer[]>(() => StorageService.getCustomers());
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <AdminLayout
      title="Manajemen Pelanggan"
      subtitle="Data profil pembeli, riwayat total transaksi, dan privasi terlindungi"
    >
      <div className="space-y-6">
        
        {/* Search & Privacy note */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#666]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, email, nomor HP..."
              className="w-full bg-[#111] border border-[#252525] rounded py-2 pl-9 pr-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white"
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#777]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Kredensial & password tidak disimpan/ditampilkan untuk keamanan privasi.</span>
          </div>
        </div>

        {/* Customer Table */}
        <div className="bg-[#0E0E0E] border border-[#1E1E1E] rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141414] text-[#888] uppercase tracking-wider text-[10px] border-b border-[#222]">
                <tr>
                  <th className="py-3 px-4">Nama Pelanggan</th>
                  <th className="py-3 px-4">Kontak (WhatsApp / Email)</th>
                  <th className="py-3 px-4">Kota</th>
                  <th className="py-3 px-4">Terdaftar</th>
                  <th className="py-3 px-4">Jumlah Pesanan</th>
                  <th className="py-3 px-4 text-right">Total Belanja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181818] text-[#CCC]">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#121212] transition-colors">
                    <td className="py-3 px-4 font-bold text-white">
                      {c.name}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-[11px]">
                        <span className="text-white block">{c.phone}</span>
                        <span className="text-[#777] block">{c.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#AAA]">{c.city || 'Indonesia'}</td>
                    <td className="py-3 px-4 text-[#888]">{formatDate(c.registeredAt)}</td>
                    <td className="py-3 px-4">
                      <span className="bg-[#1C1C1C] px-2 py-0.5 rounded text-white font-semibold">
                        {c.orderCount} pesanan
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-white">
                      {formatRupiah(c.totalSpent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
