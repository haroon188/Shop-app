'use client';

import { useState, useMemo } from 'react';
import { SlidersHorizontal, Search } from '@/lib/icons';
import { products, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';

// Memoized filters to prevent re-renders
const PRICE_RANGES = [
  { value: 'all', label: 'All Prices' },
  { value: '0-50', label: 'Under $50' },
  { value: '50-100', label: '$50 - $100' },
  { value: '100-200', label: '$100 - $200' },
  { value: '200-', label: '$200+' },
] as const;

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
] as const;

interface ProductsClientProps {
  initialCategory: string;
  searchQuery: string;
  initialSort: string;
  initialPrice: string;
}

export default function ProductsClient({ initialCategory, searchQuery, initialSort, initialPrice }: ProductsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState(() => initialCategory);
  const [priceRange, setPriceRange] = useState(() => initialPrice);
  const [sortBy, setSortBy] = useState(() => initialSort);
  const [showFilters, setShowFilters] = useState(false);

  const selectedCategoryLabel = categories.find((c) => c.id === selectedCategory)?.name ?? 'All Products';
  const selectedPriceLabel = PRICE_RANGES.find((r) => r.value === priceRange)?.label ?? 'All Prices';
  const hasActiveFilters = selectedCategory !== 'all' || priceRange !== 'all' || searchQuery.length > 0;

  const resetFilters = () => {
    setSelectedCategory('all');
    setPriceRange('all');
    setSortBy('featured');
    setShowFilters(false);
    window.location.href = '/products';
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      result = result.filter((p) => {
        if (max) return p.price >= min && p.price <= max;
        return p.price >= min;
      });
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [selectedCategory, priceRange, sortBy, searchQuery]);

  return (
    <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white/90 backdrop-blur px-4 sm:px-6 py-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {searchQuery ? `Results for "${searchQuery}"` : 'All Products'}
            </h1>
            <p className="text-slate-500 font-medium">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </p>
            {(selectedCategory !== 'all' || priceRange !== 'all') && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedCategory !== 'all' && (
                  <span className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                    Category: {selectedCategoryLabel}
                  </span>
                )}
                {priceRange !== 'all' && (
                  <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                    Price: {selectedPriceLabel}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 bg-white"
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-[160px]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium hover:bg-slate-100"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] items-start">
        {showFilters && (
          <div className="fixed inset-0 z-40 bg-slate-950/40 md:hidden" onClick={() => setShowFilters(false)} />
        )}

        <aside
          className={[
            'z-50 w-full lg:sticky lg:top-20 self-start',
            'md:block',
            showFilters ? 'fixed inset-x-4 top-24 md:static' : 'hidden md:block',
          ].join(' ')}
        >
          <div className="bg-white p-5 sm:p-6 rounded-[28px] border border-gray-200 shadow-lg space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="flex items-center justify-between md:hidden">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm"
              >
                Close
              </button>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => {
                  const active = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setShowFilters(false);
                      }}
                      className={`w-full flex items-center gap-3 cursor-pointer px-3 py-3 rounded-2xl text-left transition-all border ${active ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-gray-50 border-transparent'}`}
                    >
                      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${active ? 'border-indigo-600 bg-indigo-600 shadow-[inset_0_0_0_3px_white]' : 'border-slate-300 bg-white'}`} />
                      <span className="text-gray-700">{cat.name}</span>
                      <span className="text-gray-400 text-sm ml-auto">{cat.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-2">
                {PRICE_RANGES.map((range) => {
                  const active = priceRange === range.value;
                  return (
                    <button
                      key={range.value}
                      onClick={() => {
                        setPriceRange(range.value);
                        setShowFilters(false);
                      }}
                      className={`w-full flex items-center gap-3 cursor-pointer px-3 py-3 rounded-2xl text-left transition-all border ${active ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-gray-50 border-transparent'}`}
                    >
                      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${active ? 'border-indigo-600 bg-indigo-600 shadow-[inset_0_0_0_3px_white]' : 'border-slate-300 bg-white'}`} />
                      <span className="text-gray-700">{range.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={resetFilters}
              className="w-full py-3 text-indigo-600 font-semibold hover:bg-indigo-50 rounded-2xl transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        <div className="min-w-0">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 xl:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">No matches found</h2>
              <p className="text-slate-500 font-medium max-w-xs mx-auto mb-8 leading-relaxed">
                We couldn’t find anything for <span className="text-indigo-600 font-bold">“{searchQuery}”</span>.
                Try checking your spelling or using more general terms.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setPriceRange('all');
                  window.location.href = '/products'; // Hard reset to clear URL query too
                }}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10 active:scale-95"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
