"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Search,
  Image as ImageIcon,
  Edit,
  ShoppingBag,
  Package,
  TrendingUp,
  X,
  Upload,
  ChevronDown,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  Archive,
  Layers,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Save,
} from "@/lib/icons";
import {
  getAdminProducts,
  removeAdminProduct,
  addAdminProduct,
  updateAdminProduct,
  getAdminCategories,
  bulkDeleteProducts,
  bulkUpdateStatus,
  getAdminStats,
  Product,
  Category,
} from "@/lib/adminStore";

const DRAFT_KEY = "admin_products_draft";

const emptyForm = {
  name: "",
  price: "",
  category: "",
  description: "",
  stock: "0",
  image: "/file.svg",
  variations: "",
};

type Toast = { tone: "success" | "info" | "error"; text: string } | null;

export default function AdminProducts() {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [products, setProducts] = useState<Product[]>(() => getAdminProducts());
  const [categories, setCategories] = useState<Category[]>(() => getAdminCategories());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState(emptyForm);
  const [toast, setToast] = useState<Toast>(null);
  const [quickDraftSaved, setQuickDraftSaved] = useState(false);
  const itemsPerPage = 8;

  const stats = getAdminStats([]);

  const notify = useCallback((tone: NonNullable<Toast>["tone"], text: string) => {
    setToast({ tone, text });
    window.clearTimeout((window as any).__adminToastTimer);
    (window as any).__adminToastTimer = window.setTimeout(() => setToast(null), 2400);
  }, []);

  const refreshData = useCallback(() => {
    setProducts(getAdminProducts());
    setCategories(getAdminCategories());
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (stored) {
      try {
        setFormData({ ...emptyForm, ...JSON.parse(stored) });
        setQuickDraftSaved(true);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    const openNew = new URLSearchParams(window.location.search).get("new");
    if (openNew === "1") {
      setEditingId(null);
      setFormData(emptyForm);
      setIsDrawerOpen(true);
      notify("info", "New product drawer opened");
    }
  }, [notify]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key.toLowerCase() === "n" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const active = document.activeElement?.tagName;
        if (active !== "INPUT" && active !== "TEXTAREA" && active !== "SELECT") {
          e.preventDefault();
          openCreate();
        }
      }
      if (e.key === "Escape") {
        setIsDrawerOpen(false);
        setInlineEditId(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (quickDraftSaved) {
      const t = window.setTimeout(() => setQuickDraftSaved(false), 1800);
      return () => window.clearTimeout(t);
    }
  }, [quickDraftSaved]);

  const filteredProducts = useMemo(() => {
    const result = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (categoryFilter === "all" || p.category === categoryFilter)
    );

    if (sortConfig) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA! < valB!) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA! > valB!) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [products, searchQuery, categoryFilter, sortConfig]);

  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const previewProduct = useMemo(
    () => products.find((p) => p.id === previewId) || filteredProducts[0] || products[0],
    [previewId, products, filteredProducts]
  );

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === previewId),
    [previewId, products]
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === paginatedProducts.length ? [] : paginatedProducts.map((p) => p.id));
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.length} products?`)) {
      bulkDeleteProducts(selectedIds);
      setSelectedIds([]);
      refreshData();
      notify("success", "Bulk delete completed");
    }
  };

  const handleBulkStatus = (status: Product["status"]) => {
    bulkUpdateStatus(selectedIds, status);
    refreshData();
    notify("success", `Updated ${selectedIds.length} products`);
  };

  const handleRemove = (id: string) => {
    if (confirm("Delete this product?")) {
      removeAdminProduct(id);
      refreshData();
      notify("success", "Product deleted");
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setIsDrawerOpen(true);
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: String(product.price),
      category: product.category,
      description: product.description || "",
      stock: String(product.stock),
      image: product.image || "/file.svg",
      variations: Array.isArray(product.variations) ? product.variations.join(", ") : "",
    });
    setIsDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      variations: formData.variations.split(",").map((v) => v.trim()).filter(Boolean),
    };

    if (editingId) updateAdminProduct(editingId, payload);
    else addAdminProduct(payload);

    refreshData();
    setIsDrawerOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
    notify("success", editingId ? "Product updated" : "Product added");
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const inlineSave = (product: Product, patch: Partial<Product>) => {
    updateAdminProduct(product.id, patch);
    refreshData();
    setInlineEditId(null);
    notify("success", "Quick edit saved");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {toast && (
        <div className={`fixed top-6 right-6 z-[120] px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur bg-white/95 ${toast.tone === "error" ? "border-red-200 text-red-700" : toast.tone === "info" ? "border-blue-200 text-blue-700" : "border-emerald-200 text-emerald-700"}`}>
          <div className="flex items-center gap-2 text-sm font-bold">
            <CheckCircle2 className="w-4 h-4" />
            {toast.text}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Inventory", val: stats.totalProducts, icon: Package, color: "bg-blue-500", sub: "Live items" },
          { label: "Out of Stock", val: stats.outOfStockCount, icon: AlertCircle, color: "bg-red-500", sub: "Needs attention" },
          { label: "Stock Value", val: `$${stats.totalInventoryValue.toLocaleString()}`, icon: TrendingUp, color: "bg-emerald-500", sub: "Asset valuation" },
          { label: "Avg. Stock", val: Math.round(products.reduce((s, p) => s + p.stock, 0) / (products.length || 1)), icon: Layers, color: "bg-indigo-500", sub: "Per product" },
        ].map((w, i) => (
          <div key={i} className="bg-white border border-slate-100 p-5 rounded-[32px] shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${w.color} text-white rounded-2xl flex items-center justify-center shadow-lg shadow-current/20`}>
              <w.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{w.label}</p>
              <h4 className="text-xl font-black text-slate-900 leading-none mt-1">{w.val}</h4>
              <p className="text-[9px] font-bold text-slate-300 mt-1">{w.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search by product name..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              className="pl-11 pr-10 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold appearance-none outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full xl:w-auto border-t xl:border-t-0 pt-4 xl:pt-0">
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 animate-in slide-in-from-right-2 flex-wrap">
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-2 rounded-xl border border-blue-100">{selectedIds.length} Selected</span>
              <button onClick={handleBulkDelete} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-5 h-5" /></button>
              <button onClick={() => handleBulkStatus("active")} className="px-3 py-2 text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 rounded-xl">Activate</button>
              <button onClick={() => handleBulkStatus("out_of_stock")} className="px-3 py-2 text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 rounded-xl">Mark OOS</button>
              <div className="w-px h-6 bg-slate-200 mx-2" />
            </div>
          )}
          <button onClick={openCreate} className="flex-1 xl:flex-none px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-slate-900/10">
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="bg-white border border-slate-100 rounded-[40px] shadow-xl shadow-slate-900/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-5 w-10">
                    <input type="checkbox" className="w-5 h-5 rounded-lg accent-blue-600 cursor-pointer" checked={selectedIds.length > 0 && selectedIds.length === paginatedProducts.length} onChange={toggleSelectAll} />
                  </th>
                  <th className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <button className="flex items-center gap-2" onClick={() => setSortConfig({ key: "name", direction: sortConfig?.direction === "asc" ? "desc" : "asc" })}>Product <ArrowUpDown className="w-3 h-3" /></button>
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <button className="flex items-center gap-2" onClick={() => setSortConfig({ key: "stock", direction: sortConfig?.direction === "asc" ? "desc" : "asc" })}>Inventory <ArrowUpDown className="w-3 h-3" /></button>
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <button className="flex items-center gap-2" onClick={() => setSortConfig({ key: "price", direction: sortConfig?.direction === "asc" ? "desc" : "asc" })}>Price <ArrowUpDown className="w-3 h-3" /></button>
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedProducts.map((product) => {
                  const isInline = inlineEditId === product.id;
                  return (
                    <tr key={product.id} className={`group transition-all duration-300 ${selectedIds.includes(product.id) ? "bg-blue-50/30" : "hover:bg-slate-50/50"}`}>
                      <td className="px-8 py-6">
                        <input type="checkbox" className="w-5 h-5 rounded-lg accent-blue-600 cursor-pointer" checked={selectedIds.includes(product.id)} onChange={() => toggleSelect(product.id)} />
                      </td>
                      <td className="px-4 py-6">
                        {isInline ? (
                          <input className="w-full px-3 py-2 bg-slate-50 rounded-xl text-sm font-bold outline-none" defaultValue={product.name} onBlur={(e) => inlineSave(product, { name: e.target.value })} />
                        ) : (
                          <button onClick={() => setPreviewId(product.id)} className="flex items-center gap-4 text-left">
                            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 group-hover:scale-105 transition-transform relative overflow-hidden">
                              {product.image ? <img src={product.image} className="w-full h-full object-cover" alt="" /> : <ImageIcon className="w-6 h-6" />}
                            </div>
                            <div className="max-w-[200px]">
                              <h4 className="text-sm font-black text-slate-900 truncate leading-none">{product.name}</h4>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SKU-{product.id.slice(-4)}</span>
                                {product.variations && product.variations.length > 0 && <span className="px-1.5 py-0.5 bg-slate-900 text-white rounded text-[8px] font-black uppercase">{product.variations.length} Variants</span>}
                              </div>
                            </div>
                          </button>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        {isInline ? (
                          <select className="w-full px-3 py-2 bg-slate-50 rounded-xl text-sm font-bold outline-none" defaultValue={product.category} onChange={(e) => inlineSave(product, { category: e.target.value })}>
                            {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                          </select>
                        ) : (
                          <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest">{product.category}</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        {isInline ? (
                          <input type="number" className="w-24 px-3 py-2 bg-slate-50 rounded-xl text-sm font-bold outline-none" defaultValue={product.stock} onBlur={(e) => inlineSave(product, { stock: parseInt(e.target.value) || 0 })} />
                        ) : (
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between w-24"><span className={`text-[10px] font-black uppercase ${product.stock <= 5 ? "text-red-500" : "text-slate-400"}`}>{product.stock <= 0 ? "Out of Stock" : `${product.stock} Units`}</span></div>
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full transition-all duration-1000 ${product.stock <= 5 ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }} /></div>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        {isInline ? (
                          <input type="number" step="0.01" className="w-24 px-3 py-2 bg-slate-50 rounded-xl text-sm font-bold outline-none" defaultValue={product.price} onBlur={(e) => inlineSave(product, { price: parseFloat(e.target.value) || 0 })} />
                        ) : (
                          <span className="text-sm font-black text-slate-900">${product.price.toFixed(2)}</span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right space-x-2">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setInlineEditId(isInline ? null : product.id)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-xl border border-slate-100"><Sparkles className="w-4 h-4" /></button>
                          <button onClick={() => startEdit(product)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-xl border border-slate-100"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleRemove(product.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all rounded-xl border border-slate-100"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} Results</p>
            <div className="flex items-center gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm"><ArrowLeft className="w-4 h-4" /></button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-2xl text-xs font-black transition-all ${currentPage === i + 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-white text-slate-400 hover:bg-slate-50"}`}>{i + 1}</button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm"><ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        <aside className="sticky top-24 space-y-4">
          <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-900">Preview</h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live</span>
            </div>
            {previewProduct ? (
              <div className="space-y-4">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-50 border border-slate-100">
                  <img src={previewProduct.image || "/file.svg"} alt={previewProduct.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900">{previewProduct.name}</h4>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-3">{previewProduct.description || "No description yet."}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black uppercase tracking-widest">{previewProduct.category}</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest">${previewProduct.price.toFixed(2)}</span>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest">Stock {previewProduct.stock}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400">Select a product to preview it here.</p>
            )}
          </div>

          <div className="bg-slate-900 text-white rounded-[32px] p-6 shadow-2xl shadow-slate-900/15">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3"><Sparkles className="w-4 h-4 text-blue-400" /> Quick tips</div>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 mt-0.5 text-blue-400" /> Press <b>N</b> for a new product.</li>
              <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 mt-0.5 text-blue-400" /> Press <b>Cmd/Ctrl+K</b> to focus search.</li>
              <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 mt-0.5 text-blue-400" /> Inline edit is one click away.</li>
            </ul>
          </div>
        </aside>
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          <div className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm pointer-events-auto" onClick={closeDrawer} />
          <form onSubmit={handleSubmit} className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl pointer-events-auto animate-in slide-in-from-right-2 duration-300 overflow-y-auto">
            <div className="p-8 lg:p-10 space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{editingId ? "Update Item" : "New Listing"}</h3>
                  <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest text-[10px]">Product Identity & Logistics</p>
                  {quickDraftSaved && <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mt-2">Draft restored</p>}
                </div>
                <button type="button" onClick={closeDrawer} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer group relative overflow-hidden">
                    <Upload className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Image Asset</span>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Image URL</label>
                    <input type="text" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Variations (Tags)</label>
                    <input type="text" placeholder="Red, Blue, XL..." className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" value={formData.variations} onChange={(e) => setFormData({ ...formData, variations: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Product Name</label>
                    <input type="text" required className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Price ($)</label>
                      <input type="number" step="0.01" required className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">In Stock</label>
                      <input type="number" required className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Category</label>
                    <select className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                      <option value="">Select Category</option>
                      {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Description</label>
                    <textarea rows={5} className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex gap-4">
                <button type="button" onClick={closeDrawer} className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-colors">Discard</button>
                <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2"><Save className="w-4 h-4" />{editingId ? "Update Ledger" : "Commit Listing"}</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
