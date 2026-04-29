"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Search, Trash2, ShieldCheck, ShieldX, Loader2, ChevronLeft, ChevronRight, UserCircle, Mail, Phone, MapPin, Edit2, X, CheckCircle2, AlertCircle } from "lucide-react";
import { getUsersAction, getUserStatsAction, deleteUserAction, updateUserAction } from "@/app/lib/admin-data-actions";
import Image from "next/image";
import DeleteConfirmationModal from "@/app/components/DeleteConfirmationModal";


export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [editUser, setEditUser] = useState<any>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{ id: string, name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);


    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        const [usersRes, statsRes] = await Promise.all([
            getUsersAction(page, search),
            getUserStatsAction(),
        ]);
        if (usersRes.success) {
            setUsers(usersRes.data);
            setPagination(usersRes.pagination);
        }
        if (statsRes.success) setStats(statsRes.data);
        setLoading(false);
    }, [page, search]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = (id: string, name: string) => {
        setSelectedUser({ id, name });
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteUser = async () => {
        if (!selectedUser) return;
        setIsDeleting(true);
        const res = await deleteUserAction(selectedUser.id);
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        if (res.success) { 
            showToast("User deleted successfully", "success"); 
            fetchData(); 
            setSelectedUser(null);
        } else {
            showToast(res.error || "Failed to delete user", "error");
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
        if (res.success) { showToast("User updated", "success"); fetchData(); }
        else showToast(res.error || "Failed to update user", "error");
    };

    const roleColor: Record<string, string> = {
        admin: "bg-purple-50 border-purple-200 text-purple-700",
        seller: "bg-blue-50 border-blue-200 text-blue-700",
        buyer: "bg-slate-100 border-slate-200 text-slate-600",
    };

    const verifColor: Record<string, string> = {
        verified: "text-emerald-600",
        pending: "text-amber-600",
        rejected: "text-rose-600",
        unverified: "text-slate-400",
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
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
                    <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl border border-slate-200 animate-in zoom-in-95 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-slate-900 font-bold text-lg flex items-center gap-2"><Edit2 className="w-5 h-5 text-emerald-600" /> Edit User</h3>
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
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phone</label>
                                    <input name="phone" defaultValue={editUser.phone} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-500/50 transition-all" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Role</label>
                                    <select name="role" defaultValue={editUser.role} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-500/50 transition-all">
                                        <option value="buyer">Buyer</option>
                                        <option value="seller">Seller</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Address</label>
                                    <input name="address" defaultValue={editUser.address} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-500/50 transition-all" />
                                </div>
                            </div>
                            <button type="submit" disabled={editLoading} className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all flex items-center justify-center gap-2">
                                {editLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Changes"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                        <Users className="w-10 h-10 text-emerald-600" /> Users
                    </h1>
                    <p className="text-slate-500">Manage all registered users, roles and permissions.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Users", value: stats?.total ?? "—", color: "text-slate-900" },
                    { label: "Buyers", value: stats?.buyers ?? "—", color: "text-blue-600" },
                    { label: "Admins", value: stats?.admins ?? "—", color: "text-purple-600" },
                    { label: "New (30d)", value: stats?.recentUsers ?? "—", color: "text-emerald-600" },
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
                <input
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search by name, email or phone..."
                    className="bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400 flex-1"
                />
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/50">
                    <div>Avatar</div>
                    <div>User</div>
                    <div>Contact</div>
                    <div>Role / Status</div>
                    <div>Actions</div>
                </div>
                {loading ? (
                    <div className="py-20 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="py-20 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">No users found</div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {users.map(user => (
                            <div key={user._id} className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 px-6 py-4 hover:bg-slate-50 transition-all items-center">
                                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                                    {user.photo && user.photo !== "user.png" ? (
                                        <Image src={user.photo} alt={user.username} fill className="object-cover" />
                                    ) : (
                                        <UserCircle className="w-10 h-10 text-slate-300 m-auto" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-slate-900 font-bold text-sm">{user.username}</p>
                                    <p className="text-slate-400 text-xs mt-0.5">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <Mail className="w-3 h-3 text-slate-400" /> {user.email || "—"}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                        <Phone className="w-3 h-3 text-slate-400" /> {user.phone || "—"}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${roleColor[user.role] || roleColor.buyer}`}>{user.role}</span>
                                    {user.verificationStatus && user.verificationStatus !== "unverified" && (
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${verifColor[user.verificationStatus]}`}>{user.verificationStatus}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button onClick={() => setEditUser(user)} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-500/30 transition-all shadow-sm"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(user._id, user.username)} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-500/30 transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Page {pagination.page} of {pagination.pages} · {pagination.total} total</p>
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
                    setSelectedUser(null);
                }}
                onConfirm={confirmDeleteUser}
                title="Delete User"
                description={`Are you sure you want to delete user "${selectedUser?.name}"? This cannot be undone.`}
                confirmText="Delete User"
                isLoading={isDeleting}
            />
        </div>

    );
}
