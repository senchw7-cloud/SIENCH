/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { StorageService, formatRupiah, formatDate } from '../../services/storage';
import { Product } from '../../types';
import {
  Boxes,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  Plus,
  Minus,
  X,
  History
} from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { products, refreshProducts, addToast } = useApp();
  const [movements, setMovements] = useState(() => StorageService.getInventoryMovements());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(5);
  const [adjustReason, setAdjustReason] = useState<'Restock' | 'Correction' | 'Return' | 'Damage'>('Restock');

  const handleOpenAdjust = (prod: Product) => {
    setSelectedProduct(prod);
    setAdjustAmount(5);
    setAdjustReason('Restock');
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const newStock = Math.max(0, selectedProduct.stock + adjustAmount);
    StorageService.saveProduct({
      id: selectedProduct.id,
      stock: newStock,
    });

    refreshProducts();
    setMovements(StorageService.getInventoryMovements());
    addToast(
      `Stok "${selectedProduct.name}" disesuaikan (${adjustAmount > 0 ? '+' : ''}${adjustAmount}). Stok baru: ${newStock} unit.`,
      'success'
    );
    setSelectedProduct(null);
  };

  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;

  return (
    <AdminLayout
      title="Manajemen Inventaris & Stok"
      subtitle="Pantau jumlah stok, peringatan stok menipis, dan riwayat pergerakan logistik"
    >
      <div className="space-y-8">
        
        {/* Top Warning Banner if low stock */}
        {lowStockCount > 0 && (
          <div className="p-4 bg-rose-950/40 border border-rose-800/40 rounded flex items-center justify-between text-xs text-rose-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                Peringatan: Terdapat <strong>{lowStockCount} produk</strong> dengan stok di bawah batas minimum!
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold text-rose-400">Perlu Restock</span>
          </div>
        )}

        {/* Current Stock Levels Table */}
        <div className="bg-[#0E0E0E] border border-[#1E1E1E] rounded overflow-hidden">
          <div className="p-4 border-b border-[#1C1C1C] flex items-center justify-between">
            <h3 className="font-brand text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Boxes className="w-4 h-4 text-white" />
              <span>Daftar Stok Produk Aktif</span>
            </h3>
            <span className="text-xs text-[#888]">
              Total SKU: <strong>{products.length}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141414] text-[#888] uppercase tracking-wider text-[10px] border-b border-[#222]">
                <tr>
                  <th className="py-3 px-4">Produk</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Stok Saat Ini</th>
                  <th className="py-3 px-4">Batas Min.</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181818] text-[#CCC]">
                {products.map((p) => {
                  const isLow = p.stock <= p.minStock;
                  return (
                    <tr key={p.id} className="hover:bg-[#121212] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-12 bg-[#1A1A1A] rounded p-0.5 flex items-center justify-center shrink-0">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              onError={(e) => {
                                e.currentTarget.src = '/images/products/siench-shadow-tote.jpg';
                              }}
                              className="max-h-full object-contain"
                            />
                          </div>
                          <span className="font-bold text-white">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#AAA]">{p.sku}</td>
                      <td className="py-3 px-4">{p.category}</td>
                      <td className="py-3 px-4">
                        <span className={`font-bold text-sm ${isLow ? 'text-rose-400' : 'text-white'}`}>
                          {p.stock} unit
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#777]">{p.minStock} unit</td>
                      <td className="py-3 px-4">
                        {isLow ? (
                          <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-900/40">
                            Stok Menipis
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/40">
                            Aman
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenAdjust(p)}
                          className="px-3 py-1.5 bg-[#1C1C1C] hover:bg-white text-white hover:text-black rounded text-[11px] font-semibold transition-colors"
                        >
                          Sesuaikan Stok
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Movement History Log */}
        <div className="p-6 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C]">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-white" />
              <h3 className="font-brand text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Riwayat Perubahan Stok (Audit Trail)
              </h3>
            </div>
            <span className="text-[11px] text-[#777]">
              {movements.length} riwayat tercatat
            </span>
          </div>

          {movements.length === 0 ? (
            <p className="text-xs text-[#666] py-4 text-center italic">
              Belum ada pergerakan stok tercatat.
            </p>
          ) : (
            <div className="divide-y divide-[#1A1A1A] max-h-72 overflow-y-auto">
              {movements.slice(0, 15).map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{log.productName}</span>
                    <span className="text-[10px] text-[#777] font-mono ml-2">SKU: {log.sku}</span>
                    <div className="text-[11px] text-[#888] mt-0.5">
                      Alasan: <strong className="text-[#CCC]">{log.reason}</strong> · {formatDate(log.timestamp)}
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-bold font-mono text-xs ${
                        log.changeAmount > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {log.changeAmount > 0 ? `+${log.changeAmount}` : log.changeAmount}
                    </span>
                    <span className="text-[10px] text-[#777] block">
                      {log.previousStock} &rarr; {log.newStock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Adjust Stock Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F0F] border border-[#262626] rounded-lg max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#222]">
              <h3 className="font-brand text-sm font-bold text-white uppercase tracking-wider">
                Penyesuaian Stok
              </h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 text-[#888] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-4 text-xs">
              <div className="p-3 bg-[#141414] rounded border border-[#222]">
                <span className="text-[#777] block text-[10px] uppercase tracking-wider">Nama Produk:</span>
                <span className="font-bold text-white text-sm block">{selectedProduct.name}</span>
                <span className="text-[#888] text-[11px]">Stok saat ini: <strong>{selectedProduct.stock} unit</strong></span>
              </div>

              <div>
                <label className="text-[#AAA] block mb-1 font-semibold">
                  Jumlah Perubahan (Positif untuk tambah, negatif untuk kurang)
                </label>
                <input
                  type="number"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-white"
                />
                <span className="text-[10px] text-[#777] mt-0.5 block">
                  Hasil akhir stok:{' '}
                  <strong className="text-white">
                    {Math.max(0, selectedProduct.stock + adjustAmount)} unit
                  </strong>
                </span>
              </div>

              <div>
                <label className="text-[#AAA] block mb-1 font-semibold">
                  Alasan Perubahan
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value as any)}
                  className="w-full bg-[#080808] border border-[#2B2B2B] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
                >
                  <option value="Restock">Restock (Barang Masuk Pabrik / Gudang)</option>
                  <option value="Correction">Koreksi Stok Fisik / Opname</option>
                  <option value="Return">Retur Pelanggan</option>
                  <option value="Damage">Barang Rusak / Cacat Produksi</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#222]">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 border border-[#2B2B2B] text-[#888] hover:text-white rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-black font-bold uppercase tracking-wider rounded hover:bg-[#DDD]"
                >
                  Simpan Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};
