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
                <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                    <Package className="w-10 h-10 text-emerald-500" /> Items
                </h1>
                <p className="text-zinc-500">All marketplace listings across the platform.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Items", value: stats?.total ?? "—", color: "text-white" },
                    { label: "New (30d)", value: stats?.recentItems ?? "—", color: "text-emerald-400" },
                    { label: "Total Likes", value: stats?.totalLikes ?? "—", color: "text-rose-400" },
                    { label: "Total Comments", value: stats?.totalComments ?? "—", color: "text-blue-400" },
                ].map(s => (
                    <div key={s.label} className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{s.label}</p>
                        <p className={`text-3xl font-black mt-1 ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-3 focus-within:border-emerald-500/50 transition-all">
                <Search className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search items by title or description..." className="bg-transparent outline-none text-sm text-zinc-300 placeholder:text-zinc-600 flex-1" />
            </div>

            {/* Grid */}
            {loading ? (
                <div className="py-20 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
            ) : items.length === 0 ? (
                <div className="py-20 text-center">
                    <Package className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                    <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">No items found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {items.map(item => (
                        <div key={item._id} className="group bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden hover:border-rose-500/20 transition-all">
                            {/* Image */}
                            <div className="aspect-[16/9] relative bg-zinc-900 overflow-hidden">
                                {item.images?.[0] ? (
                                    <Image src={item.images[0]} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><Package className="w-10 h-10 text-zinc-800" /></div>
                                )}
                                {/* Delete overlay */}
                                <button
                                    onClick={() => handleDelete(item._id, item.title)}
                                    className="absolute top-3 right-3 p-2 rounded-xl bg-zinc-950/80 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-rose-500 hover:border-rose-500/40 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Info */}
                            <div className="p-5 space-y-3">
                                <div>
                                    <h3 className="text-white font-bold text-sm leading-snug line-clamp-1">{item.title}</h3>
                                    <p className="text-zinc-600 text-xs mt-1 line-clamp-2">{item.content}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-xs text-zinc-600">
                                        <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-500" />{item.likeCount ?? 0}</span>
                                        <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5 text-blue-500" />{item.commentCount ?? 0}</span>
                                    </div>
                                    {item.minBid && (
                                        <span className="text-emerald-400 text-xs font-black flex items-center gap-1">
                                            <Tag className="w-3 h-3" /> Rs. {item.minBid.toLocaleString()}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 pt-2 border-t border-zinc-900">
                                    <User className="w-3.5 h-3.5 text-zinc-700 flex-shrink-0" />
                                    <span className="text-zinc-500 text-xs truncate">{item.author?.username ?? "Unknown"}</span>
                                    <span className="ml-auto text-zinc-700 text-[10px]">{new Date(item.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">Page {pagination.page} of {pagination.pages} · {pagination.total} items</p>
                    <div className="flex gap-2">
                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white disabled:opacity-30 transition-all"><ChevronLeft className="w-4 h-4" /></button>
                        <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)} className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white disabled:opacity-30 transition-all"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
            )}
        </div>
    );
}
