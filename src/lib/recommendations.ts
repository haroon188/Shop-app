import { Product, UserActivity, Recommendation } from '@/types';
import { products } from '@/data/products';

const ACTIVITY_STORAGE_KEY = 'user_activities';

// Memoization cache for recommendations
const recommendationCache = new Map<string, { recs: Recommendation[]; timestamp: number }>();
const CACHE_TTL = 5000; // 5 seconds

// Pre-computed product lookup maps for O(1) access
const productById = new Map(products.map(p => [p.id, p]));
const productsByTag = new Map<string, Product[]>();
const productsByCategory = new Map<string, Product[]>();

// Initialize category/tag lookup maps
products.forEach(p => {
  // Category index
  if (!productsByCategory.has(p.category)) {
    productsByCategory.set(p.category, []);
  }
  productsByCategory.get(p.category)!.push(p);
  
  // Tag index
  p.tags.forEach(tag => {
    if (!productsByTag.has(tag)) {
      productsByTag.set(tag, []);
    }
    productsByTag.get(tag)!.push(p);
  });
});

// Pre-compute trending products for cold start
const trendingProducts = [...products]
  .sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)
  .slice(0, 8);

export function getUserActivities(): UserActivity[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function trackActivity(activity: UserActivity): void {
  if (typeof window === 'undefined') return;
  const activities = getUserActivities();
  activities.push(activity);
  // Keep only last 100 activities
  const trimmed = activities.slice(-100);
  localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(trimmed));
  // Clear cache on new activity
  recommendationCache.clear();
}

export function getRecommendations(
  currentProductId?: string,
  limit: number = 4
): Recommendation[] {
  const cacheKey = `${currentProductId || 'home'}_${limit}`;
  const cached = recommendationCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.recs;
  }

  const activities = getUserActivities();
  const product = currentProductId ? productById.get(currentProductId) : null;
  
  if (activities.length === 0 && !product) {
    const recs = trendingProducts
      .filter(p => p.id !== currentProductId)
      .slice(0, limit)
      .map(p => ({
        product: p,
        score: 1,
        reason: 'Trending now'
      }));
    recommendationCache.set(cacheKey, { recs, timestamp: Date.now() });
    return recs;
  }

  // Use Maps instead of objects for better performance
  const categoryScores = new Map<string, number>();
  const tagScores = new Map<string, number>();
  const viewedProducts = new Set<string>();

  // Single pass through activities
  for (let i = activities.length - 1; i >= 0; i--) {
    const activity = activities[i];
    const weight = activity.action === 'purchase' ? 3 : 
                   activity.action === 'cart' ? 2 : 1;
    
    if (activity.category) {
      categoryScores.set(activity.category, (categoryScores.get(activity.category) || 0) + weight);
    }
    
    if (activity.tags) {
      for (const tag of activity.tags) {
        tagScores.set(tag, (tagScores.get(tag) || 0) + weight);
      }
    }

    if (activity.action === 'view') {
      viewedProducts.add(activity.productId);
    }
  }

  // Score products using pre-computed lookups
  const candidates: Recommendation[] = [];
  const excludeId = currentProductId || '';
  
  // Get related products quickly
  if (product) {
    // Same category products
    const sameCategory = productsByCategory.get(product.category) || [];
    for (const p of sameCategory) {
      if (p.id === excludeId) continue;
      
      let score = 5;
      const reasons: string[] = [];
      
      // Category match score
      const catScore = categoryScores.get(p.category);
      if (catScore) {
        score += catScore * 2;
        reasons.push(`Because you viewed ${p.category} items`);
      }
      
      // Tag matching
      let sharedTagCount = 0;
      let firstSharedTag = '';
      for (const tag of p.tags) {
        if (product.tags.includes(tag)) {
          sharedTagCount++;
          if (!firstSharedTag) firstSharedTag = tag;
          const tagScore = tagScores.get(tag);
          if (tagScore) score += tagScore;
        }
      }
      
      if (sharedTagCount > 0) {
        score += sharedTagCount * 2;
        reasons.push(`Matches your interest in ${firstSharedTag}`);
      }
      
      if (viewedProducts.has(p.id)) score += 0.5;
      score += (p.rating - 4) * p.reviews / 1000;
      
      candidates.push({
        product: p,
        score,
        reason: reasons[0] || 'Similar item'
      });
    }
  }
  
  // Add products from scored categories
  for (const [cat, score] of categoryScores) {
    if (cat === product?.category) continue;
    
    const catProducts = productsByCategory.get(cat) || [];
    for (const p of catProducts) {
      if (p.id === excludeId || candidates.some(c => c.product.id === p.id)) continue;
      
      const finalScore = score * 2 + (p.rating - 4) * p.reviews / 1000;
      if (viewedProducts.has(p.id)) {
        candidates.push({
          product: p,
          score: finalScore,
          reason: 'Based on your browsing'
        });
      }
    }
  }
  
  // Fill remaining with trending
  if (candidates.length < limit) {
    for (const p of trendingProducts) {
      if (p.id !== excludeId && !candidates.some(c => c.product.id === p.id)) {
        candidates.push({
          product: p,
          score: 1,
          reason: 'Trending now'
        });
      }
      if (candidates.length >= limit * 2) break;
    }
  }

  const recs = candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
    
  recommendationCache.set(cacheKey, { recs, timestamp: Date.now() });
  return recs;
}

export function getPersonalizedHomeRecommendations(limit: number = 8): Recommendation[] {
  const cacheKey = `home_diverse_${limit}`;
  const cached = recommendationCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.recs;
  }

  const recs = getRecommendations(undefined, limit * 2);
  
  // Ensure variety by category
  const byCategory = new Map<string, Recommendation[]>();
  for (const r of recs) {
    const existing = byCategory.get(r.product.category);
    if (existing) {
      existing.push(r);
    } else {
      byCategory.set(r.product.category, [r]);
    }
  }

  const diverse: Recommendation[] = [];
  const categories = Array.from(byCategory.keys());
  let index = 0;
  
  while (diverse.length < limit && categories.some(c => (byCategory.get(c)?.length || 0) > 0)) {
    const cat = categories[index % categories.length];
    const catRecs = byCategory.get(cat);
    if (catRecs && catRecs.length > 0) {
      diverse.push(catRecs.shift()!);
    }
    index++;
  }

  recommendationCache.set(cacheKey, { recs: diverse, timestamp: Date.now() });
  return diverse;
}

export function getFrequentlyBoughtTogether(productId: string, limit: number = 3): Product[] {
  const product = productById.get(productId);
  if (!product) return [];

  // Fast lookup using pre-computed category index
  const sameCategory = productsByCategory.get(product.category) || [];
  return sameCategory
    .filter(p => p.id !== productId)
    .sort((a, b) => {
      // Count shared tags quickly
      let aShared = 0, bShared = 0;
      for (const tag of product.tags) {
        if (a.tags.includes(tag)) aShared++;
        if (b.tags.includes(tag)) bShared++;
      }
      return bShared - aShared;
    })
    .slice(0, limit);
}

export function clearActivityHistory(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACTIVITY_STORAGE_KEY);
    recommendationCache.clear();
  }
}
