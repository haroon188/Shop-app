'use client';

import Link from 'next/link';
import { products, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import RecommendationSection from '@/components/RecommendationSection';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Zap, 
  Shirt, 
  Home as HomeIcon, 
  Dumbbell,
  Target,
  ArrowUpRight
} from '@/lib/icons';
import React from 'react';

const categoryIcons: Record<string, React.ReactNode> = {
  electronics: <Zap className="w-6 h-6 text-blue-400" />,
  fashion: <Shirt className="w-6 h-6 text-pink-400" />,
  home: <HomeIcon className="w-6 h-6 text-emerald-400" />,
  fitness: <Dumbbell className="w-6 h-6 text-orange-400" />,
};

const categoryGradients: Record<string, string> = {
  electronics: "from-blue-600 to-indigo-900",
  fashion: "from-pink-600 to-purple-900",
  home: "from-emerald-600 to-teal-900",
  fitness: "from-orange-600 to-red-900",
};

export default function Home() {
  const newArrivals = products.slice(0, 4);
  // Personalized sorting for categories (simulated)
  const prioritizedCategories = [...categories]
    .filter(c => c.id !== 'all')
    .sort((a, b) => {
      const recommended = ['fashion', 'electronics'];
      const aVal = recommended.includes(a.id) ? 1 : 0;
      const bVal = recommended.includes(b.id) ? 1 : 0;
      return bVal - aVal;
    });

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-transparent" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.15),_transparent_70%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Next-Gen Commerce
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter">
              Smart Shopping, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Reimagined.</span>
            </h1>
            <p className="text-xl text-slate-300 font-medium leading-relaxed max-w-lg">
              Experience a storefront that learns your style. Powered by Neural Recommendations for a perfectly curated catalog.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/products"
                className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-2xl shadow-white/10 active:scale-95 flex items-center justify-center gap-2"
              >
                Shop Catalog
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/categories"
                className="w-full sm:w-auto px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
              >
                View Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
        {/* Personalized Recommendations */}
        <RecommendationSection title="Recommended for You" />

        {/* Shop by Category */}
        <section className="space-y-12">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                Shop by Category
                <Target className="w-6 h-6 text-indigo-500" />
              </h2>
              <p className="text-slate-500 font-medium">Prioritized by your recent neural activity</p>
            </div>
            <Link href="/categories" className="hidden sm:flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:text-indigo-700 transition-colors">
              All Categories <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {prioritizedCategories.map((category, idx) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className={`group relative overflow-hidden rounded-[32px] h-[280px] bg-gradient-to-br ${categoryGradients[category.id] || "from-slate-700 to-slate-900"} shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 animate-in fade-in zoom-in-95`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                <div className="absolute inset-0 p-8 flex flex-col justify-between items-start z-10">
                  <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl group-hover:scale-110 transition-transform">
                    {categoryIcons[category.id] || <Layers className="w-6 h-6 text-white" />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight mb-1">{category.name}</h3>
                    <p className="text-white/70 text-xs font-bold uppercase tracking-widest">{category.count} Products</p>
                  </div>
                </div>
                <div className="absolute bottom-8 right-8 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="space-y-12">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">New Arrivals</h2>
              <p className="text-slate-500 font-medium">Fresh additions to our curated neural catalog</p>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} showBadge />
            ))}
          </div>
        </section>

        {/* Trust Badges */}
        <section className="bg-slate-50 rounded-[48px] p-12 border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: Sparkles, title: "Personalized", desc: "Smarter personal choices" },
              { icon: ShieldCheck, title: "Secure Payment", desc: "PCI-DSS compliant" },
              { icon: Truck, title: "Free Shipping", desc: "On all orders over $100" },
              { icon: RotateCcw, title: "Easy Returns", desc: "30-day neural guarantee" }
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4 group">
                <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-500">
                  <badge.icon className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 tracking-tight">{badge.title}</h4>
                  <p className="text-sm text-slate-500 font-medium">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Layers({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}
