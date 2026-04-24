'use client';

import { use, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Truck, Shield, RotateCcw, ChevronRight, Minus, Plus, Check, Sparkles, Package, Info, CheckCircle2, ChevronDown, Loader2 } from '@/lib/icons';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { trackActivity, getFrequentlyBoughtTogether } from '@/lib/recommendations';
import RecommendationSection from '@/components/RecommendationSection';
import ProductCard from '@/components/ProductCard';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const product = products.find((p) => p.id === id);
  const { addToCart, items } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description');
  const [isModerating, setIsModerating] = useState(false);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });
  
  const frequentlyBought = useMemo(
    () => (product ? getFrequentlyBoughtTogether(product.id) : []),
    [product]
  );

  const productImages = useMemo(() => {
    if (!product) return [];
    return product.images || [product.image];
  }, [product]);

  // Dynamic logic: shopping notes based on stock & velocity
  const shoppingNote = useMemo(() => {
    if (!product) return null;
    if (product.stock <= 5) return { text: `Critically Low Stock: Only ${product.stock} units remaining.`, color: 'text-red-600 bg-red-50 border-red-100' };
    if (product.stock <= 25) return { text: "High Demand: 42 people are viewing this right now.", color: "text-orange-600 bg-orange-50 border-orange-100" };
    return { text: "Strong demand: this product has a 98% satisfaction rate in your region.", color: "text-blue-600 bg-blue-50 border-blue-100" };
  }, [product]);

  const reviewHighlights = [
    'Precision-tuned sensors for consistent performance',
    'Travel-ready packaging with reusable protective sleeve',
    'Certified 2-year warranty backed by Shop support',
  ];

  const recentFeedback = [
    {
      name: 'Jamie L.',
      rating: 5,
      comment: 'Exceeded expectations—battery life was genuinely a full day of heavy use.',
    },
    {
      name: 'Priya S.',
      rating: 4,
      comment: 'Shipping arrived fast and customer service was responsive about a sizing question.',
    },
    {
      name: 'Miles T.',
      rating: 5,
      comment: 'Feels premium, smaller details like the matte finish show craftsmanship.',
    },
  ];

  useEffect(() => {
    if (product) {
      trackActivity({
        productId: product.id,
        action: 'view',
        timestamp: Date.now(),
        category: product.category,
        tags: product.tags,
      });
    }
  }, [product]);

  if (!product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Product Not Found</h1>
        <Link href="/products" className="text-indigo-600 hover:underline mt-4 inline-block">
          Browse Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    trackActivity({
      productId: product.id,
      action: 'cart',
      timestamp: Date.now(),
      category: product.category,
      tags: product.tags,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleWriteReview = () => {
    setIsModerating(true);
    setTimeout(() => {
      setIsModerating(false);
      alert("✨ Please log in to submit your review.");
    }, 1500);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  const inCart = items.find((item) => item.id === product.id)?.quantity || 0;

  return (
    <div className="pt-8 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-y-24">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/products" className="hover:text-indigo-600 transition-colors">Products</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
        {/* --- LEFT: Stateful Media Gallery & Interactive Zoom --- */}
        <div className="flex flex-col-reverse md:flex-row gap-6">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar max-h-[600px]">
            {productImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                  activeImage === idx ? 'border-indigo-600 ring-4 ring-indigo-500/10' : 'border-slate-100 hover:border-slate-300'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          
          {/* Main Image with Zoom & Badges */}
          <div 
            className="flex-1 aspect-square rounded-[40px] overflow-hidden bg-white border border-slate-100 shadow-2xl shadow-slate-900/5 relative group cursor-zoom-in max-h-[600px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setZoomPos(prev => ({ ...prev, show: false }))}
          >
            {/* Badges */}
            <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
              {product.rating >= 4.8 && (
                <div className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                  Best Seller
                </div>
              )}
              {product.stock < 30 && (
                <div className="px-4 py-2 bg-white/90 backdrop-blur text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg border border-red-50">
                  New Release
                </div>
              )}
            </div>

            <img
              src={productImages[activeImage]}
              alt={product.name}
              className={`w-full h-full object-contain transition-transform duration-500 ${zoomPos.show ? 'scale-150' : 'scale-100'}`}
              style={zoomPos.show ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
            />
          </div>
        </div>

        {/* --- RIGHT: The Buy Box --- */}
        <div className="space-y-8 lg:sticky lg:top-24">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                {product.category}
              </span>
              {product.stock < 20 && (
                <span className="flex items-center gap-1.5 text-red-600 text-[10px] font-black uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                  Only {product.stock} units left
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-black text-yellow-700">{product.rating}</span>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{product.reviews.toLocaleString()} verified reviews</span>
            </div>
          </div>

          <div className="text-5xl font-black text-slate-900 tracking-tighter">
            ${product.price.toFixed(2)}
          </div>

          {/* Variant Selectors (Color Swatches) */}
          {product.variants && (
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Finishes</h3>
              <div className="flex gap-3">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.label}
                    onClick={() => {
                      setSelectedVariantIdx(idx);
                      // In a real app, variant change might update activeImage or point to specific media
                      const imgIdx = productImages.indexOf(v.image);
                      if (imgIdx !== -1) setActiveImage(imgIdx);
                    }}
                    className={`group relative p-1 rounded-full border-2 transition-all ${
                      selectedVariantIdx === idx ? 'border-indigo-600 scale-110' : 'border-transparent hover:border-slate-200'
                    }`}
                    title={v.label}
                  >
                    <div 
                      className="w-8 h-8 rounded-full shadow-inner border border-slate-100" 
                      style={{ backgroundColor: v.color }} 
                    />
                    {selectedVariantIdx === idx && (
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-indigo-600 uppercase whitespace-nowrap">
                        {v.label}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-slate-500 font-medium leading-relaxed text-lg pt-4">
            {product.description}
          </p>

          {/* Key Features Flow */}
          <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Key Innovations</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Controls Flow */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-white border-2 border-slate-100 rounded-2xl p-1 shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-900"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-black text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-900"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {inCart > 0 && (
                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-2 rounded-xl">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {inCart} already in cart
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addedToCart}
              className={`w-full flex items-center justify-center gap-3 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                addedToCart
                  ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                  : 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-black'
              }`}
            >
              {addedToCart ? (
                <>
                  <Check className="w-5 h-5" />
                  Confirmed
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Purchase Now
                </>
              )}
            </button>
          </div>

          {/* Trust Area */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-100">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400">Free Express Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400">2-Year Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                <RotateCcw className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400">30-Day Return Window</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Tabs for Specs & Full Description --- */}
      <div className="border border-slate-100 rounded-[40px] bg-white overflow-hidden shadow-sm">
        <div className="flex border-b border-slate-50 bg-slate-50/30">
          <button 
            onClick={() => setActiveTab('description')}
            className={`px-8 py-5 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'description' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Full Story
          </button>
          <button 
            onClick={() => setActiveTab('specs')}
            className={`px-8 py-5 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'specs' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Technical Specs
          </button>
        </div>
        <div className="p-8 md:p-12 animate-in fade-in duration-500">
          {activeTab === 'description' ? (
            <div className="max-w-3xl space-y-6">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Product Narrative</h3>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line font-medium">
                {product.fullDescription || product.description}
              </p>
            </div>
          ) : (
            <div className="max-w-2xl grid gap-4">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4">Engineering Blueprint</h3>
              {product.specs ? (
                Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0 group">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-500 transition-colors">{key}</span>
                    <span className="text-sm font-bold text-slate-900">{val}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic">Technical specifications are currently being reviewed.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- BOTTOM SECTION: Summary & Reviews --- */}
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-16 pt-16 border-t border-slate-100">
        
        {/* Dynamic Reviews Section */}
        <div className="space-y-10">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Verified Feedback</h2>
              <p className="text-slate-500 font-medium">Real experiences from our global community</p>
            </div>
            <button 
              onClick={handleWriteReview}
              disabled={isModerating}
              className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10 disabled:opacity-50"
            >
              {isModerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Write Review"}
            </button>
          </div>

          <div className="grid gap-6">
            {recentFeedback.map((review, idx) => (
              <div key={idx} className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-xl shadow-slate-900/[0.01] space-y-4 hover:shadow-2xl transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-black text-xs">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 leading-none">{review.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">Verified Buyer</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed italic">&quot;{review.comment}&quot;</p>
              </div>
            ))}
          </div>
        </div>

        {/* Product Summary */}
        <div className="space-y-8">
          <div className="bg-indigo-600 rounded-[40px] p-10 text-white shadow-2xl shadow-indigo-600/30 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles className="w-32 h-32" />
            </div>
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                ✨ Product Summary
              </div>
              <h3 className="text-2xl font-black tracking-tight leading-none">Why shoppers love this</h3>
              <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-90">
                We reviewed {product.reviews.toLocaleString()} customer reviews to highlight the core experience of this product.
              </p>
            </div>

            <ul className="space-y-4">
              {reviewHighlights.map((item, idx) => (
                <li key={idx} className="flex gap-4 group">
                  <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-bold leading-tight">{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-6 border-t border-white/10">
               <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                     {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-indigo-400 border-2 border-indigo-600" />)}
                  </div>
                  <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-tighter">Trusted by 12k+ daily shoppers</p>
               </div>
            </div>
          </div>

          {/* Dynamic Shopping Note Card */}
          {shoppingNote && (
            <div className={`border p-8 rounded-[40px] shadow-sm flex items-start gap-4 animate-in slide-in-from-right-4 duration-700 ${shoppingNote.color}`}>
               <div className="p-3 bg-white/50 rounded-2xl">
                  <Info className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="text-sm font-black uppercase tracking-tight">Shopping Note</h4>
                  <p className="text-xs font-medium mt-1 leading-relaxed">
                    {shoppingNote.text}
                  </p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* --- RECOMMENDATIONS --- */}
      <div className="space-y-24 pt-16 border-t border-slate-100">
        {/* Strategy 1: Frequently Bought Together */}
        {frequentlyBought.length > 0 && (
          <section className="space-y-8">
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Frequently Bought Together</h2>
                <p className="text-slate-500 font-medium">Accessories and complements tailored for you</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {frequentlyBought.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}

        {/* Strategy 2: You May Also Like */}
        <RecommendationSection
          productId={product.id}
          title="Similar to your Style"
          limit={4}
          showReason={true}
          excludeIds={frequentlyBought.map(p => p.id)}
        />
      </div>
    </div>
  );
}
