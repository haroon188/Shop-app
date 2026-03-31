import { Product, UserActivity, Recommendation } from '@/types';
import { products } from '@/data/products';

const ACTIVITY_STORAGE_KEY = 'user_activities';

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
}

export function getRecommendations(
  currentProductId?: string,
  limit: number = 4
): Recommendation[] {
  const activities = getUserActivities();
  const product = currentProductId ? products.find(p => p.id === currentProductId) : null;
  
  if (activities.length === 0 && !product) {
    // Cold start: return trending/high-rated products
    return products
      .filter(p => p.id !== currentProductId)
      .sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)
      .slice(0, limit)
      .map(p => ({
        product: p,
        score: 1,
        reason: 'Trending now'
      }));
  }

  // Calculate category and tag preferences from activity
  const categoryScores: Record<string, number> = {};
  const tagScores: Record<string, number> = {};
  const viewedProducts = new Set<string>();
  const cartProducts = new Set<string>();
  const purchasedProducts = new Set<string>();

  activities.forEach(activity => {
    const weight = activity.action === 'purchase' ? 3 : 
                   activity.action === 'cart' ? 2 : 1;
    
    if (activity.category) {
      categoryScores[activity.category] = (categoryScores[activity.category] || 0) + weight;
    }
    
    if (activity.tags) {
      activity.tags.forEach(tag => {
        tagScores[tag] = (tagScores[tag] || 0) + weight;
      });
    }

    if (activity.action === 'view') viewedProducts.add(activity.productId);
    if (activity.action === 'cart') cartProducts.add(activity.productId);
    if (activity.action === 'purchase') purchasedProducts.add(activity.productId);
  });

  // Score all products
  const scoredProducts = products
    .filter(p => p.id !== currentProductId)
    .map(p => {
      let score = 0;
      const reasons: string[] = [];

      // Category matching
      if (categoryScores[p.category]) {
        score += categoryScores[p.category] * 2;
        reasons.push(`Because you viewed ${p.category} items`);
      }

      // Tag matching
      p.tags.forEach(tag => {
        if (tagScores[tag]) {
          score += tagScores[tag];
        }
      });

      // Content-based similarity to current product
      if (product) {
        if (p.category === product.category) {
          score += 5;
          reasons.push(`Similar to ${product.name}`);
        }
        
        const sharedTags = p.tags.filter(tag => product.tags.includes(tag));
        score += sharedTags.length * 2;
        
        if (sharedTags.length > 0) {
          reasons.push(`Matches your interest in ${sharedTags[0]}`);
        }
      }

      // Collaborative filtering: users who viewed this also viewed...
      if (viewedProducts.has(p.id)) {
        score += 0.5;
      }

      // Rating boost
      score += (p.rating - 4) * p.reviews / 1000;

      // Diversity: slight penalty for same category to encourage variety
      if (product && p.category === product.category && score > 5) {
        score *= 0.9;
      }

      return {
        product: p,
        score,
        reason: reasons[0] || (p.rating > 4.7 ? 'Top rated' : 'Recommended for you')
      };
    });

  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getPersonalizedHomeRecommendations(limit: number = 8): Recommendation[] {
  const recs = getRecommendations(undefined, limit * 2);
  
  // Ensure variety: group by category and pick best from each
  const byCategory: Record<string, Recommendation[]> = {};
  recs.forEach(r => {
    if (!byCategory[r.product.category]) {
      byCategory[r.product.category] = [];
    }
    byCategory[r.product.category].push(r);
  });

  const diverse: Recommendation[] = [];
  const categories = Object.keys(byCategory);
  let index = 0;
  
  while (diverse.length < limit && categories.some(c => byCategory[c].length > 0)) {
    const cat = categories[index % categories.length];
    if (byCategory[cat].length > 0) {
      diverse.push(byCategory[cat].shift()!);
    }
    index++;
  }

  return diverse;
}

export function getFrequentlyBoughtTogether(productId: string, limit: number = 3): Product[] {
  const product = products.find(p => p.id === productId);
  if (!product) return [];

  // Simple association: products in same category with shared tags
  return products
    .filter(p => p.id !== productId && p.category === product.category)
    .sort((a, b) => {
      const aShared = a.tags.filter(t => product.tags.includes(t)).length;
      const bShared = b.tags.filter(t => product.tags.includes(t)).length;
      return bShared - aShared;
    })
    .slice(0, limit);
}

export function clearActivityHistory(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACTIVITY_STORAGE_KEY);
  }
}
