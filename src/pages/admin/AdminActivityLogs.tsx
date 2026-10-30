/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { StorageService, formatDate } from '../../services/storage';
import { AdminActivityLog } from '../../types';
import { History, ShieldCheck, Search } from 'lucide-react';

export const AdminActivityLogs: React.FC = () => {
  const [logs] = useState<AdminActivityLog[]>(() => StorageService.getActivityLogs());
  const [search, setSearch] = useState('');

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.adminEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="Log Aktivitas Admin (Audit Trail)"
      subtitle="Catatan riwayat setiap aksi administrator untuk keamanan operasional dan akuntabilitas"
    >
      <div className="space-y-6">
        
        {/* Search */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#666]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari aksi atau detail catatan..."
              className="w-full bg-[#111] border border-[#252525] rounded py-2 pl-9 pr-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white"
            />
          </div>

          <span className="text-xs text-[#888]">
            Total Catatan: <strong className="text-white">{filtered.length}</strong>
          </span>
        </div>

        {/* Logs Table */}
        <div className="bg-[#0E0E0E] border border-[#1E1E1E] rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141414] text-[#888] uppercase tracking-wider text-[10px] border-b border-[#222]">
                <tr>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Tindakan (Action)</th>
                  <th className="py-3 px-4">Rincian Perubahan</th>
                  <th className="py-3 px-4">Administrator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181818] text-[#CCC]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[#666] italic">
                      Belum ada log aktivitas tercatat.
                    </td>
                  </tr>
                ) : (
                  filtered.map((log) => (
                    <tr key={log.id} className="hover:bg-[#121212] transition-colors">
                      <td className="py-3 px-4 text-[#888] font-mono whitespace-nowrap">
                        {formatDate(log.timestamp)}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        <span className="bg-[#181818] px-2 py-0.5 rounded border border-[#2A2A2A]">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#AAA]">
                        {log.details}
                      </td>
                      <td className="py-3 px-4 text-emerald-400 font-mono text-[11px]">
                        {log.adminEmail}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
