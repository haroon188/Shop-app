# Autoresearch: E-commerce Optimization

## Objective
Optimize the Next.js e-commerce website for performance across three dimensions:
1. **Bundle Size** - Reduce JavaScript payload delivered to clients
2. **Page Speed** - Improve Lighthouse performance scores
3. **Recommendation Speed** - Optimize AI recommendation algorithm execution time

## Metrics

### Primary
- **bundle_js_kb**: Total JS bundle size in kilobytes (lower is better)

### Secondary
- **recommendation_µs**: Time to generate recommendations (lower is better)
- **lighthouse_performance**: Lighthouse performance score 0-100 (higher is better)
- **first_load_js_kb": First load JS size (lower is better)

## How to Run
```bash
./autoresearch.sh
```

Outputs metric lines like:
```
METRIC bundle_js_kb=245.5
METRIC recommendation_µs=850
METRIC first_load_js_kb=89.2
```

## Files in Scope
| File | Purpose |
|------|---------|
| `src/lib/recommendations.ts` | AI recommendation engine - optimize scoring loops, reduce complexity |
| `src/context/CartContext.tsx` | Cart state - memoization, reduce re-renders |
| `src/components/ProductCard.tsx` | Product display - code splitting, lazy loading |
| `src/components/Navbar.tsx` | Navigation - optimize re-renders |
| `src/app/page.tsx` | Home page - optimize data fetching |
| `src/app/product/[id]/page.tsx` | Product detail - parallel data loading |
| `src/app/products/page.tsx` | Product list - virtualization for large lists |
| `src/app/cart/page.tsx` | Cart page - memoization |
| `next.config.ts` | Build optimization, bundling settings |
| `package.json` | Dependency optimization |

## Off Limits
- `src/data/products.ts` - Data source, not logic
- `src/types/index.ts` - Type definitions
- Public API contracts

## Constraints
- All pages must render without errors
- Cart functionality must work
- Recommendations must still generate valid results
- No new npm dependencies without justification

## Optimization Strategies

### Bundle Size
- Dynamic imports with `next/dynamic`
- Tree shaking verification
- Code splitting at component level
- Remove unused code
- Optimize import patterns

### Page Speed
- Image optimization
- CSS optimization
- Reduce render-blocking resources
- Memoization (React.memo, useMemo, useCallback)

### Recommendation Speed
- Memoize scoring calculations
- Use Maps instead of Objects for O(1) lookups
- Debounce activity tracking
- Pre-compute category/tag scores
- Limit activity history size (already limited to 100)

## What's Been Tried
<!-- Updated by agent during experiments -->

## Current Baseline
<!-- Set after first run -->
