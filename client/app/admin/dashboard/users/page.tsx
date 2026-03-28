"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Search, Trash2, ShieldCheck, ShieldX, Loader2, ChevronLeft, ChevronRight, UserCircle, Mail, Phone, MapPin, Edit2, X, CheckCircle2, AlertCircle } from "lucide-react";
import { getUsersAction, getUserStatsAction, deleteUserAction, updateUserAction } from "@/app/lib/admin-data-actions";
import Image from "next/image";

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

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
        const res = await deleteUserAction(id);
        if (res.success) { showToast("User deleted successfully", "success"); fetchData(); }
        else showToast(res.error || "Failed to delete user", "error");
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
        admin: "bg-purple-500/10 border-purple-500/30 text-purple-400",
        seller: "bg-blue-500/10 border-blue-500/30 text-blue-400",
        buyer: "bg-zinc-800 border-zinc-700 text-zinc-400",
    };

    const verifColor: Record<string, string> = {
        verified: "text-emerald-400",
        pending: "text-amber-400",
        rejected: "text-rose-400",
        unverified: "text-zinc-600",
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-zinc-950 w-full max-w-lg rounded-[2rem] shadow-2xl border border-zinc-800 animate-in zoom-in-95 overflow-hidden">
                        <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-bold text-lg flex items-center gap-2"><Edit2 className="w-5 h-5 text-emerald-500" /> Edit User</h3>
                                <p className="text-zinc-500 text-xs mt-0.5">{editUser.email}</p>
                            </div>
                            <button onClick={() => setEditUser(null)} className="p-2 hover:bg-zinc-900 rounded-xl transition-colors"><X className="w-5 h-5 text-zinc-500" /></button>
                        </div>
                        <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Username</label>
                                    <input name="username" defaultValue={editUser.username} className="w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Phone</label>
                                    <input name="phone" defaultValue={editUser.phone} className="w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Role</label>
                                    <select name="role" defaultValue={editUser.role} className="w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50">
                                        <option value="buyer">Buyer</option>
                                        <option value="seller">Seller</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Address</label>
                                    <input name="address" defaultValue={editUser.address} className="w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50" />
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
                    <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                        <Users className="w-10 h-10 text-emerald-500" /> Users
                    </h1>
                    <p className="text-zinc-500">Manage all registered users, roles and permissions.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Users", value: stats?.total ?? "—", color: "text-white" },
                    { label: "Buyers", value: stats?.buyers ?? "—", color: "text-blue-400" },
                    { label: "Admins", value: stats?.admins ?? "—", color: "text-purple-400" },
                    { label: "New (30d)", value: stats?.recentUsers ?? "—", color: "text-emerald-400" },
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
                <input
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search by name, email or phone..."
                    className="bg-transparent outline-none text-sm text-zinc-300 placeholder:text-zinc-600 flex-1"
                />
            </div>

            {/* Table */}
            <div className="bg-zinc-950/50 border border-zinc-900 rounded-3xl overflow-hidden">
                <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-zinc-900 text-[10px] font-black uppercase tracking-widest text-zinc-600">
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
                    <div className="py-20 text-center text-zinc-600 text-sm font-bold uppercase tracking-widest">No users found</div>
                ) : (
                    <div className="divide-y divide-zinc-900">
                        {users.map(user => (
                            <div key={user._id} className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 px-6 py-4 hover:bg-zinc-900/30 transition-all items-center">
                                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0">
                                    {user.photo && user.photo !== "user.png" ? (
                                        <Image src={user.photo} alt={user.username} fill className="object-cover" />
                                    ) : (
                                        <UserCircle className="w-10 h-10 text-zinc-700 m-auto" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">{user.username}</p>
                                    <p className="text-zinc-600 text-xs mt-0.5">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                                        <Mail className="w-3 h-3 text-zinc-600" /> {user.email || "—"}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                        <Phone className="w-3 h-3 text-zinc-600" /> {user.phone || "—"}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${roleColor[user.role] || roleColor.buyer}`}>{user.role}</span>
                                    {user.verificationStatus && user.verificationStatus !== "unverified" && (
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${verifColor[user.verificationStatus]}`}>{user.verificationStatus}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button onClick={() => setEditUser(user)} className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-emerald-500 hover:border-emerald-500/30 transition-all"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(user._id, user.username)} className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-rose-500 hover:border-rose-500/30 transition-all"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">Page {pagination.page} of {pagination.pages} · {pagination.total} total</p>
                    <div className="flex gap-2">
                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white disabled:opacity-30 transition-all"><ChevronLeft className="w-4 h-4" /></button>
                        <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)} className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white disabled:opacity-30 transition-all"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
            )}
        </div>
    );
}
