/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { StorageService, formatRupiah, formatDate } from '../../services/storage';
import { Coupon } from '../../types';
import { Plus, Trash2, Edit2, TicketPercent, Check, X } from 'lucide-react';

export const AdminPromotions: React.FC = () => {
  const { addToast } = useApp();
  const [coupons, setCoupons] = useState<Coupon[]>(() => StorageService.getCoupons());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    value: 10,
    minPurchase: 500000,
    maxDiscount: 100000,
    expiryDate: '2026-12-31',
    usageLimit: 100,
    isActive: true,
  });

  const refresh = () => setCoupons(StorageService.getCoupons());

  const handleAddNew = () => {
    setEditingCoupon(null);
    setFormData({
      code: 'SIENCHNEW',
      discountType: 'percentage',
      value: 10,
      minPurchase: 500000,
      maxDiscount: 150000,
      expiryDate: '2026-12-31',
      usageLimit: 200,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setFormData({
      code: c.code,
      discountType: c.discountType,
      value: c.value,
      minPurchase: c.minPurchase,
      maxDiscount: c.maxDiscount || 0,
      expiryDate: c.expiryDate,
      usageLimit: c.usageLimit,
      isActive: c.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, code: string) => {
    if (confirm(`Yakin ingin menghapus kode promo "${code}"?`)) {
      StorageService.deleteCoupon(id);
      refresh();
      addToast(`Promo "${code}" dihapus.`, 'info');
    }
  };

  const handleToggleActive = (c: Coupon) => {
    StorageService.saveCoupon({
      ...c,
      isActive: !c.isActive,
    });
    refresh();
    addToast(`Status promo "${c.code}" diubah.`, 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    StorageService.saveCoupon({
      ...(editingCoupon ? { id: editingCoupon.id, usedCount: editingCoupon.usedCount } : {}),
      code: formData.code.trim().toUpperCase(),
      discountType: formData.discountType,
      value: Number(formData.value),
      minPurchase: Number(formData.minPurchase),
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
      expiryDate: formData.expiryDate,
      usageLimit: Number(formData.usageLimit),
      isActive: formData.isActive,
    });

    refresh();
    setIsModalOpen(false);
    addToast(
      editingCoupon ? `Kupon promo "${formData.code}" diperbarui!` : `Kupon baru "${formData.code}" dibuat!`,
      'success'
    );
  };

  return (
    <AdminLayout
      title="Manajemen Promo & Kupon"
      subtitle="Buat voucher diskon, tentukan syarat minimal belanja, dan batasi kuota penggunaan"
    >
      <div className="space-y-6">
        
        {/* Header Button */}
        <div className="flex justify-between items-center pb-4 border-b border-[#1A1A1A]">
          <span className="text-xs text-[#888]">
            Total Voucher: <strong className="text-white">{coupons.length}</strong>
          </span>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-white hover:bg-[#DDD] text-black text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Kode Promo Baru</span>
          </button>
        </div>

        {/* Coupons Table */}
        <div className="bg-[#0E0E0E] border border-[#1E1E1E] rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141414] text-[#888] uppercase tracking-wider text-[10px] border-b border-[#222]">
                <tr>
                  <th className="py-3 px-4">Kode Promo</th>
                  <th className="py-3 px-4">Tipe & Nilai Diskon</th>
                  <th className="py-3 px-4">Min. Belanja</th>
                  <th className="py-3 px-4">Maks. Potongan</th>
                  <th className="py-3 px-4">Masa Berlaku</th>
                  <th className="py-3 px-4">Kuota Terpakai</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181818] text-[#CCC]">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-[#121212] transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-white text-sm bg-[#161616] px-2.5 py-1 rounded border border-[#2B2B2B]">
                        {c.code}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-white">
                      {c.discountType === 'percentage' ? `${c.value}%` : formatRupiah(c.value)}
                    </td>

                    <td className="py-3 px-4 text-[#AAA]">
                      {c.minPurchase > 0 ? formatRupiah(c.minPurchase) : 'Tanpa Min.'}
                    </td>

                    <td className="py-3 px-4 text-[#AAA]">
                      {c.maxDiscount ? formatRupiah(c.maxDiscount) : 'Tak Terbatas'}
                    </td>

                    <td className="py-3 px-4 text-[#888]">
                      Sampai {c.expiryDate}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono text-white font-semibold">
                        {c.usedCount} / {c.usageLimit}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(c)}
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                          c.isActive
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                            : 'bg-rose-950/60 text-rose-400 border-rose-800/40'
                        }`}
                      >
                        {c.isActive ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(c)}
                          className="p-1.5 text-[#888] hover:text-white"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.code)}
                          className="p-1.5 text-[#888] hover:text-rose-400"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modal Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F0F] border border-[#262626] rounded-lg max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#222]">
              <h3 className="font-brand text-sm font-bold text-white uppercase tracking-wider">
                {editingCoupon ? 'Edit Kode Promo' : 'Buat Kode Promo'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-[#888] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[#AAA] block mb-1 font-semibold">Kode Voucher *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="Misal: SIENCHDARK"
                  className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#AAA] block mb-1 font-semibold">Tipe Diskon</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
                  >
                    <option value="percentage">Persentase (%)</option>
                    <option value="fixed">Nominal Tetap (Rp)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#AAA] block mb-1 font-semibold">
                    Nilai ({formData.discountType === 'percentage' ? '%' : 'Rp'}) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#AAA] block mb-1 font-semibold">Minimal Belanja (IDR)</label>
                  <input
                    type="number"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({ ...formData, minPurchase: Number(e.target.value) })}
                    className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-[#AAA] block mb-1 font-semibold">Batas Kuota Penggunaan</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#AAA] block mb-1 font-semibold">Tanggal Berakhir (Masa Berlaku)</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded bg-[#111] accent-white"
                  />
                  <span>Aktifkan Kupon Ini</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#222]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#2B2B2B] text-[#888] hover:text-white rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-black font-bold uppercase tracking-wider rounded hover:bg-[#DDD]"
                >
                  Simpan Kupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};
