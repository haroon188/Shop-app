"use client";

import React, { useEffect, useState } from "react";
import { 
  Save, 
  Store, 
  Globe, 
  Bell, 
  ShieldCheck, 
  CreditCard,
  Mail,
  Smartphone,
  CheckCircle2,
  Info,
  Settings
} from "@/lib/icons";

export default function AdminSettings() {
  const [isSaved, setIsSaved] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [config, setConfig] = useState({
    storeName: "Shop Global",
    contactEmail: "admin@shop.com",
    currency: "USD",
    taxRate: "8",
    paypalMode: "sandbox",
    notifications: true
  });

  useEffect(() => {
    const stored = localStorage.getItem("admin_settings");
    if (stored) {
      try {
        setConfig(JSON.parse(stored));
        setIsDraftSaved(true);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("admin_settings_draft", JSON.stringify(config));
  }, [config]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("admin_settings", JSON.stringify(config));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20">
      
      {/* Header Info */}
      <div className="bg-[linear-gradient(135deg,#2563eb_0%,#4f46e5_100%)] rounded-[36px] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-600/30">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20">
               <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
               <h3 className="text-xl font-black tracking-tight text-white">System Configuration</h3>
               <p className="text-blue-100 text-sm font-medium mt-1">Manage your store identity and global preferences.</p>
               {isDraftSaved && <p className="text-[10px] font-black uppercase tracking-widest text-blue-100 mt-2">Draft restored</p>}
            </div>
         </div>
         {isSaved && (
           <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 rounded-2xl animate-in zoom-in-95">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Changes Saved</span>
           </div>
         )}
      </div>

      <form onSubmit={handleSave} className="grid gap-8">
        
        {/* --- GENERAL SETTINGS --- */}
        <section className="bg-white border border-slate-100 p-8 rounded-[36px] shadow-xl shadow-slate-900/[0.02] space-y-8">
           <div className="flex items-center gap-3 pb-6 border-b border-slate-50">
              <Store className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-black text-slate-900 tracking-tight">General Storefront</h3>
           </div>
           
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Store Name</label>
                 <div className="relative">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="text" 
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                      value={config.storeName}
                      onChange={e => setConfig({...config, storeName: e.target.value})}
                    />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Email</label>
                 <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="email" 
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                      value={config.contactEmail}
                      onChange={e => setConfig({...config, contactEmail: e.target.value})}
                    />
                 </div>
              </div>
           </div>
        </section>

        {/* --- REGIONAL SETTINGS --- */}
        <section className="bg-white border border-slate-100 p-8 rounded-[36px] shadow-xl shadow-slate-900/[0.02] space-y-8">
           <div className="flex items-center gap-3 pb-6 border-b border-slate-50">
              <Globe className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Regional & Currency</h3>
           </div>
           
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Base Currency</label>
                 <select 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none appearance-none"
                    value={config.currency}
                    onChange={e => setConfig({...config, currency: e.target.value})}
                 >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Default Tax Rate (%)</label>
                 <input 
                   type="number" 
                   className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none"
                   value={config.taxRate}
                   onChange={e => setConfig({...config, taxRate: e.target.value})}
                 />
              </div>
           </div>
        </section>

        {/* --- PAYMENTS & SECURITY --- */}
        <section className="bg-white border border-slate-100 p-8 rounded-[36px] shadow-xl shadow-slate-900/[0.02] space-y-8 border-l-4 border-l-blue-500">
           <div className="flex justify-between items-center pb-6 border-b border-slate-50">
              <div className="flex items-center gap-3">
                 <CreditCard className="w-5 h-5 text-blue-600" />
                 <h3 className="text-lg font-black text-slate-900 tracking-tight">Payment Gateways</h3>
              </div>
              <div className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                 Demo Checkout Active
              </div>
           </div>
           
           <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
              <div className="flex items-start gap-4">
                 <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-slate-900 leading-none">Checkout Mode</h4>
                    <p className="text-xs text-slate-400 font-medium mt-1.5 leading-relaxed">
                       Currently set to sandbox or production labels for demo presentation.
                    </p>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                 <button 
                   type="button" 
                   onClick={() => setConfig({...config, paypalMode: 'sandbox'})}
                   className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${config.paypalMode === 'sandbox' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white text-slate-400'}`}
                 >
                   Demo
                 </button>
                 <button 
                   type="button"
                   onClick={() => setConfig({...config, paypalMode: 'live'})}
                   className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${config.paypalMode === 'live' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-white text-slate-400'}`}
                 >
                   Live Demo
                 </button>
              </div>
           </div>
        </section>

        {/* Action Bar */}
        <div className="flex items-center justify-between p-8 bg-white border border-slate-100 rounded-[36px] shadow-2xl shadow-slate-900/10">
           <div className="flex items-center gap-3 text-slate-400">
              <Info className="w-5 h-5" />
              <p className="text-xs font-bold">Certain changes may require a system restart.</p>
           </div>
           <button 
             type="submit" 
             className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/40 hover:bg-blue-700 hover:-translate-y-1 transition-all active:translate-y-0 flex items-center gap-3"
           >
             <Save className="w-5 h-5" />
             Save Configurations
           </button>
        </div>

      </form>
    </div>
  );
}
