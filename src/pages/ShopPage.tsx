/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { StorageService } from '../services/storage';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search, Check } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { products, searchQuery, setSearchQuery } = useApp();
  const categories = StorageService.getCategories();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<number>(1000000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Must be active
      if (!item.isActive) return false;

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Tag filter
      if (selectedTag !== 'All' && (!item.tags || !item.tags.includes(selectedTag as any))) {
        return false;
      }

      // In-stock only
      if (inStockOnly && item.stock <= 0) {
        return false;
      }

      // Price limit
      if (item.price > priceRange) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'bestseller') return (b.salesCount || 0) - (a.salesCount || 0);
      return 0; // default featured
    });
  }, [products, searchQuery, selectedCategory, selectedTag, inStockOnly, priceRange, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedTag('All');
    setSortBy('featured');
    setInStockOnly(false);
    setPriceRange(1000000);
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="bg-[#080808] min-h-screen py-8 sm:py-12 border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8 pb-6 border-b border-[#1C1C1C]">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#888] font-semibold block mb-1">
            Official Catalogue
          </span>
          <h1 className="font-brand text-3xl sm:text-5xl font-extrabold text-[#F5F5F5] uppercase tracking-tight">
            COLLECTION & SHOP
          </h1>
          <p className="text-sm text-[#888888] mt-1 font-light">
            Eksplorasi koleksi tas hitam eksklusif dengan presisi craftsmanship dan identitas dark luxury.
          </p>
        </div>

        {/* Filter Bar Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          
          {/* Mobile Filter & Sort Triggers */}
          <div className="flex items-center gap-2 sm:hidden w-full">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="flex-1 py-2.5 px-4 bg-[#141414] border border-[#262626] rounded text-xs font-semibold uppercase tracking-wider text-[#F5F5F5] flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filter ({selectedCategory !== 'All' || inStockOnly ? 'Aktif' : 'Semua'})</span>
            </button>

            <div className="relative flex-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-2.5 px-3 bg-[#141414] border border-[#262626] rounded text-xs font-semibold text-[#F5F5F5] focus:outline-none appearance-none"
              >
                <option value="featured">Urutan: Rekomendasi</option>
                <option value="newest">Terbaru</option>
                <option value="bestseller">Terlaris</option>
                <option value="price-low">Harga: Rendah ke Tinggi</option>
                <option value="price-high">Harga: Tinggi ke Rendah</option>
              </select>
            </div>
          </div>

          {/* Desktop Filter Tabs (Categories) */}
          <div className="hidden sm:flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => {
                setSelectedCategory('All');
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-white text-black'
                  : 'bg-[#141414] text-[#888] hover:text-white hover:bg-[#1E1E1E]'
              }`}
            >
              Semua ({products.filter((p) => p.isActive).length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-colors ${
                  selectedCategory === cat.name
                    ? 'bg-white text-black'
                    : 'bg-[#141414] text-[#888] hover:text-white hover:bg-[#1E1E1E]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Desktop Sort Dropdown */}
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-xs text-[#777] uppercase tracking-wider">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-1.5 px-3 bg-[#141414] border border-[#282828] rounded text-xs font-medium text-white focus:outline-none cursor-pointer"
            >
              <option value="featured">Koleksi Pilihan (Featured)</option>
              <option value="newest">Produk Terbaru</option>
              <option value="bestseller">Produk Terlaris</option>
              <option value="price-low">Harga: Rendah ke Tinggi</option>
              <option value="price-high">Harga: Tinggi ke Rendah</option>
            </select>
          </div>
        </div>

        {/* Main Catalog Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block space-y-6">
            <div className="p-5 bg-[#0E0E0E] border border-[#1E1E1E] rounded space-y-6">
              
              {/* Active search tag badge */}
              {searchQuery && (
                <div className="flex items-center justify-between pb-4 border-b border-[#1E1E1E]">
                  <span className="text-xs text-white font-medium">Kata Kunci: &quot;{searchQuery}&quot;</span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-[#888] hover:text-white p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Tag Filters */}
              <div>
                <h4 className="text-xs uppercase font-bold tracking-widest text-[#F5F5F5] mb-3">
                  Label Koleksi
                </h4>
                <div className="space-y-1.5">
                  {['All', 'NEW ARRIVAL', 'BEST SELLER', 'LIMITED EDITION', 'SIGNATURE'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSelectedTag(tag);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left py-1 text-xs tracking-wide transition-colors flex items-center justify-between ${
                        selectedTag === tag ? 'text-white font-bold' : 'text-[#777] hover:text-[#CCC]'
                      }`}
                    >
                      <span>{tag === 'All' ? 'Semua Label' : tag}</span>
                      {selectedTag === tag && <Check className="w-3 h-3 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Filter */}
              <div className="pt-4 border-t border-[#1C1C1C]">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#CCC] hover:text-white">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#111] border-[#333] accent-white"
                  />
                  <span>Hanya Stok Tersedia</span>
                </label>
              </div>

              {/* Price Max Slider */}
              <div className="pt-4 border-t border-[#1C1C1C]">
                <div className="flex items-center justify-between text-xs text-[#AAA] mb-2">
                  <span>Maks. Harga:</span>
                  <span className="font-bold text-white">Rp {priceRange.toLocaleString('id-ID')}</span>
                </div>
                <input
                  type="range"
                  min="400000"
                  max="1000000"
                  step="25000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              {/* Reset button */}
              <div className="pt-2">
                <button
                  onClick={resetFilters}
                  className="w-full py-2 border border-[#2B2B2B] hover:border-white text-[11px] uppercase tracking-wider text-[#888] hover:text-white rounded transition-colors"
                >
                  Reset Semua Filter
                </button>
              </div>

            </div>
          </div>

          {/* Product Grid Area (3 Cols on Desktop, 2 on Mobile) */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center p-8 bg-[#0E0E0E] border border-[#1E1E1E] rounded flex flex-col items-center">
                <Search className="w-10 h-10 text-[#444] mb-3 stroke-[1.2]" />
                <h3 className="text-base font-bold text-white mb-1">
                  Tidak Ada Produk yang Sesuai
                </h3>
                <p className="text-xs text-[#777] max-w-sm mb-6 font-light">
                  Coba sesuaikan kata kunci pencarian, filter kategori, atau tingkatkan batas harga Anda.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-[#DDD] transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4 text-xs text-[#777]">
                  <span>Menampilkan <strong>{filteredProducts.length}</strong> produk</span>
                  {totalPages > 1 && (
                    <span>Halaman {currentPage} dari {totalPages}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                  {paginatedProducts.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-[#1C1C1C]">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 200, behavior: 'smooth' });
                          }}
                          className={`w-9 h-9 rounded text-xs font-bold transition-colors ${
                            currentPage === pageNum
                              ? 'bg-white text-black'
                              : 'bg-[#141414] text-[#888] hover:text-white border border-[#222]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm sm:hidden flex justify-end">
          <div className="w-4/5 max-w-xs bg-[#0E0E0E] h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#222] mb-6">
                <span className="font-brand text-base font-bold text-white uppercase tracking-wider">
                  Filter Produk
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-[#888] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-xs uppercase font-bold text-white mb-2 tracking-wider">Kategori</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`block w-full text-left py-1.5 text-xs ${
                      selectedCategory === 'All' ? 'text-white font-bold' : 'text-[#777]'
                    }`}
                  >
                    Semua Kategori
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.name)}
                      className={`block w-full text-left py-1.5 text-xs ${
                        selectedCategory === c.name ? 'text-white font-bold' : 'text-[#777]'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock */}
              <div className="mb-6 pt-4 border-t border-[#1C1C1C]">
                <label className="flex items-center gap-2 text-xs text-white">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#111] accent-white"
                  />
                  <span>Hanya Stok Tersedia</span>
                </label>
              </div>

              {/* Price */}
              <div className="mb-6 pt-4 border-t border-[#1C1C1C]">
                <div className="flex justify-between text-xs text-[#AAA] mb-2">
                  <span>Maks. Harga:</span>
                  <span className="font-bold text-white">Rp {priceRange.toLocaleString('id-ID')}</span>
                </div>
                <input
                  type="range"
                  min="400000"
                  max="1000000"
                  step="25000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-white"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-[#222]">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded"
              >
                Terapkan Filter
              </button>
              <button
                onClick={resetFilters}
                className="w-full py-2 text-xs text-[#888] hover:text-white"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
