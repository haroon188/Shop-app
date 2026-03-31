'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from '@/lib/icons';
import { Recommendation } from '@/types';
import { getRecommendations, getPersonalizedHomeRecommendations } from '@/lib/recommendations';
import ProductCard from './ProductCard';

interface RecommendationSectionProps {
  productId?: string;
  title?: string;
  limit?: number;
  showReason?: boolean;
}

export default function RecommendationSection({
  productId,
  title = 'Recommended for You',
  limit = 4,
  showReason = false,
}: RecommendationSectionProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = () => {
      setIsLoading(true);
      if (productId) {
        const recs = getRecommendations(productId, limit);
        setRecommendations(recs);
      } else {
        const recs = getPersonalizedHomeRecommendations(limit);
        setRecommendations(recs);
      }
      setIsLoading(false);
    };

    loadRecommendations();
  }, [productId, limit]);

  if (isLoading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-80 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((rec) => (
          <div key={rec.product.id} className="relative">
            <ProductCard product={rec.product} />
            {showReason && (
              <div className="mt-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full inline-block">
                {rec.reason}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
