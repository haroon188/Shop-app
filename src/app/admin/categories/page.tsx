"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  Layers,
  Search,
  Edit,
  TrendingUp,
  X,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Package,
  Tag,
  CheckCircle2,
  Sparkles,
  Save,
} from "@/lib/icons";
import {
  getAdminCategories,
  addAdminCategory,
  updateAdminCategory,
  removeAdminCategory,
  bulkDeleteCategories,
  getAdminProducts,
  Category,
  Product as AdminProduct,
} from "@/lib/adminStore";

const DRAFT_KEY = "admin_categories_draft";

type Toast = { tone: "success" | "info" | "error"; text: string } | null;

export default function AdminCategories() {
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [categories, setCategories] = useState<Category[]>(() => getAdminCategories());
  const [products, setProducts] = useState<AdminProduct[]>(() => getAdminProducts());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<Toast>(null);
  const [draftRestored, setDraftRestored] = useState(false);
  const itemsPerPage = 6;

  const [formData, setFormData] = useState({ name: "", description: "", status: "active" as "active" | "archived" });

  const notify = useCallback((tone: NonNullable<Toast>["tone"], text: string) => {
    setToast({ tone, text });
    window.clearTimeout((window as any).__adminCatToastTimer);
    (window as any).__adminCatToastTimer = window.setTimeout(() => setToast(null), 2400);
  }, []);

  const refreshData = useCallback(() => {
    setCategories(getAdminCategories());
    setProducts(getAdminProducts());
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (stored) {
      try {
        setFormData({ ...formData, ...JSON.parse(stored) });
        setDraftRestored(true);
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
      setFormData({ name: "", description: "", status: "active" });
      setIsDrawerOpen(true);
      notify("info", "New category drawer opened");
    }
  }, [notify]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsDrawerOpen(false);
        setInlineEditId(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const getProductCount = (catId: string) => products.filter((p) => p.category.toLowerCase() === catId.toLowerCase() || p.category === categories.find((c) => c.id === catId)?.name).length;

  const filteredCategories = useMemo(() => categories.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.description?.toLowerCase().includes(searchQuery.toLowerCase())), [categories, searchQuery]);
  const paginatedCategories = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / itemsPerPage));

  const handleRemove = (id: string) => {
    if (confirm("Delete this category? Products in this category will remain but may become unorganized.")) {
      removeAdminCategory(id);
      refreshData();
      notify("success", "Category deleted");
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.length} categories?`)) {
      bulkDeleteCategories(selectedIds);
      setSelectedIds([]);
      refreshData();
      notify("success", "Bulk delete completed");
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name, description: cat.description || "", status: cat.status });
    setIsDrawerOpen(true);
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", status: "active" });
    setIsDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) updateAdminCategory(editingId, formData);
    else addAdminCategory(formData.name, formData.description);
    refreshData();
    setIsDrawerOpen(false);
    setEditingId(null);
    notify("success", editingId ? "Category updated" : "Category created");
  };

  const inlineSave = (cat: Category, patch: Partial<Category>) => {
    updateAdminCategory(cat.id, patch);
    refreshData();
    setInlineEditId(null);
    notify("success", "Quick edit saved");
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {toast && <div className={`fixed top-6 right-6 z-[120] px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur bg-white/95 ${toast.tone === "error" ? "border-red-200 text-red-700" : toast.tone === "info" ? "border-blue-200 text-blue-700" : "border-emerald-200 text-emerald-700"}`}><div className="flex items-center gap-2 text-sm font-bold"><CheckCircle2 className="w-4 h-4" />{toast.text}</div></div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20"><Layers className="w-7 h-7" /></div>
          <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Categories</p><h4 className="text-2xl font-black text-slate-900 mt-1">{categories.length}</h4></div>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20"><Package className="w-7 h-7" /></div>
          <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Categorized Items</p><h4 className="text-2xl font-black text-slate-900 mt-1">{products.length}</h4></div>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20"><TrendingUp className="w-7 h-7" /></div>
          <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Top Category</p><h4 className="text-2xl font-black text-slate-900 mt-1">Electronics</h4></div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input ref={searchRef} type="text" placeholder="Search categories by name or description..." className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

        <div className="flex items-center gap-3 w-full xl:w-auto">
          {selectedIds.length > 0 && <><span className="text-xs font-black text-blue-600 bg-blue-50 px-4 py-3 rounded-xl border border-blue-100">{selectedIds.length} Selected</span><button onClick={handleBulkDelete} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-5 h-5" /></button><div className="w-px h-6 bg-slate-200 mx-2" /></>}
          <button onClick={openCreate} className="flex-1 xl:flex-none px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-blue-600/20"><Plus className="w-5 h-5" />Create New Category</button>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="bg-white border border-slate-100 rounded-[40px] shadow-xl shadow-slate-900/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-5 w-10"><input type="checkbox" className="w-5 h-5 rounded-lg accent-blue-600 cursor-pointer" checked={selectedIds.length > 0 && selectedIds.length === paginatedCategories.length} onChange={() => setSelectedIds(selectedIds.length === paginatedCategories.length ? [] : paginatedCategories.map((c) => c.id))} /></th>
                  <th className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category Info</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Products</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedCategories.map((cat) => {
                  const isInline = inlineEditId === cat.id;
                  return (
                    <tr key={cat.id} className={`group transition-all duration-300 ${selectedIds.includes(cat.id) ? "bg-blue-50/30" : "hover:bg-slate-50/50"}`}>
                      <td className="px-8 py-6"><input type="checkbox" className="w-5 h-5 rounded-lg accent-blue-600 cursor-pointer" checked={selectedIds.includes(cat.id)} onChange={() => setSelectedIds((prev) => prev.includes(cat.id) ? prev.filter((i) => i !== cat.id) : [...prev, cat.id])} /></td>
                      <td className="px-4 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors"><Tag className="w-5 h-5" /></div>
                          <div className="min-w-[220px]">
                            {isInline ? <input className="w-full px-3 py-2 bg-slate-50 rounded-xl text-sm font-black outline-none" defaultValue={cat.name} onBlur={(e) => inlineSave(cat, { name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, "-") })} /> : <h4 className="text-sm font-black text-slate-900 leading-none">{cat.name}</h4>}
                            <p className="text-[10px] text-slate-400 font-medium mt-2 max-w-[200px] truncate">{cat.description || "No description provided."}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center"><span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm border border-slate-200/50">{getProductCount(cat.id)} items</span></td>
                      <td className="px-8 py-6">
                        {isInline ? (
                          <select className="px-3 py-2 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none" defaultValue={cat.status} onChange={(e) => inlineSave(cat, { status: e.target.value as Category["status"] })}>
                            <option value="active">active</option>
                            <option value="archived">archived</option>
                          </select>
                        ) : (
                          <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${cat.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} /><span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{cat.status}</span></div>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right space-x-2">
                        <button onClick={() => setInlineEditId(isInline ? null : cat.id)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-xl border border-slate-100"><Sparkles className="w-4 h-4" /></button>
                        <button onClick={() => startEdit(cat)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-xl border border-slate-100"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleRemove(cat.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all rounded-xl border border-slate-100"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Showing {Math.min(filteredCategories.length, itemsPerPage)} of {filteredCategories.length} Categories</p>
            <div className="flex items-center gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm"><ArrowLeft className="w-4 h-4" /></button>
              {[...Array(totalPages)].map((_, i) => <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-2xl text-xs font-black transition-all ${currentPage === i + 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-white text-slate-400 hover:bg-slate-50"}`}>{i + 1}</button>)}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm"><ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        <aside className="sticky top-24 space-y-4">
          <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-black text-slate-900">Category Preview</h3><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live</span></div>
            {paginatedCategories[0] ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center h-40 rounded-3xl bg-slate-50 border border-slate-100"><Tag className="w-12 h-12 text-blue-500 opacity-40" /></div>
                <h4 className="text-lg font-black text-slate-900">{paginatedCategories[0].name}</h4>
                <p className="text-sm text-slate-500">{paginatedCategories[0].description || "No description yet."}</p>
              </div>
            ) : <p className="text-sm text-slate-400">Select a category to preview it here.</p>}
          </div>

          <div className="bg-slate-900 text-white rounded-[32px] p-6 shadow-2xl shadow-slate-900/15">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3"><Sparkles className="w-4 h-4 text-blue-400" /> Quick tips</div>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 mt-0.5 text-blue-400" /> Press <b>Cmd/Ctrl+K</b> to focus search.</li>
              <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 mt-0.5 text-blue-400" /> Click the wand for inline edits.</li>
              <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 mt-0.5 text-blue-400" /> Drafts restore automatically.</li>
            </ul>
          </div>
        </aside>
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          <div className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm pointer-events-auto" onClick={() => setIsDrawerOpen(false)} />
          <form onSubmit={handleSubmit} className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl pointer-events-auto animate-in slide-in-from-right-2 duration-300 overflow-y-auto">
            <div className="p-8 lg:p-10 space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{editingId ? "Update Category" : "New Category"}</h3>
                  <p className="text-slate-400 text-sm font-medium mt-1">Organize your product hierarchy</p>
                  {draftRestored && <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mt-2">Draft restored</p>}
                </div>
                <button type="button" onClick={() => setIsDrawerOpen(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Category Name</label>
                  <input type="text" required className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Description</label>
                  <textarea rows={5} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Visibility Status</label>
                  <div className="flex gap-2">
                    {(["active", "archived"] as const).map((s) => <button key={s} type="button" onClick={() => setFormData({ ...formData, status: s })} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === s ? "bg-slate-900 text-white shadow-lg" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}>{s}</button>)}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex gap-4">
                <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-colors">Discard</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"><Save className="w-4 h-4" />{editingId ? "Update Registry" : "Commit Category"}</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
