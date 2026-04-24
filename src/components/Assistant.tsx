'use client';

import React, { useState, useMemo } from 'react';
import { MessageSquare, Sparkles, X, Send, Package } from '@/lib/icons';
import { usePathname, useParams } from 'next/navigation';
import { products } from '@/data/products';
import type { Product } from '@/types';

export default function Assistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const pathname = usePathname();
  const params = useParams();

  const contextProduct = useMemo<Product | null>(() => {
    if (!pathname.startsWith('/product/')) return null;
    const productId = params.id;
    if (typeof productId !== 'string') return null;
    return products.find(p => p.id === productId) ?? null;
  }, [pathname, params]);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
      >
        {isOpen ? <X className="w-6 h-6" /> : (
          <div className="relative">
            <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-slate-900" />
          </div>
        )}
        <div className="absolute right-20 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
          {contextProduct ? `Ask about ${contextProduct.name}` : 'Ask Neural Assistant'}
        </div>
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 z-[100] w-[380px] h-[550px] bg-white border border-slate-100 rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          {/* Header */}
          <div className="p-8 bg-slate-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight leading-none">Neural Bot</h3>
                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Assistant Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 space-y-6">
            {contextProduct && (
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl mb-2">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Package className="w-3 h-3" />
                  Context: {contextProduct.name}
                </p>
                <p className="text-[11px] text-indigo-900 font-medium leading-relaxed">
                  I can see you’re looking at the {contextProduct.name}. 
                  Ask me anything about its features, sizing, or stock!
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-tl-none shadow-sm max-w-[80%]">
                <p className="text-xs font-bold text-slate-900 leading-relaxed">
                  {contextProduct 
                    ? `Hi there! Looking for more details on the ${contextProduct.name}?` 
                    : "Welcome to Shop! I’m your Neural Personalization assistant. Ask me anything!"}
                </p>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-slate-100">
            <div className="relative group">
              <input
                type="text"
                placeholder="Message assistant..."
                className="w-full pl-5 pr-14 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-black transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest mt-4">
              Insights may vary • experimental beta v1.0
            </p>
          </div>
        </div>
      )}
    </>
  );
}
