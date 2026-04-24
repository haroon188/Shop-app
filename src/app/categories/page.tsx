'use client';

import Link from 'next/link';
import { categories } from '@/data/products';
import { ArrowRight, Zap, Shirt, Home, Dumbbell, Sparkles } from '@/lib/icons';
import React, { useMemo } from 'react';

const categoryImages: Record<string, string> = {
  electronics: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=800&auto=format&fit=crop',
  fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop',
  home: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d313c?w=800&auto=format&fit=crop',
  fitness: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop',
};

const categoryIcons: Record<string, React.ReactNode> = {
  electronics: <Zap className="w-8 h-8 text-blue-400" />,
  fashion: <Shirt className="w-8 h-8 text-pink-400" />,
  home: <Home className="w-8 h-8 text-emerald-400" />,
  fitness: <Dumbbell className="w-8 h-8 text-orange-400" />,
};

const categoryDescriptions: Record<string, string> = {
  electronics: 'Cutting-edge technology and gadgets for modern living',
  fashion: 'Trendy styles and timeless classics for every occasion',
  home: 'Beautiful decor and essentials for your living space',
  fitness: 'Equipment and gear to support your healthy lifestyle',
};

// Simulate personalization (this could be from a hook/context later)
const recommendedCategories = ['fashion', 'electronics'];

export default function CategoriesPage() {
  // Personalized sorting: prioritize recommended categories
  const sortedCategories = useMemo(() => {
    return [...categories]
      .filter((cat) => cat.id !== 'all')
      .sort((a, b) => {
        const aRec = recommendedCategories.includes(a.id) ? 1 : 0;
        const bRec = recommendedCategories.includes(b.id) ? 1 : 0;
        return bRec - aRec;
      });
  }, []);

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-2">
          <Sparkles className="w-3 h-3" />
          Curated Collections
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Shop by Category
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
          Explore our collections with personalized recommendations to find exactly what you love.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sortedCategories.map((category, idx) => {
          const isRecommended = recommendedCategories.includes(category.id);
          
          return (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group relative overflow-hidden rounded-[32px] aspect-[4/3] md:aspect-auto md:h-[400px] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Background Image with Fallback and Overlay */}
              <div className="absolute inset-0 bg-slate-100">
                <img
                  src={categoryImages[category.id]}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format&fit=crop';
                  }}
                />
              </div>
              
              {/* Deeper Scrim for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Personalization Badge */}
              {isRecommended && (
                <div className="absolute top-6 left-6 z-10">
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-xl">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    Recommended for you
                  </div>
                </div>
              )}

              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end items-start z-10">
                <div className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                  {categoryIcons[category.id]}
                </div>
                
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
                  {category.name}
                </h2>
                
                <p className="text-slate-200 text-sm md:text-base font-medium max-w-md mb-6 leading-relaxed opacity-90">
                  {categoryDescriptions[category.id]}
                </p>
                
                <div className="flex items-center gap-3 bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-xl">
                  <span>{category.count} Products</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
