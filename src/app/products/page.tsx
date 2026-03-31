'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { products, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { SlidersHorizontal } from '@/lib/icons';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by price
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      result = result.filter(p => {
        if (max) return p.price >= min && p.price <= max;
        return p.price >= min;
      });
    }

    // Sort
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
      case 'newest':
        result.reverse();
        break;
      default:
        // featured - default order
        break;
    }

    return result;
  }, [selectedCategory, priceRange, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <p className="text-gray-500">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
          <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={selectedCategory === cat.id}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-700">{cat.name} ({cat.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All Prices' },
                  { value: '0-50', label: 'Under $50' },
                  { value: '50-100', label: '$50 - $100' },
                  { value: '100-200', label: '$100 - $200' },
                  { value: '200-', label: '$200+' },
                ].map((range) => (
                  <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value={range.value}
                      checked={priceRange === range.value}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-700">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('all');
                setPriceRange('all');
              }}
              className="w-full py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500">No products found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setPriceRange('all');
                }}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
