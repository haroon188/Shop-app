import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Package,
} from "@/lib/icons";
import { getOrdersForUser } from "@/lib/checkoutStore";
import { getAdminStats } from "@/lib/adminStore";

interface AdminDashboardProps {
  searchParams?: Promise<{ range?: string | string[] }>;
}

export default async function AdminDashboard({ searchParams }: AdminDashboardProps) {
  const params = searchParams ? await searchParams : {};
  const range = Array.isArray(params.range) ? params.range[0] : params.range || "monthly";
  const stats = getAdminStats(getOrdersForUser("guest"));

  const statCards = [
    { name: "Total Revenue", value: `$${stats.totalSales.toFixed(2)}`, icon: DollarSign, color: "bg-blue-500", trend: "+12.5%", isUp: true },
    { name: "Net Profit", value: `$${stats.estimatedProfit.toFixed(2)}`, icon: TrendingUp, color: "bg-emerald-500", trend: "+8.2%", isUp: true },
    { name: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "bg-indigo-500", trend: "+18%", isUp: true },
    { name: "Active Users", value: "128", icon: Users, color: "bg-orange-500", trend: "-2.4%", isUp: false },
  ];

  const rangeLabel = range === "daily" ? "Daily" : range === "weekly" ? "Weekly" : "Monthly";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.name} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.05)] flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-between items-start">
              <div className={`p-3 ${card.color} text-white rounded-2xl shadow-lg ${card.color.replace('bg-', 'shadow-')}/20 ring-1 ring-white/60`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${card.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {card.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.trend}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.name}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-8">
        <div className="bg-white border border-slate-100 p-8 rounded-[36px] shadow-[0_20px_50px_rgba(15,23,42,0.05)] relative overflow-hidden min-h-[400px]">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Sales Analytics</h3>
              <p className="text-sm text-slate-400 font-medium">{rangeLabel} revenue visualization</p>
            </div>
            <div className="flex gap-2">
              {[
                { key: "daily", label: "Daily" },
                { key: "weekly", label: "Weekly" },
                { key: "monthly", label: "Monthly" },
              ].map((t) => (
                <Link
                  key={t.key}
                  href={`/admin?range=${t.key}`}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-full transition-colors ${range === t.key ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center h-[250px] space-y-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-blue-500 opacity-40 animate-pulse" />
            </div>
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Chart Visualization (Real-time)</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-8 rounded-[36px] shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
          <h3 className="text-lg font-black text-slate-900 tracking-tight mb-8">Top Selling</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">Example Product {i}</h4>
                  <p className="text-xs text-slate-400 uppercase font-black tracking-tighter mt-0.5">Fashion • 248 Sales</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">$2,490</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/admin/products"
            className="w-full mt-10 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors flex items-center justify-center"
          >
            View Full Report
          </Link>
        </div>
      </div>
    </div>
  );
}
