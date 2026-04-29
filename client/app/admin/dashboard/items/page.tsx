"use client";

import { useState, useEffect, useCallback } from "react";
import { Package, Search, Trash2, Loader2, ChevronLeft, ChevronRight, Heart, MessageSquare, CheckCircle2, AlertCircle, Tag, User, ShieldAlert, ShieldCheck, Zap, ZapOff } from "lucide-react";
import { getItemsAction, getItemStatsAction, deleteItemAction, getSettingsAction, updateSettingAction, approveItemAction } from "@/app/lib/admin-data-actions";
import Image from "next/image";
import DeleteConfirmationModal from "@/app/components/DeleteConfirmationModal";


export default function ItemsPage() {
    const [items, setItems] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    
    // AI Moderation State
    const [aiModerationEnabled, setAiModerationEnabled] = useState(true);
    const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
    const [updatingSetting, setUpdatingSetting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ id: string, title: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);


    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        const [itemsRes, statsRes, settingsRes] = await Promise.all([
            getItemsAction(page, search, showFlaggedOnly),
            getItemStatsAction(),
            getSettingsAction()
        ]);
        
        if (itemsRes.success) { setItems(itemsRes.data); setPagination(itemsRes.pagination); }
        if (statsRes.success) setStats(statsRes.data);
        
        console.log("[ItemsPage] Settings response:", settingsRes);
        if (settingsRes.success) {
            const modSetting = settingsRes.data.find((s: any) => s.key === "ai_moderation_enabled");
            if (modSetting) setAiModerationEnabled(modSetting.value === true);
        } else {
            console.error("[ItemsPage] Failed to fetch settings:", settingsRes.error);
        }
        
        setLoading(false);
    }, [page, search, showFlaggedOnly]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = (id: string, title: string) => {
        setSelectedItem({ id, title });
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteItem = async () => {
        if (!selectedItem) return;
        setIsDeleting(true);
        const res = await deleteItemAction(selectedItem.id);
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        if (res.success) { 
            showToast("Item deleted", "success"); 
            fetchData(); 
            setSelectedItem(null);
        } else {
            showToast(res.error || "Failed to delete item", "error");
        }
    };


    const handleApprove = async (id: string, title: string) => {
        const res = await approveItemAction(id);
        if (res.success) { 
            showToast("Item approved", "success"); 
            fetchData(); 
        } else {
            showToast(res.error || "Failed to approve item", "error");
        }
    };

    const toggleAiModeration = async () => {
        setUpdatingSetting(true);
        const newValue = !aiModerationEnabled;
        const res = await updateSettingAction("ai_moderation_enabled", newValue);
        if (res.success) {
            setAiModerationEnabled(newValue);
            showToast(`AI Moderation ${newValue ? "Enabled" : "Disabled"}`, "success");
        } else {
            showToast(res.error || "Failed to update setting", "error");
        }
        setUpdatingSetting(false);
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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                        <Package className="w-10 h-10 text-emerald-600" /> Items
                    </h1>
                    <p className="text-slate-500 font-medium">All marketplace listings across the platform.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200">
                    <button 
                        onClick={() => { setShowFlaggedOnly(false); setPage(1); }}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${!showFlaggedOnly ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"}`}
                    >
                        <Tag className="w-3.5 h-3.5" /> All Items
                    </button>
                    <button 
                        onClick={() => { setShowFlaggedOnly(true); setPage(1); }}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${showFlaggedOnly ? "bg-rose-600 text-white shadow-lg shadow-rose-500/20" : "text-slate-400 hover:text-rose-600"}`}
                    >
                        <ShieldAlert className="w-3.5 h-3.5" /> Flagged Items
                    </button>
                    <div className="w-px h-6 bg-slate-200 mx-1 hidden md:block" />
                    <button 
                        onClick={toggleAiModeration}
                        disabled={updatingSetting}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 border ${aiModerationEnabled ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"}`}
                    >
                        {updatingSetting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : aiModerationEnabled ? <Zap className="w-3.5 h-3.5" /> : <ZapOff className="w-3.5 h-3.5" />}
                        AI Moderation: {aiModerationEnabled ? "ON" : "OFF"}
                    </button>
                </div>
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
                                
                                {/* Flagged Badge */}
                                {item.isFlagged && (
                                    <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                                        <ShieldAlert className="w-3 h-3" /> Flagged
                                    </div>
                                )}

                                {/* Action overlay */}
                                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    {item.isFlagged && (
                                        <button
                                            onClick={() => handleApprove(item._id, item.title)}
                                            className="p-2 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 text-emerald-600 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all shadow-sm"
                                            title="Approve Item"
                                        >
                                            <ShieldCheck className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(item._id, item.title)}
                                        className="p-2 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 text-slate-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm"
                                        title="Delete Item"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-5 space-y-3">
                                <div>
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="text-slate-900 font-bold text-sm leading-snug line-clamp-1 group-hover:text-emerald-600 transition-colors uppercase tracking-tight flex-1">{item.title}</h3>
                                        {item.isFlagged && <div className="p-1 rounded-full bg-rose-50 border border-rose-100 text-rose-500" title={item.moderationReason}><AlertCircle className="w-3 h-3" /></div>}
                                    </div>
                                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">{item.content}</p>
                                    {item.isFlagged && item.moderationReason && (
                                        <p className="text-[9px] text-rose-500 font-bold uppercase mt-2 bg-rose-50 p-2 rounded-lg border border-rose-100">Reason: {item.moderationReason}</p>
                                    )}
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

            <DeleteConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedItem(null);
                }}
                onConfirm={confirmDeleteItem}
                title="Delete Item"
                description={`Are you sure you want to delete "${selectedItem?.title}"? This cannot be undone.`}
                confirmText="Delete Item"
                isLoading={isDeleting}
            />
        </div>

    );
}
