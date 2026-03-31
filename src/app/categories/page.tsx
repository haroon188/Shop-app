'use client';

import Link from 'next/link';
import { categories } from '@/data/products';
import { ArrowRight } from 'lucide-react';

const categoryImages: Record<string, string> = {
  electronics: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=800&auto=format&fit=crop',
  fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop',
  home: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d313c?w=800&auto=format&fit=crop',
  fitness: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop',
};

const categoryIcons: Record<string, string> = {
  electronics: '⚡',
  fashion: '👕',
  home: '🏠',
  fitness: '💪',
};

const categoryDescriptions: Record<string, string> = {
  electronics: 'Cutting-edge technology and gadgets for modern living',
  fashion: 'Trendy styles and timeless classics for every occasion',
  home: 'Beautiful decor and essentials for your living space',
  fitness: 'Equipment and gear to support your healthy lifestyle',
};

export default function CategoriesPage() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Explore our curated collections across different categories. Each product is carefully selected with AI-powered recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories
          .filter((cat) => cat.id !== 'all')
          .map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
            >
              <img
                src={categoryImages[category.id]}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="text-4xl mb-2">{categoryIcons[category.id]}</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {category.name}
                </h2>
                <p className="text-gray-200 mb-4">
                  {categoryDescriptions[category.id]}
                </p>
                <div className="flex items-center gap-2 text-white font-medium">
                  <span>{category.count} Products</span>
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
