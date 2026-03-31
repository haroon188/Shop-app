'use client';

import Link from 'next/link';
import { Star, ShoppingCart, Heart } from '@/lib/icons';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { trackActivity } from '@/lib/recommendations';

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
}

export default function ProductCard({ product, showBadge = false }: ProductCardProps) {
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
    <div className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link href={`/product/${product.id}`} onClick={handleViewProduct}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {showBadge && product.stock < 20 && (
            <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
              Low Stock
            </span>
          )}
          {product.rating >= 4.8 && (
            <span className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
              Best Seller
            </span>
          )}
          <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviews.toLocaleString()})
          </span>
        </div>

        <Link href={`/product/${product.id}`} onClick={handleViewProduct}>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
