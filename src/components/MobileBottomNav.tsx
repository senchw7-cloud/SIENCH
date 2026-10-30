/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Grid, Heart, ShoppingBag, User, ShieldCheck } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentPath, navigate, cartCount, wishlist, setIsCartOpen, isAdminLoggedIn } = useApp();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0E0E0E]/95 backdrop-blur-md border-t border-[#1B1B1B] px-2 py-2 flex items-center justify-around">
      {/* Home */}
      <button
        onClick={() => navigate('/')}
        className={`flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium transition-colors ${
          currentPath === '/' ? 'text-white' : 'text-[#777] hover:text-[#bbb]'
        }`}
      >
        <Home className="w-5 h-5 mb-1" />
        <span>Home</span>
      </button>

      {/* Shop */}
      <button
        onClick={() => navigate('/shop')}
        className={`flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium transition-colors ${
          currentPath === '/shop' ? 'text-white' : 'text-[#777] hover:text-[#bbb]'
        }`}
      >
        <Grid className="w-5 h-5 mb-1" />
        <span>Shop</span>
      </button>

      {/* Wishlist */}
      <button
        onClick={() => navigate('/account?tab=wishlist')}
        className={`relative flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium transition-colors ${
          currentPath.includes('wishlist') ? 'text-white' : 'text-[#777] hover:text-[#bbb]'
        }`}
      >
        <div className="relative">
          <Heart className="w-5 h-5 mb-1" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-[#444] text-[9px] text-white rounded-full flex items-center justify-center font-bold">
              {wishlist.length}
            </span>
          )}
        </div>
        <span>Wishlist</span>
      </button>

      {/* Cart */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium text-[#777] hover:text-white transition-colors"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 mb-1 text-white" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 w-4 h-4 bg-white text-black text-[9px] rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>

      {/* Account / Admin */}
      <button
        onClick={() => navigate(isAdminLoggedIn ? '/admin/dashboard' : '/account')}
        className={`flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium transition-colors ${
          currentPath.includes('account') || currentPath.includes('admin')
            ? 'text-white'
            : 'text-[#777] hover:text-[#bbb]'
        }`}
      >
        {isAdminLoggedIn ? (
          <ShieldCheck className="w-5 h-5 mb-1 text-emerald-400" />
        ) : (
          <User className="w-5 h-5 mb-1" />
        )}
        <span>{isAdminLoggedIn ? 'Admin' : 'Akun'}</span>
      </button>
    </div>
  );
};
