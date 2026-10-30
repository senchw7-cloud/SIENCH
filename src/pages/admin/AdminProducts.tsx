/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { StorageService, formatRupiah } from '../../services/storage';
import { Product, ProductTag } from '../../types';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  Upload,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { products, refreshProducts, addToast } = useApp();
  const categories = StorageService.getCategories();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: 500000,
    originalPrice: 0,
    description: '',
    category: 'Tote Bag',
    stock: 15,
    minStock: 4,
    sku: '',
    dimensions: '',
    material: '',
    tags: ['NEW ARRIVAL'] as ProductTag[],
    isActive: true,
    featured: false,
    images: ['/images/products/siench-shadow-tote.jpg'] as string[],
  });

  const [imageUrlInput, setImageUrlInput] = useState('');

  // Handle open modal for new
  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: 599000,
      originalPrice: 699000,
      description: 'Tas hitam bergaya minimalis modern untuk aktivitas harian.',
      category: categories[0]?.name || 'Tote Bag',
      stock: 15,
      minStock: 4,
      sku: 'SNC-' + Math.floor(1000 + Math.random() * 9000),
      dimensions: '38 x 32 x 12 cm',
      material: 'Premium Vegan Leather Glossy Finish',
      tags: ['NEW ARRIVAL'],
      isActive: true,
      featured: true,
      images: ['/images/products/siench-shadow-tote.jpg'],
    });
    setImageUrlInput('');
    setIsModalOpen(true);
  };

  // Handle open modal for edit
  const handleEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      price: prod.price,
      originalPrice: prod.originalPrice || 0,
      description: prod.description,
      category: prod.category,
      stock: prod.stock,
      minStock: prod.minStock || 3,
      sku: prod.sku,
      dimensions: prod.dimensions || '',
      material: prod.material || '',
      tags: prod.tags || [],
      isActive: prod.isActive,
      featured: prod.featured || false,
      images: [...prod.images],
    });
    setImageUrlInput('');
    setIsModalOpen(true);
  };

  // Toggle active status directly from table
  const handleToggleStatus = (prod: Product) => {
    StorageService.saveProduct({
      id: prod.id,
      isActive: !prod.isActive,
    });
    refreshProducts();
    addToast(`Status "${prod.name}" diubah menjadi ${!prod.isActive ? 'Aktif' : 'Nonaktif'}`, 'info');
  };

  // Delete product with confirmation
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus produk "${name}" dari katalog SIENCH?`)) {
      StorageService.deleteProduct(id);
      refreshProducts();
      addToast(`Produk "${name}" telah dihapus.`, 'info');
    }
  };

  // Handle File Upload from device (Android & Desktop)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        if (base64Url) {
          setFormData((prev) => ({
            ...prev,
            images: [base64Url, ...prev.images],
          }));
          addToast(`Foto "${file.name}" berhasil diunggah!`, 'success');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle Add image URL
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()],
    }));
    setImageUrlInput('');
    addToast('Tautan gambar ditambahkan.', 'success');
  };

  // Remove an image
  const handleRemoveImage = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  // Toggle tag in form
  const handleToggleTag = (tag: ProductTag) => {
    setFormData((prev) => {
      const exists = prev.tags.includes(tag);
      return {
        ...prev,
        tags: exists ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
      };
    });
  };

  // Submit product save
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Nama produk tidak boleh kosong!', 'error');
      return;
    }
    if (formData.price <= 0) {
      addToast('Harga produk harus lebih dari 0.', 'error');
      return;
    }

    StorageService.saveProduct({
      ...(editingProduct ? { id: editingProduct.id } : {}),
      name: formData.name,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      description: formData.description,
      category: formData.category,
      stock: Number(formData.stock),
      minStock: Number(formData.minStock),
      sku: formData.sku,
      dimensions: formData.dimensions,
      material: formData.material,
      tags: formData.tags,
      isActive: formData.isActive,
      featured: formData.featured,
      images: formData.images.length > 0 ? formData.images : ['/images/products/siench-shadow-tote.jpg'],
    });

    refreshProducts();
    setIsModalOpen(false);
    addToast(
      editingProduct
        ? `Perubahan produk "${formData.name}" berhasil disimpan!`
        : `Produk baru "${formData.name}" berhasil ditambahkan ke katalog!`,
      'success'
    );
  };

  // Filter list
  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCat === 'All' || p.category === selectedCat;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <AdminLayout
      title="Manajemen Katalog Produk"
      subtitle="Kelola stok, harga, deskripsi, foto produk, dan status visibilitas toko"
    >
      <div className="space-y-6">
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#666]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama produk atau kode SKU..."
                className="w-full bg-[#111] border border-[#252525] rounded py-2 pl-9 pr-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white"
              />
            </div>

            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="bg-[#111] border border-[#252525] rounded py-2 px-3 text-xs text-white focus:outline-none"
            >
              <option value="All">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-white hover:bg-[#DDD] text-black text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk Baru</span>
          </button>
        </div>

        {/* Products Table (Desktop & Mobile Responsive) */}
        <div className="bg-[#0E0E0E] border border-[#1E1E1E] rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141414] text-[#888] uppercase tracking-wider text-[10px] border-b border-[#222]">
                <tr>
                  <th className="py-3 px-4">Produk</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Harga (IDR)</th>
                  <th className="py-3 px-4">Stok</th>
                  <th className="py-3 px-4">Label</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181818] text-[#CCC]">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#121212] transition-colors">
                    {/* Product Name & Image */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 bg-[#181818] rounded overflow-hidden p-1 shrink-0 flex items-center justify-center">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/images/products/siench-shadow-tote.jpg';
                            }}
                          />
                        </div>
                        <div>
                          <span className="font-bold text-white block">{prod.name}</span>
                          <span className="text-[10px] text-[#777] font-mono">SKU: {prod.sku}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">{prod.category}</td>

                    {/* Price */}
                    <td className="py-3 px-4 font-semibold text-white">
                      {formatRupiah(prod.price)}
                      {prod.originalPrice && prod.originalPrice > prod.price && (
                        <span className="text-[10px] text-[#666] line-through block">
                          {formatRupiah(prod.originalPrice)}
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4">
                      <span
                        className={`font-bold ${
                          prod.stock <= prod.minStock ? 'text-rose-400' : 'text-white'
                        }`}
                      >
                        {prod.stock} unit
                      </span>
                      {prod.stock <= prod.minStock && (
                        <span className="text-[9px] text-rose-500 block">Menipis</span>
                      )}
                    </td>

                    {/* Tags */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {prod.tags?.map((t) => (
                          <span
                            key={t}
                            className="text-[9px] uppercase px-1.5 py-0.5 bg-[#222] text-[#AAA] rounded border border-[#333]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Visibility Status */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(prod)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                          prod.isActive
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                        }`}
                      >
                        {prod.isActive ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(prod)}
                          className="p-1.5 bg-[#1C1C1C] hover:bg-white text-white hover:text-black rounded transition-colors"
                          title="Edit Produk"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="p-1.5 bg-[#1C1C1C] hover:bg-rose-600 text-[#888] hover:text-white rounded transition-colors"
                          title="Hapus Produk"
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

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0F0F0F] border border-[#262626] rounded-lg max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#222]">
              <h3 className="font-brand text-lg font-bold text-white uppercase tracking-wider">
                {editingProduct ? 'Edit Informasi Produk' : 'Tambah Produk Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#888] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              
              {/* Product Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#AAA] block mb-1 font-semibold">Nama Produk *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: SIENCH SHADOW TOTE"
                    className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-[#AAA] block mb-1 font-semibold">Kategori *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#AAA] block mb-1 font-semibold">Harga Jual (IDR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-[#AAA] block mb-1 font-semibold">Harga Coret / Diskon (Opsional)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* Stock, Min Stock, SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[#AAA] block mb-1 font-semibold">Stok Tersedia *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-[#AAA] block mb-1 font-semibold">Stok Minimum Alert</label>
                  <input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                    className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-[#AAA] block mb-1 font-semibold">Kode SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    placeholder="SNC-ST-001"
                    className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* Dimensions & Material */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#AAA] block mb-1 font-semibold">Ukuran / Dimensi</label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder="Contoh: 38 x 32 x 12 cm"
                    className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-[#AAA] block mb-1 font-semibold">Material / Bahan</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="Contoh: Premium Vegan Leather Glossy Finish"
                    className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[#AAA] block mb-1 font-semibold">Deskripsi Singkat Produk *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white resize-none"
                />
              </div>

              {/* Images Manager & Device Upload (Android & Desktop) */}
              <div className="pt-2 border-t border-[#222]">
                <label className="text-[#AAA] block mb-2 font-semibold">
                  Foto Produk (Upload dari Galeri / Kamera Perangkat atau Tautan)
                </label>

                {/* File picker */}
                <div className="flex flex-col sm:flex-row items-center gap-2 mb-3">
                  <label className="w-full sm:w-auto px-4 py-2 bg-[#1C1C1C] hover:bg-[#282828] border border-[#333] text-white rounded cursor-pointer flex items-center justify-center gap-2 transition-colors">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Pilih Foto dari Perangkat</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex-1 flex gap-2 w-full">
                    <input
                      type="text"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Atau tempel URL gambar lokal / aset"
                      className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white text-[11px] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-2 bg-[#222] hover:bg-white text-white hover:text-black rounded shrink-0"
                    >
                      Tambah
                    </button>
                  </div>
                </div>

                {/* Thumbnails list */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-20 bg-[#161616] rounded border border-[#2B2B2B] overflow-hidden p-1 flex items-center justify-center group"
                    >
                      <img
                        src={img}
                        alt="preview"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/products/siench-shadow-tote.jpg';
                        }}
                      />
                      {idx === 0 && (
                        <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] text-white text-center font-bold">
                          UTAMA
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-0.5 bg-rose-950 text-rose-300 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Hapus foto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags & Visibility */}
              <div className="pt-2 border-t border-[#222] space-y-3">
                <div>
                  <span className="text-[#AAA] block mb-1 font-semibold">Label Produk:</span>
                  <div className="flex flex-wrap gap-2">
                    {(['NEW ARRIVAL', 'BEST SELLER', 'LIMITED EDITION', 'SIGNATURE'] as ProductTag[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleToggleTag(t)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                          formData.tags.includes(t)
                            ? 'bg-white text-black'
                            : 'bg-[#181818] text-[#888] border border-[#2B2B2B]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-white">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded bg-[#111] accent-white"
                    />
                    <span>Tampilkan di Toko (Aktif)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-white">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded bg-[#111] accent-white"
                    />
                    <span>Koleksi Utama (Featured)</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#222] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#2B2B2B] text-[#888] hover:text-white rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-white text-black font-bold uppercase tracking-wider rounded hover:bg-[#DDD]"
                >
                  Simpan Produk
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};
