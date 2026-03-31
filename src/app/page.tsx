'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Truck, RotateCcw } from 'lucide-react';
import { products, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';

// Dynamic import for RecommendationSection - lazy loaded
const RecommendationSection = dynamic(
  () => import('@/components/RecommendationSection'),
  { 
    ssr: false,
    loading: () => <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />
  }
);

export default function Home() {
  // Static data - no need for useState
  const featuredProducts = products.slice(0, 4);
  const newArrivals = products.slice(4, 8);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl overflow-hidden text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="relative px-8 py-16 md:py-24 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Smart Shopping,
            <br />
            <span className="text-yellow-300">Powered by AI</span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mb-8">
            Discover products tailored just for you. Our recommendation engine learns your preferences to find your perfect match.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      {/* AI Recommendations - Lazy loaded */}
      <Suspense fallback={<div className="h-96 bg-gray-100 rounded-xl animate-pulse" />}>
        <RecommendationSection
          title="Recommended For You"
          limit={4}
          showReason={true}
        />
      </Suspense>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all text-center"
            >
              <div className="text-3xl mb-2">
                {category.id === 'all' && '🛍️'}
                {category.id === 'electronics' && '⚡'}
                {category.id === 'fashion' && '👕'}
                {category.id === 'home' && '🏠'}
                {category.id === 'fitness' && '💪'}
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">{category.count} items</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link
            href="/products"
            className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
          <Link
            href="/products"
            className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI-Powered</h3>
              <p className="text-sm text-gray-500">Smart recommendations based on your preferences</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Secure Payment</h3>
              <p className="text-sm text-gray-500">100% secure payment processing</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Free Shipping</h3>
              <p className="text-sm text-gray-500">Free shipping on orders over $50</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <RotateCcw className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Easy Returns</h3>
              <p className="text-sm text-gray-500">30-day hassle-free return policy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
