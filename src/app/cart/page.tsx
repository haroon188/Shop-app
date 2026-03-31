'use client';

import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Package, CreditCard, Truck } from '@/lib/icons';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
        >
          Start Shopping
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  const subtotal = totalPrice;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart ({totalItems} items)</h1>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-600 font-medium text-sm"
          >
            Clear Cart
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl border border-gray-200 flex gap-6"
            >
              <Link href={`/product/${item.id}`}>
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.id}`}>
                  <h3 className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-1 min-w-12 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <Link
          href="/products"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Order Summary */}
      <div className="lg:sticky lg:top-24 h-fit">
        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

          <div className="space-y-3 text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-medium">
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            {shipping === 0 && (
              <p className="text-sm text-green-600">You qualified for free shipping!</p>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
            <CreditCard className="w-5 h-5" />
            Proceed to Checkout
          </button>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
            <div className="text-center">
              <Truck className="w-5 h-5 mx-auto text-gray-400 mb-1" />
              <p className="text-xs text-gray-500">Free Shipping over $50</p>
            </div>
            <div className="text-center">
              <Package className="w-5 h-5 mx-auto text-gray-400 mb-1" />
              <p className="text-xs text-gray-500">Fast Delivery</p>
            </div>
            <div className="text-center">
              <CreditCard className="w-5 h-5 mx-auto text-gray-400 mb-1" />
              <p className="text-xs text-gray-500">Secure Payment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
