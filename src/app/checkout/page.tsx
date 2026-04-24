"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  ChevronLeft, 
  ShoppingBag, 
  Info, 
  Loader2,
  CheckCircle2,
  Lock
} from "@/lib/icons";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCart } from "../../context/CartContext";

// --- Types ---
interface ShippingDetails {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
}

const initialOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
  currency: "USD",
  intent: "capture",
};

export default function RealPaypalCheckout() {
  const router = useRouter();
  const { items, totalPrice, totalItems, clearCart } = useCart();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shipping, setShipping] = useState<ShippingDetails>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
  });

  // --- Calculations ---
  const tax = useMemo(() => totalPrice * 0.08, [totalPrice]);
  const shippingCost = useMemo(() => (totalPrice > 100 || totalItems === 0 ? 0 : 12.00), [totalPrice, totalItems]);
  const finalTotal = useMemo(() => totalPrice + tax + shippingCost, [totalPrice, tax, shippingCost]);

  // --- Validation (Ensures button is only active if form is filled) ---
  const isFormValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      emailRegex.test(shipping.email) &&
      shipping.firstName.length >= 1 &&
      shipping.lastName.length >= 1 &&
      shipping.address.length >= 5 &&
      shipping.city.length >= 2 &&
      shipping.zipCode.length >= 5
    );
  }, [shipping]);

  // --- Real PayPal Order Creation (Server-Side) ---
  const createOrder = useCallback(async () => {
    try {
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: items,
          total: finalTotal
        }),
      });

      const orderData = (await response.json()) as { id?: string; error?: string };
      if (orderData.id) {
        return orderData.id;
      } else {
        throw new Error(orderData.error || "Failed to initiate PayPal order.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    }
  }, [items, finalTotal]);

  // --- Real PayPal Capture (Server-Side) ---
  const onApprove = useCallback(async (data: { orderID: string }) => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderID: data.orderID,
          shippingAddress: shipping,
          cartItems: items
        }),
      });

      const captureData = (await response.json()) as { success?: boolean; orderId?: string; error?: string };
      
      if (captureData.success) {
        clearCart();
        router.push(`/checkout/success?orderId=${captureData.orderId}`);
      } else {
        throw new Error(captureData.error || "Failed to capture payment.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  }, [shipping, items, clearCart, router]);

  if (totalItems === 0 && !isProcessing) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8 text-slate-400" />
        </div>
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Your cart is empty</h1>
        <p className="text-slate-500 mb-8 text-center max-w-xs">Add some products to your cart before checking out.</p>
        <Link href="/products" className="bg-slate-900 text-white px-8 py-3 rounded-full font-medium hover:bg-slate-800 transition">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="min-h-screen bg-white font-sans text-slate-900">
        {/* Amazon-style Minimal Header */}
        <header className="border-b border-gray-100 bg-white py-4 px-6 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-2xl font-black tracking-tighter text-slate-900">
              SHOP
            </Link>
            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
              <Lock className="w-4 h-4" />
              Secure Checkout
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 min-h-[calc(100-72px)]">
          {/* Left Pane: Shipping & Payment */}
          <div className="p-8 lg:p-16 border-r border-slate-100">
            <Link href="/cart" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 transition mb-12">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to cart
            </Link>

            <div className="max-w-md mx-auto lg:ml-0">
              <h1 className="text-3xl font-bold tracking-tight mb-8">Shipping Address</h1>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-900"
                    value={shipping.email}
                    onChange={e => setShipping({...shipping, email: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">First name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      value={shipping.firstName}
                      onChange={e => setShipping({...shipping, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Last name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      value={shipping.lastName}
                      onChange={e => setShipping({...shipping, lastName: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full address</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    value={shipping.address}
                    onChange={e => setShipping({...shipping, address: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      value={shipping.city}
                      onChange={e => setShipping({...shipping, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">ZIP code</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      value={shipping.zipCode}
                      onChange={e => setShipping({...shipping, zipCode: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  Payment
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                </h2>

                <div className="relative">
                  {!isFormValid && (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center p-6 text-center rounded-2xl border border-dashed border-slate-200 transition-opacity">
                      <p className="text-sm font-semibold text-slate-600">
                        Please complete shipping info to unlock PayPal
                      </p>
                    </div>
                  )}

                  <div className={!isFormValid ? "opacity-30 pointer-events-none" : "opacity-100"}>
                    {process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID === "test" ? (
                      <button
                        type="button"
                        disabled={!isFormValid || isProcessing}
                        onClick={async () => {
                          setIsProcessing(true);
                          try {
                            const orderId = await createOrder();
                            await onApprove({ orderID: orderId });
                          } catch (e) {
                            setIsProcessing(false);
                          }
                        }}
                        className="w-full py-3 bg-[#ffc439] hover:bg-[#f2ba36] rounded-full transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
                      >
                        <span className="text-[#003087] italic font-black tracking-tighter text-lg">Pay</span>
                        <span className="text-[#009cde] italic font-black tracking-tighter text-lg">Pal</span>
                        <span className="ml-2 text-[#003087] font-bold text-sm underline decoration-2 underline-offset-4">Checkout</span>
                      </button>
                    ) : (
                      <PayPalButtons
                        style={{ 
                          layout: "vertical", 
                          shape: "pill", 
                          color: "gold", 
                          label: "checkout",
                          height: 50 
                        }}
                        disabled={!isFormValid || isProcessing}
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={(err) => {
                          console.error("PayPal Script Error:", err);
                          setError("Could not initialize PayPal. Please check connection.");
                        }}
                      />
                    )}
                  </div>
                </div>

                {error && (
                  <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-2xl text-sm flex items-start gap-2 border border-red-100 animate-in fade-in zoom-in-95 duration-200">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {isProcessing && (
                  <div className="mt-6 flex items-center justify-center gap-3 text-blue-600 font-bold bg-blue-50 py-4 rounded-2xl border border-blue-100">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Securing your payment...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Pane: Order Summary */}
          <div className="bg-slate-50/50 p-8 lg:p-16">
            <div className="max-w-md mx-auto lg:ml-0">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-8">Your Order</h2>
              
              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center relative flex-shrink-0 shadow-sm">
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 text-white text-[11px] flex items-center justify-center rounded-full font-bold border-2 border-white">
                        {item.quantity}
                      </span>
                      <ShoppingBag className="w-7 h-7 text-slate-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{item.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">Item ${item.price.toFixed(2)}</p>
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-6 space-y-4">
                <div className="flex justify-between text-sm text-slate-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-slate-900">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500 font-medium">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? "text-emerald-600 font-bold" : "text-slate-900"}>
                    {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-500 font-medium">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-slate-900">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 mt-6 pt-6 flex justify-between items-center">
                  <span className="text-xl font-bold text-slate-900">Total</span>
                  <div className="flex flex-col items-end">
                    <span className="text-3xl font-black tracking-tight text-blue-600">
                      ${finalTotal.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">USD Currency</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/40 border-l-4 border-l-blue-500">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">PayPal Security</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                      Pay with confidence. Your transaction is protected by PayPal’s industry-leading safety systems.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
