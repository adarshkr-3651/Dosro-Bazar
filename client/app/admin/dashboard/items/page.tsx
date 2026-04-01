"use client";

import { useState, useEffect, useCallback } from "react";
import { Package, Search, Trash2, Loader2, ChevronLeft, ChevronRight, Heart, MessageSquare, CheckCircle2, AlertCircle, Tag, User } from "lucide-react";
import { getItemsAction, getItemStatsAction, deleteItemAction } from "@/app/lib/admin-data-actions";
import Image from "next/image";

export default function ItemsPage() {
    const [items, setItems] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        const [itemsRes, statsRes] = await Promise.all([
            getItemsAction(page, search),
            getItemStatsAction(),
        ]);
        if (itemsRes.success) { setItems(itemsRes.data); setPagination(itemsRes.pagination); }
        if (statsRes.success) setStats(statsRes.data);
        setLoading(false);
    }, [page, search]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete item "${title}"? This cannot be undone.`)) return;
        const res = await deleteItemAction(id);
        if (res.success) { showToast("Item deleted", "success"); fetchData(); }
        else showToast(res.error || "Failed to delete item", "error");
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-top-10 ${toast.type === "success" ? "bg-emerald-500" : "bg-rose-500"} text-white`}>
                    {toast.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-bold text-sm uppercase tracking-widest">{toast.message}</span>
                </div>
            )}

            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                    <Package className="w-10 h-10 text-emerald-600" /> Items
                </h1>
                <p className="text-slate-500">All marketplace listings across the platform.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Items", value: stats?.total ?? "—", color: "text-slate-900" },
                    { label: "New (30d)", value: stats?.recentItems ?? "—", color: "text-emerald-600" },
                    { label: "Total Likes", value: stats?.totalLikes ?? "—", color: "text-rose-600" },
                    { label: "Total Comments", value: stats?.totalComments ?? "—", color: "text-blue-600" },
                ].map(s => (
                    <div key={s.label} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{s.label}</p>
                        <p className={`text-3xl font-black mt-1 ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-3 focus-within:border-emerald-500/50 transition-all shadow-sm">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search items by title or description..." className="bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400 flex-1" />
            </div>

            {/* Grid */}
            {loading ? (
                <div className="py-20 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
            ) : items.length === 0 ? (
                <div className="py-20 text-center">
                    <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No items found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {items.map(item => (
                        <div key={item._id} className="group bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all shadow-sm">
                            {/* Image */}
                            <div className="aspect-[16/9] relative bg-slate-50 overflow-hidden">
                                {item.images?.[0] ? (
                                    <Image src={item.images[0]} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><Package className="w-10 h-10 text-slate-200" /></div>
                                )}
                                {/* Delete overlay */}
                                <button
                                    onClick={() => handleDelete(item._id, item.title)}
                                    className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-500/40 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Info */}
                            <div className="p-5 space-y-3">
                                <div>
                                    <h3 className="text-slate-900 font-bold text-sm leading-snug line-clamp-1 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{item.title}</h3>
                                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">{item.content}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-xs text-slate-400">
                                        <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-500" />{item.likeCount ?? 0}</span>
                                        <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5 text-blue-500" />{item.commentCount ?? 0}</span>
                                    </div>
                                    {item.minBid && (
                                        <span className="text-emerald-600 text-xs font-black flex items-center gap-1">
                                            <Tag className="w-3 h-3" /> Rs. {item.minBid.toLocaleString()}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                    <User className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                                    <span className="text-slate-400 text-xs truncate">{item.author?.username ?? "Unknown"}</span>
                                    <span className="ml-auto text-slate-300 text-[10px]">{new Date(item.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Page {pagination.page} of {pagination.pages} · {pagination.total} items</p>
                    <div className="flex gap-2">
                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all shadow-sm"><ChevronLeft className="w-4 h-4" /></button>
                        <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all shadow-sm"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
            )}
        </div>
    );
}
