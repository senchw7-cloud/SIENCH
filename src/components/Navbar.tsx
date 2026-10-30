/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentPath,
    navigate,
    cartCount,
    setIsCartOpen,
    wishlist,
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    setIsSearchOpen,
    siteSettings,
    isAdminLoggedIn,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/shop');
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      {siteSettings.announcementActive && (
        <div className="bg-[#101010] border-b border-[#1B1B1B] text-[#A7A7A7] text-[11px] py-1.5 px-4 text-center font-medium tracking-wider uppercase transition-colors">
          <span>{siteSettings.announcementText}</span>
        </div>
      )}

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-[#080808]/95 backdrop-blur-md border-b border-[#1B1B1B] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-[#F5F5F5] hover:text-white focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-[#A7A7A7] hover:text-[#F5F5F5]"
              aria-label="Cari"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-widest uppercase font-medium">
            <button
              onClick={() => handleNavClick('/')}
              className={`transition-colors py-1 relative ${
                currentPath === '/' ? 'text-[#F5F5F5] font-semibold' : 'text-[#A7A7A7] hover:text-[#F5F5F5]'
              }`}
            >
              Home
              {currentPath === '/' && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#F5F5F5]" />
              )}
            </button>
            <button
              onClick={() => handleNavClick('/shop')}
              className={`transition-colors py-1 relative ${
                currentPath === '/shop' ? 'text-[#F5F5F5] font-semibold' : 'text-[#A7A7A7] hover:text-[#F5F5F5]'
              }`}
            >
              Shop
              {currentPath === '/shop' && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#F5F5F5]" />
              )}
            </button>
            <button
              onClick={() => handleNavClick('/collections')}
              className={`transition-colors py-1 relative ${
                currentPath === '/collections' ? 'text-[#F5F5F5] font-semibold' : 'text-[#A7A7A7] hover:text-[#F5F5F5]'
              }`}
            >
              Collections
              {currentPath === '/collections' && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#F5F5F5]" />
              )}
            </button>
            <button
              onClick={() => handleNavClick('/about')}
              className={`transition-colors py-1 relative ${
                currentPath === '/about' ? 'text-[#F5F5F5] font-semibold' : 'text-[#A7A7A7] hover:text-[#F5F5F5]'
              }`}
            >
              About
              {currentPath === '/about' && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#F5F5F5]" />
              )}
            </button>
            <button
              onClick={() => handleNavClick('/contact')}
              className={`transition-colors py-1 relative ${
                currentPath === '/contact' ? 'text-[#F5F5F5] font-semibold' : 'text-[#A7A7A7] hover:text-[#F5F5F5]'
              }`}
            >
              Contact
              {currentPath === '/contact' && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#F5F5F5]" />
              )}
            </button>
          </nav>

          {/* Brand Logo (Centered on mobile, left/center on desktop) */}
          <div className="flex-1 md:flex-initial text-center md:text-left">
            <button
              onClick={() => handleNavClick('/')}
              className="inline-block group text-left"
            >
              <span className="font-brand text-2xl sm:text-3xl font-extrabold tracking-[0.25em] text-[#F5F5F5] group-hover:text-white transition-colors">
                {siteSettings.brandName}
              </span>
              <span className="hidden sm:block text-[9px] tracking-[0.3em] text-[#A7A7A7] uppercase -mt-0.5">
                Dark Luxury Bags
              </span>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden md:flex items-center gap-2 text-[#A7A7A7] hover:text-[#F5F5F5] px-2 py-1 text-xs tracking-wider transition-colors"
              aria-label="Pencarian"
            >
              <Search className="w-4 h-4" />
              <span className="text-[11px] uppercase">Search</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => handleNavClick('/account?tab=wishlist')}
              className="relative p-2 text-[#A7A7A7] hover:text-[#F5F5F5] transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#292929] text-[10px] text-white flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account / Admin Portal */}
            <button
              onClick={() => handleNavClick(isAdminLoggedIn ? '/admin/dashboard' : '/account')}
              className="p-2 text-[#A7A7A7] hover:text-[#F5F5F5] transition-colors flex items-center gap-1.5"
              aria-label="Akun atau Admin"
              title={isAdminLoggedIn ? 'Admin Dashboard' : 'Akun Saya'}
            >
              {isAdminLoggedIn ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-[#1B1B1B] hover:bg-[#292929] text-[#F5F5F5] rounded transition-all flex items-center gap-2 px-3"
              aria-label="Keranjang Belanja"
            >
              <ShoppingBag className="w-4 h-4 text-[#F5F5F5]" />
              <span className="text-xs font-semibold">{cartCount}</span>
            </button>
          </div>
        </div>

        {/* Search Bar Flyout */}
        {isSearchOpen && (
          <div className="border-t border-[#1B1B1B] bg-[#101010] py-4 px-4 sm:px-6 animate-in slide-in-from-top duration-200">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-[#A7A7A7]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari tas hitam, floral, tote, hobo, urban stud..."
                  className="w-full bg-[#080808] border border-[#292929] rounded py-3 pl-12 pr-24 text-sm text-[#F5F5F5] placeholder-[#666] focus:outline-none focus:border-[#A7A7A7] transition-colors"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-1.5 bg-[#F5F5F5] text-[#080808] text-xs font-semibold rounded hover:bg-white uppercase tracking-wider transition-colors"
                >
                  Cari
                </button>
              </form>
              <div className="flex items-center gap-2 mt-3 text-xs text-[#A7A7A7]">
                <span className="text-[11px] uppercase tracking-wider text-[#666]">Pencarian Populer:</span>
                {['Shadow Tote', 'Noir Blossom', 'Midnight Floral', 'Urban Stud', 'Hobo'].map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => {
                      setSearchQuery(kw);
                      navigate('/shop');
                      setIsSearchOpen(false);
                    }}
                    className="hover:text-white transition-colors underline decoration-dotted"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu (Accessible for Android single-hand control) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#0E0E0E] border-r border-[#1B1B1B] shadow-2xl p-6 flex flex-col justify-between">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-6 border-b border-[#1B1B1B]">
                <div>
                  <span className="font-brand text-2xl font-black tracking-widest text-[#F5F5F5]">
                    {siteSettings.brandName}
                  </span>
                  <p className="text-[10px] text-[#A7A7A7] tracking-widest uppercase">
                    {siteSettings.mainSlogan}
                  </p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#A7A7A7] hover:text-white"
                  aria-label="Tutup Menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="mt-6 flex flex-col gap-1">
                {[
                  { label: 'Home', path: '/' },
                  { label: 'Shop Catalog', path: '/shop' },
                  { label: 'Collections', path: '/collections' },
                  { label: 'About Brand', path: '/about' },
                  { label: 'Contact & Showroom', path: '/contact' },
                  { label: 'Pesanan Saya', path: '/account/orders' },
                  { label: 'Wishlist Favorit', path: '/account?tab=wishlist' },
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className="flex items-center justify-between py-3 px-3 rounded text-left text-sm font-medium tracking-wide text-[#CCCCCC] hover:text-white hover:bg-[#181818] transition-colors"
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-[#555]" />
                  </button>
                ))}
              </nav>
            </div>

            {/* Bottom Section in Drawer */}
            <div className="pt-6 border-t border-[#1B1B1B] flex flex-col gap-3">
              <button
                onClick={() => handleNavClick(isAdminLoggedIn ? '/admin/dashboard' : '/admin/login')}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1B1B1B] text-[#A7A7A7] hover:text-white hover:bg-[#252525] rounded text-xs font-semibold tracking-wider transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isAdminLoggedIn ? 'Buka Admin Panel' : 'Staff / Admin Login'}</span>
              </button>

              <div className="text-center text-[10px] text-[#666] tracking-wider uppercase">
                &copy; {new Date().getFullYear()} SIENCH OFFICIAL STORE
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
