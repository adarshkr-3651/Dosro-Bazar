"use client";

import { useState, useEffect, useCallback } from "react";
import { UserCheck, Search, ShieldCheck, ShieldX, Loader2, ChevronLeft, ChevronRight, UserCircle, CheckCircle2, AlertCircle, ExternalLink, Clock } from "lucide-react";
import { getVerificationsAction, updateVerificationAction } from "@/app/lib/admin-data-actions";
import Image from "next/image";

const STATUS_TABS = ["all", "pending", "verified", "rejected"] as const;
type StatusTab = typeof STATUS_TABS[number];

export default function VerificationsPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<StatusTab>("pending");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        const status = activeTab === "all" ? "" : activeTab;
        const res = await getVerificationsAction(page, status);
        if (res.success) {
            // If search term entered, apply client-side name/email filter
            const data = search
                ? (res.data || []).filter((u: any) =>
                    u.username?.toLowerCase().includes(search.toLowerCase()) ||
                    u.email?.toLowerCase().includes(search.toLowerCase())
                  )
                : (res.data || []);
            setUsers(data);
            setPagination(res.pagination);
        }
        setLoading(false);
    }, [page, activeTab, search]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleVerify = async (id: string, status: "verified" | "rejected") => {
        setActionLoading(id + status);
        const res = await updateVerificationAction(id, status);
        setActionLoading(null);
        if (res.success) {
            showToast(`User ${status === "verified" ? "verified" : "rejected"} successfully`, "success");
            fetchData();
        } else {
            showToast(res.error || "Action failed", "error");
        }
    };

    const verifColors: Record<string, { badge: string; dot: string }> = {
        pending: { badge: "bg-amber-500/10 border-amber-500/30 text-amber-400", dot: "bg-amber-500" },
        verified: { badge: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400", dot: "bg-emerald-500" },
        rejected: { badge: "bg-rose-500/10 border-rose-500/30 text-rose-400", dot: "bg-rose-500" },
        unverified: { badge: "bg-zinc-800 border-zinc-700 text-zinc-500", dot: "bg-zinc-600" },
    };

    const idTypeIcons: Record<string, string> = {
        Citizenship: "🪪",
        PAN: "📄",
        NID: "🪪",
        "Driving License": "🚗",
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
                    <UserCheck className="w-10 h-10 text-emerald-500" /> Verifications
                </h1>
                <p className="text-zinc-500">Review and approve seller identity documents submitted by users.</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-zinc-900/50 border border-zinc-800 rounded-2xl w-fit">
                {STATUS_TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setPage(1); }}
                        className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            activeTab === tab
                                ? "bg-emerald-600 text-white shadow-lg"
                                : "text-zinc-500 hover:text-white"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-3 focus-within:border-emerald-500/50 transition-all">
                <Search className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="bg-transparent outline-none text-sm text-zinc-300 placeholder:text-zinc-600 flex-1" />
            </div>

            {/* List */}
            {loading ? (
                <div className="py-20 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
            ) : users.length === 0 ? (
                <div className="py-24 flex flex-col items-center gap-4 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
                    <UserCheck className="w-12 h-12 text-zinc-800" />
                    <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">No {activeTab !== "all" ? activeTab : ""} verification requests</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {users.map(user => {
                        const vc = verifColors[user.verificationStatus] || verifColors.unverified;
                        return (
                            <div key={user._id} className="bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden hover:border-zinc-700 transition-all">
                                <div className="flex items-start gap-5 p-6">
                                    {/* Avatar */}
                                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0">
                                        {user.photo && user.photo !== "user.png" ? (
                                            <Image src={user.photo} alt={user.username} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center"><UserCircle className="w-9 h-9 text-zinc-700" /></div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h3 className="text-white font-bold">{user.username}</h3>
                                            <span className={`px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${vc.badge}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${vc.dot}`} />
                                                {user.verificationStatus}
                                            </span>
                                        </div>
                                        <p className="text-zinc-500 text-sm">{user.email || "No email"}</p>
                                        <div className="flex items-center gap-4 flex-wrap text-xs text-zinc-600">
                                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Submitted {new Date(user.updatedAt || user.createdAt).toLocaleDateString()}</span>
                                            {user.idProofType && (
                                                <span className="flex items-center gap-1.5">{idTypeIcons[user.idProofType] || "📄"} ID Type: <span className="text-zinc-400 font-bold">{user.idProofType}</span></span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 flex-shrink-0">
                                        {user.idProof && (
                                            <a href={user.idProof} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all text-xs font-bold uppercase tracking-widest">
                                                <ExternalLink className="w-3.5 h-3.5" /> View Doc
                                            </a>
                                        )}
                                        {user.verificationStatus !== "verified" && (
                                            <button
                                                onClick={() => handleVerify(user._id, "verified")}
                                                disabled={actionLoading === user._id + "verified"}
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition-all text-xs font-bold uppercase tracking-widest"
                                            >
                                                {actionLoading === user._id + "verified" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />} Approve
                                            </button>
                                        )}
                                        {user.verificationStatus !== "rejected" && (
                                            <button
                                                onClick={() => handleVerify(user._id, "rejected")}
                                                disabled={actionLoading === user._id + "rejected"}
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-500 disabled:opacity-50 text-white transition-all text-xs font-bold uppercase tracking-widest"
                                            >
                                                {actionLoading === user._id + "rejected" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldX className="w-3.5 h-3.5" />} Reject
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Feedback bar if rejected */}
                                {user.verificationFeedback && (
                                    <div className="px-6 py-3 bg-zinc-950/50 border-t border-zinc-900 text-xs text-zinc-500">
                                        <span className="font-bold text-zinc-400">Feedback: </span>{user.verificationFeedback}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">Page {pagination.page} of {pagination.pages}</p>
                    <div className="flex gap-2">
                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white disabled:opacity-30 transition-all"><ChevronLeft className="w-4 h-4" /></button>
                        <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)} className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white disabled:opacity-30 transition-all"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
            )}
        </div>
    );
}
