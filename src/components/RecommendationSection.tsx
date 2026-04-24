'use client';

import { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from '@/lib/icons';
import { Recommendation } from '@/types';
import { getRecommendations, getPersonalizedHomeRecommendations } from '@/lib/recommendations';
import ProductCard from './ProductCard';

interface RecommendationSectionProps {
  productId?: string;
  title?: string;
  limit?: number;
  showReason?: boolean;
  excludeIds?: string[];
}

export default function RecommendationSection({
  productId,
  title = 'Recommended for You',
  limit = 4,
  showReason = false,
  excludeIds = [],
}: RecommendationSectionProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = () => {
      setIsLoading(true);
      if (productId) {
        const recs = getRecommendations(productId, limit, excludeIds);
        setRecommendations(recs);
      } else {
        const recs = getPersonalizedHomeRecommendations(limit);
        setRecommendations(recs);
      }
      setIsLoading(false);
    };

    loadRecommendations();
  }, [productId, limit, excludeIds]);

  if (isLoading) {
    return (
      <div className="py-8 space-y-8">
        <div className="h-8 w-64 bg-slate-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="bg-slate-50 rounded-3xl h-[450px] animate-pulse border border-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="py-12 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-600">
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Engine Active</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
          <p className="text-slate-500 font-medium text-sm max-w-xl">
            Our multi-agent system analyzed your browsing patterns to curate this selection specifically for your style profile.
          </p>
        </div>
        <button className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all duration-300">
          Refine Results <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {recommendations.map((rec) => (
          <ProductCard 
            key={rec.product.id} 
            product={rec.product} 
            reason={showReason ? rec.reason : undefined} 
          />
        ))}
      </div>
    </div>
  );
}
