"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  LogOut, 
  Settings, 
  ShieldCheck,
  Bell,
  ChevronRight,
  Search,
  CheckCircle2,
  X,
  ArrowRight,
  Sparkles
} from "@/lib/icons";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, path: "/admin" },
    { name: "Products", icon: ShoppingBag, path: "/admin/products" },
    { name: "Categories", icon: Layers, path: "/admin/categories" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  const quickActions = useMemo(() => [
    { label: "Go to Dashboard", path: "/admin" },
    { label: "Open Products", path: "/admin/products" },
    { label: "Open Categories", path: "/admin/categories" },
    { label: "Open Settings", path: "/admin/settings" },
    { label: "New Product", path: "/admin/products?new=1" },
    { label: "New Category", path: "/admin/categories?new=1" },
  ], []);

  const pathParts = pathname.split("/").filter(Boolean);
  const breadcrumbs = pathParts.map((part, index) => ({
    name: part.charAt(0).toUpperCase() + part.slice(1),
    path: "/" + pathParts.slice(0, index + 1).join("/")
  }));

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const active = document.activeElement?.tagName;
        if (active !== "INPUT" && active !== "TEXTAREA" && active !== "SELECT") {
          e.preventDefault();
          searchRef.current?.focus();
        }
      }
      if (e.key === "Escape") {
        setCommandOpen(false);
        setNotificationsOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-blue-100 selection:text-blue-900">
      <aside className="w-[300px] bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] text-white flex flex-col p-6 sticky top-0 h-screen border-r border-white/5 shadow-2xl shadow-slate-950/20">
        <div className="flex items-center gap-4 mb-10 px-2">
          <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-600/30 ring-4 ring-violet-600/10"><ShieldCheck className="w-7 h-7" /></div>
          <div><h1 className="text-xl font-black tracking-tight leading-none uppercase">Admin</h1><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">Shop Ecosystem</p></div>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.name} href={item.path} className={`flex items-center gap-3.5 px-5 py-4 rounded-[18px] transition-all duration-300 group relative ${isActive ? "bg-violet-600 text-white shadow-2xl shadow-violet-600/30 ring-1 ring-violet-400/30" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
                <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "" : "group-hover:scale-110 opacity-70 group-hover:opacity-100"}`} />
                <span className="text-sm font-bold tracking-tight">{item.name}</span>
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-r-full" />}
              </Link>
            );
          })}
        </nav>

        <div className="pt-8 border-t border-white/10 space-y-5">
          <div className="px-5 py-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">System Status</p>
            <div className="flex items-center gap-2 mt-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /><span className="text-xs font-bold text-slate-300">Operations Normal</span></div>
          </div>
          <button onClick={async () => { try { await fetch("/api/auth/logout", { method: "POST" }); } finally { router.push("/"); } }} className="w-full flex items-center gap-3.5 px-5 py-4 text-red-400 hover:bg-red-400/10 rounded-2xl transition-all font-bold text-sm"><LogOut className="w-5 h-5 opacity-70" />Sign Out Account</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white/95 backdrop-blur border-b border-slate-100 flex items-center justify-between px-8 lg:px-10 sticky top-0 z-[60] shadow-sm">
          <div className="flex items-center gap-2">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.path}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
                <Link href={crumb.path} className={`text-xs font-bold transition-colors ${idx === breadcrumbs.length - 1 ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}>{crumb.name}</Link>
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-blue-500" />
              <input ref={searchRef} id="admin-global-search" type="text" placeholder="Global search..." className="pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 w-56 transition-all focus:w-72 outline-none" />
            </div>

            <button onClick={() => setCommandOpen(true)} className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">
              <Sparkles className="w-4 h-4" /> Cmd K
            </button>

            <div className="relative">
              <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-all relative">
                <Bell className="w-5 h-5" /><span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-white border border-slate-100 rounded-[32px] shadow-2xl shadow-slate-900/10 p-6 z-[70] animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex justify-between items-center mb-6"><h4 className="text-sm font-black text-slate-900 tracking-tight">Recent Alerts</h4><button onClick={() => setNotificationsOpen(false)} className="text-slate-400 hover:text-slate-900"><X className="w-4 h-4" /></button></div>
                  <div className="space-y-4">
                    {[
                      { title: "Inventory Alert", msg: "MacBook Pro is low on stock", time: "2m ago", icon: ShoppingBag, color: "text-orange-500 bg-orange-50" },
                      { title: "System Success", msg: "Payment database synchronized", time: "1h ago", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50" }
                    ].map((notif, i) => (
                      <div key={i} className="flex gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group"><div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.color}`}><notif.icon className="w-5 h-5" /></div><div className="min-w-0"><p className="text-xs font-black text-slate-900 group-hover:text-violet-600 transition-colors">{notif.title}</p><p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{notif.msg}</p><p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-2">{notif.time}</p></div></div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin</p><p className="text-xs font-black text-slate-900 tracking-tight">Haroon Shahid</p></div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 p-[2px] shadow-lg"><div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center overflow-hidden"><div className="w-full h-full bg-slate-100" /></div></div>
            </div>
          </div>
        </header>

        <div className="p-8 lg:p-10 flex-1 overflow-y-auto">{children}</div>
      </main>

      {commandOpen && (
        <div className="fixed inset-0 z-[130] flex items-start justify-center pt-24 px-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setCommandOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3 text-slate-400"><Sparkles className="w-4 h-4" /><span className="text-xs font-black uppercase tracking-widest">Quick Actions</span></div>
            <div className="p-3 space-y-2">
              {quickActions.map((action) => (
                <button key={action.label} onClick={() => { router.push(action.path); setCommandOpen(false); }} className="w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-slate-50 transition-colors text-left">
                  <span className="text-sm font-bold text-slate-900">{action.label}</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
