'use client';

import Link from 'next/link';
import { ShieldCheck, Mail, Phone, MapPin, Sparkles, MessageSquare, Globe, Award } from '@/lib/icons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter uppercase">Shop</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-slate-500">
              Revolutionizing e-commerce with neural-driven personalization. Discover products curated specifically for your lifestyle.
            </p>
            <div className="flex items-center gap-4 text-slate-500">
              <Link href="/twitter" className="hover:text-white transition-colors" title="Twitter"><Globe className="w-5 h-5" /></Link>
              <Link href="/instagram" className="hover:text-white transition-colors" title="Instagram"><Award className="w-5 h-5" /></Link>
              <Link href="/linkedin" className="hover:text-white transition-colors" title="LinkedIn"><MessageSquare className="w-5 h-5" /></Link>
            </div>
          </div>

          <div className="space-y-5">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Shop Catalog</h4>
            <ul className="space-y-3 text-sm font-bold">
              <li><Link href="/products" className="hover:text-indigo-400 transition-colors">All Products</Link></li>
              <li><Link href="/categories" className="hover:text-indigo-400 transition-colors">Categories</Link></li>
              <li><Link href="/products?q=new" className="hover:text-indigo-400 transition-colors">New Arrivals</Link></li>
              <li><Link href="/products?sortBy=rating" className="hover:text-indigo-400 transition-colors">Trending Now</Link></li>
            </ul>
          </div>

          <div className="space-y-5">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Customer Care</h4>
            <ul className="space-y-3 text-sm font-bold">
              <li><Link href="/shipping-policy" className="hover:text-indigo-400 transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns-refunds" className="hover:text-indigo-400 transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="space-y-5">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-indigo-500" />
                <span className="font-bold">support@shop.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-indigo-500" />
                <span className="font-bold">+1 (555) 000-SHOP</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-indigo-500" />
                <span className="font-bold leading-tight">123 Neural Way, Silicon Valley, CA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
            © {currentYear} Shop Interactive. All rights reserved. Built with Neural Intelligence.
          </p>
          <div className="flex items-center gap-6 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">PCI-DSS Compliant</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex gap-3">
              <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center text-[8px] font-black italic">VISA</div>
              <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center text-[8px] font-black italic">PAYPAL</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
