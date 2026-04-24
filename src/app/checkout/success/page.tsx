import Link from "next/link";
import { CheckCircle2, Package, Truck, ArrowRight, ShoppingBag } from "@/lib/icons";
import { getOrderById } from "@/lib/checkoutStore";

interface OrderSuccessPageProps {
  searchParams: Promise<{ orderId?: string | string[] }>;
}

const formatOrderId = (id?: string | null) => {
  if (!id) return "unknown";
  return id.startsWith("ord_") ? id.slice(4).toUpperCase() : id.toUpperCase();
};

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const params = await searchParams;
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  const order = orderId ? getOrderById(orderId) : null;

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Order Not Found</h1>
        <p className="text-slate-500 mb-8">We couldn’t retrieve details for order {formatOrderId(orderId)}.</p>
        <Link href="/" className="bg-slate-900 text-white px-8 py-3 rounded-full font-medium hover:bg-slate-800 transition">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-4">
          <div className="relative mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Thank you!</h1>
            <p className="text-slate-500 text-lg">Your order was successfully placed via PayPal.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 text-left">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Items Ordered</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {order.cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm py-2 border-b border-slate-50 last:border-0">
                  <span className="text-slate-600 font-medium">
                    {item.quantity}x <span className="text-slate-900 font-bold ml-1">{item.name}</span>
                  </span>
                  <span className="text-slate-900 font-black">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
              <span className="text-lg font-bold text-slate-900">Total Paid</span>
              <span className="text-2xl font-black text-blue-600">${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Order Number</h3>
              <p className="text-lg font-black text-slate-900">{formatOrderId(order.id)}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Shipping to</h3>
              <div className="text-sm text-slate-600 font-medium leading-relaxed">
                <p className="text-slate-900 font-bold">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}</p>
                <p className="mt-2 text-slate-400 text-xs">Email: {order.email}</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-slate-100">
                  <Package className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase">Preparing Package</span>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-slate-100">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Delivery: 3-5 days</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/products" className="group px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-xl shadow-slate-200 active:scale-[0.98]">
            Continue Shopping
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/" className="px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition active:scale-[0.98]">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
