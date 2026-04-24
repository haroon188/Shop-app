'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu, X } from '@/lib/icons';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Use a timestamp or unique key to force refresh if on same page
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}&t=${Date.now()}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Shop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-indigo-600 font-bold text-sm uppercase tracking-widest transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-indigo-600 font-bold text-sm uppercase tracking-widest transition-colors">
              Catalog
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-indigo-600 font-bold text-sm uppercase tracking-widest transition-colors">
              Categories
            </Link>
            <Link href="/admin" className="px-4 py-1.5 bg-slate-900 text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all">
              Admin
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full group">
              <input
                type="text"
                placeholder="Search products or ask for suggestions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-sm font-medium"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
            </form>
          </div>

          {/* Cart */}
          <Link href="/cart" className="relative flex-none p-3 mr-1 hover:bg-gray-100 rounded-full transition-colors">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex-none p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col space-y-3">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </form>
              <Link
                href="/"
                className="text-gray-700 hover:text-indigo-600 font-bold text-sm uppercase tracking-widest py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-gray-700 hover:text-indigo-600 font-bold text-sm uppercase tracking-widest py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Catalog
              </Link>
              <Link
                href="/categories"
                className="text-gray-700 hover:text-indigo-600 font-bold text-sm uppercase tracking-widest py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/admin"
                className="bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest py-3 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Panel
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
