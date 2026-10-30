/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { StorageService } from '../../services/storage';
import { Category } from '../../types';
import { Plus, Edit2, Trash2, X, Layers } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { addToast } = useApp();
  const [categories, setCategories] = useState<Category[]>(() => StorageService.getCategories());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const refresh = () => {
    setCategories(StorageService.getCategories());
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description || '' });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus kategori "${name}"?`)) {
      StorageService.deleteCategory(id);
      refresh();
      addToast(`Kategori "${name}" dihapus.`, 'info');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    StorageService.saveCategory({
      ...(editingCategory ? { id: editingCategory.id } : {}),
      name: formData.name.trim(),
      description: formData.description.trim(),
    });

    refresh();
    setIsModalOpen(false);
    addToast(
      editingCategory ? `Kategori "${formData.name}" diperbarui!` : `Kategori baru "${formData.name}" ditambahkan!`,
      'success'
    );
  };

  return (
    <AdminLayout
      title="Kategori Produk"
      subtitle="Kelola pengelompokan tas fashion SIENCH di katalog website"
    >
      <div className="space-y-6">
        
        {/* Header Button */}
        <div className="flex justify-between items-center pb-4 border-b border-[#1A1A1A]">
          <span className="text-xs text-[#888]">
            Total Kategori: <strong className="text-white">{categories.length}</strong>
          </span>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-white hover:bg-[#DDD] text-black text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kategori Baru</span>
          </button>
        </div>

        {/* Categories List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-5 bg-[#0E0E0E] border border-[#1E1E1E] rounded flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-[#666] uppercase">{cat.slug}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="p-1 text-[#888] hover:text-white"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-1 text-[#888] hover:text-rose-400"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h3 className="font-brand text-base font-bold text-white">{cat.name}</h3>
                <p className="text-xs text-[#777] mt-1 font-light leading-relaxed">
                  {cat.description || 'Tidak ada deskripsi tambahan.'}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F0F] border border-[#262626] rounded-lg max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#222]">
              <h3 className="font-brand text-sm font-bold text-white uppercase tracking-wider">
                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-[#888] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[#AAA] block mb-1 font-semibold">Nama Kategori *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Crossbody Bag"
                  className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="text-[#AAA] block mb-1 font-semibold">Deskripsi</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi singkat karakteristik kategori tas..."
                  className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white resize-none"
                />
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
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};
