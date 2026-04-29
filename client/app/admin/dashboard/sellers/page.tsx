"use client";

import { useState, useEffect, useCallback } from "react";
import { Store, Search, Trash2, Edit2, Loader2, ChevronLeft, ChevronRight, UserCircle, Mail, Phone, MapPin, CheckCircle2, AlertCircle, X, ShieldCheck, Star } from "lucide-react";
import { getSellersAction, deleteUserAction, updateUserAction } from "@/app/lib/admin-data-actions";
import Image from "next/image";
import DeleteConfirmationModal from "@/app/components/DeleteConfirmationModal";


export default function SellersPage() {
    const [sellers, setSellers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [editUser, setEditUser] = useState<any>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState<{ id: string, name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);


    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        const res = await getSellersAction(page, search);
        if (res.success) {
            setSellers(res.data);
            setPagination(res.pagination);
        }
        setLoading(false);
    }, [page, search]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = (id: string, name: string) => {
        setSelectedSeller({ id, name });
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteSeller = async () => {
        if (!selectedSeller) return;
        setIsDeleting(true);
        const res = await deleteUserAction(selectedSeller.id);
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        if (res.success) { 
            showToast("Seller removed", "success"); 
            fetchData(); 
            setSelectedSeller(null);
        } else {
            showToast(res.error || "Failed to remove seller", "error");
        }
    };


    const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEditLoading(true);
        const fd = new FormData(e.currentTarget);
        const data: Record<string, string> = {};
        fd.forEach((v, k) => { if (v) data[k] = v as string; });
        const res = await updateUserAction(editUser._id, data);
        setEditLoading(false);
        setEditUser(null);
        if (res.success) { showToast("Seller updated", "success"); fetchData(); }
        else showToast(res.error || "Failed to update seller", "error");
    };

    const verifBadge: Record<string, string> = {
        verified: "bg-emerald-50 border-emerald-100 text-emerald-700 font-bold",
        pending: "bg-amber-50 border-amber-100 text-amber-700 font-bold",
        rejected: "bg-rose-50 border-rose-100 text-rose-700 font-bold",
        unverified: "bg-slate-50 border-slate-200 text-slate-500 font-bold",
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

            {/* Edit Modal */}
            {editUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl border border-slate-200 animate-in zoom-in-95">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-slate-900 font-bold text-lg flex items-center gap-2"><Edit2 className="w-5 h-5 text-emerald-600" /> Edit Seller</h3>
                                <p className="text-slate-500 text-xs mt-0.5">{editUser.email}</p>
                            </div>
                            <button onClick={() => setEditUser(null)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Username</label>
                                    <input name="username" defaultValue={editUser.username} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-500/50 transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Address</label>
                                    <input name="address" defaultValue={editUser.address} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-500/50 transition-all" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Verification Status</label>
                                <select name="verificationStatus" defaultValue={editUser.verificationStatus} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-500/50 transition-all">
                                    <option value="unverified">Unverified</option>
                                    <option value="pending">Pending</option>
                                    <option value="verified">Verified</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <button type="submit" disabled={editLoading} className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all flex items-center justify-center gap-2">
                                {editLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : "Save Changes"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                    <Store className="w-10 h-10 text-emerald-600" /> Sellers
                </h1>
                <p className="text-slate-500">Active vendors and storefront management. Total: <span className="text-slate-900 font-bold">{pagination?.total ?? "..."}</span></p>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-3 focus-within:border-emerald-500/50 transition-all shadow-sm">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search sellers by name, email or phone..." className="bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400 flex-1" />
            </div>

            {/* Grid */}
            {loading ? (
                <div className="py-20 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
            ) : sellers.length === 0 ? (
                <div className="py-20 text-center">
                    <Store className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No sellers found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {sellers.map(seller => (
                        <div key={seller._id} className="group bg-white border border-slate-200 rounded-3xl p-6 hover:border-emerald-500/30 transition-all space-y-4 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex-shrink-0">
                                    {seller.photo && seller.photo !== "user.png" ? (
                                        <Image src={seller.photo} alt={seller.username} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center"><UserCircle className="w-10 h-10 text-slate-200" /></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-slate-900 font-bold truncate group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{seller.username}</p>
                                    <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mt-0.5">Since {new Date(seller.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest flex-shrink-0 ${verifBadge[seller.verificationStatus] || verifBadge.unverified}`}>
                                    {seller.verificationStatus}
                                </span>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-slate-500"><Mail className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" /><span className="truncate">{seller.email || "—"}</span></div>
                                <div className="flex items-center gap-2 text-slate-500"><Phone className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />{seller.phone || "—"}</div>
                                <div className="flex items-center gap-2 text-amber-500 font-black text-xs">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    {seller.averageRating ? seller.averageRating.toFixed(1) : "0.0"}
                                    <span className="text-[10px] text-slate-400 font-bold ml-1">({seller.numReviews || 0} reviews)</span>
                                </div>
                                {seller.address && <div className="flex items-center gap-2 text-slate-500"><MapPin className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" /><span className="truncate">{seller.address}</span></div>}
                            </div>
 
                            <div className="flex gap-2 pt-2 border-t border-slate-100">
                                <button onClick={() => setEditUser(seller)} className="flex-1 h-9 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-500/30 transition-all text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button onClick={() => handleDelete(seller._id, seller.username)} className="flex-1 h-9 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-500/30 transition-all text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
                                    <Trash2 className="w-3.5 h-3.5" /> Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Page {pagination.page} of {pagination.pages}</p>
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
                    setSelectedSeller(null);
                }}
                onConfirm={confirmDeleteSeller}
                title="Remove Seller"
                description={`Are you sure you want to remove seller "${selectedSeller?.name}" from the platform?`}
                confirmText="Remove Seller"
                isLoading={isDeleting}
            />
        </div>

    );
}
