'use client';

import Link from 'next/link';
import { Star, ShoppingCart, Heart, Sparkles } from '@/lib/icons';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { trackActivity } from '@/lib/recommendations';

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
  reason?: string;
}

export default function ProductCard({ product, showBadge = false, reason }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    trackActivity({
      productId: product.id,
      action: 'cart',
      timestamp: Date.now(),
      category: product.category,
      tags: product.tags,
    });
  };

  const handleViewProduct = () => {
    trackActivity({
      productId: product.id,
      action: 'view',
      timestamp: Date.now(),
      category: product.category,
      tags: product.tags,
    });
  };

  return (
    <div className="group h-full flex flex-col bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ease-out">
      <Link href={`/product/${product.id}`} onClick={handleViewProduct} className="block relative aspect-square overflow-hidden bg-slate-50/50">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&auto=format&fit=crop&q=60';
          }}
        />
        {/* Overlaid UI Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
          {showBadge && product.stock < 20 && (
            <span className="px-3 py-1 bg-red-500 text-white text-[9px] font-black uppercase tracking-[0.15em] rounded-full shadow-lg">
              Low Stock
            </span>
          )}
          {product.rating >= 4.8 && (
            <span className="px-3 py-1 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.15em] rounded-full shadow-lg">
              Best Seller
            </span>
          )}
        </div>
        
        <button className="absolute bottom-4 right-4 z-10 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-md transition-all hover:bg-white hover:scale-110 active:scale-95 group/heart">
          <Heart className="w-4 h-4 text-slate-600 group-hover/heart:text-red-500 group-hover/heart:fill-red-500 transition-colors" />
        </button>
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} 
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {product.rating} ({product.reviews.toLocaleString()})
          </span>
        </div>

        <Link href={`/product/${product.id}`} onClick={handleViewProduct} className="block group-hover:text-indigo-600 transition-colors">
          <h3 className="font-black text-slate-900 leading-tight mb-2 line-clamp-1 text-base tracking-tight">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed mb-6">
          {product.description}
        </p>

        <div className="mt-auto pt-5 flex items-center justify-between border-t border-slate-50">
          <span className="text-2xl font-black text-slate-900 tracking-tighter">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-900/10"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Add</span>
          </button>
        </div>

        {reason && (
          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
              {reason}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
