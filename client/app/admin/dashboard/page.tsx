"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
    Users, Package, ShieldCheck, Zap,
    Plus, X, Mail, Lock, Phone, UserPlus,
    ArrowUpRight, ArrowDownRight, Clock,
    RefreshCw, AlertCircle, CheckCircle2,
    ShieldAlert, Tag, Hammer, Loader2, Activity
} from "lucide-react";
import { getAdminProfile, createAdmin } from "../../lib/admin-actions";
import { getDashboardAction } from "../../lib/admin-data-actions";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import ErrorMessage from "../../components/shared/ErrorMessage";

// ─── helpers ────────────────────────────────────────────────────────────────

function timeAgo(date: string | Date) {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

function initial(name: string) {
    return (name || "?").charAt(0).toUpperCase();
}

// ─── stat card ───────────────────────────────────────────────────────────────

function StatCard({
    label, value, icon: Icon, change, changeUp, color, sub,
}: {
    label: string; value: string | number; icon: React.ElementType;
    change?: string; changeUp?: boolean; color: string; sub?: string;
}) {
    return (
        <Card className="bg-white border-slate-200 hover:border-emerald-500/30 transition-all duration-300 group overflow-hidden relative shadow-sm hover:shadow-md">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Icon className="w-20 h-20" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-slate-400 tracking-widest uppercase">{label}</CardTitle>
                <Icon className={`w-5 h-5 ${color} opacity-80`} />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-black text-slate-900">{value}</div>
                {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
                {change && (
                    <div className={`flex items-center mt-2 text-xs font-bold ${changeUp ? "text-emerald-600" : "text-rose-600"}`}>
                        {changeUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        {change}
                        <span className="text-slate-400 font-medium ml-1.5 italic">vs last month</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// ─── main ────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
    const [adminProfile, setAdminProfile] = useState<any>(null);
    const [dashData, setDashData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);
    const [showPass, setShowPass] = useState(false);

    const fetchData = useCallback(async (silent = false) => {
        if (!silent) setLoading(true); else setRefreshing(true);
        const [profile, dash] = await Promise.all([
            getAdminProfile(),
            getDashboardAction(),
        ]);
        setAdminProfile(profile);
        if (dash?.success) setDashData(dash.data);
        setLoading(false);
        setRefreshing(false);
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    async function handleAddAdmin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFormLoading(true);
        setFormError(null);
        setFormSuccess(null);
        const fd = new FormData(e.currentTarget);
        const result = await createAdmin({
            username: fd.get("username"),
            email: fd.get("email"),
            phone: fd.get("phone"),
            password: fd.get("password"),
            role: fd.get("role"),
            secretKey: fd.get("secretKey"),
        });
        setFormLoading(false);
        if (result.success) {
            setFormSuccess(result.message || "Admin created successfully");
            setTimeout(() => { setIsAddModalOpen(false); setFormSuccess(null); }, 2000);
        } else {
            setFormError(result.error || "Failed to create admin");
        }
    }

    const stats = dashData?.stats;
    const activity = dashData?.activityFeed || [];
    const latestUsers = dashData?.latestUsers || [];
    const latestItems = dashData?.latestItems || [];

    // ─── Skeleton ──────────────────────────────────────────────────────────
    if (loading) return (
        <div className="space-y-8 animate-pulse">
            <div className="h-10 bg-slate-200 rounded-2xl w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-36 bg-slate-200 rounded-3xl" />
                ))}
            </div>
            <div className="h-96 bg-slate-200 rounded-3xl" />
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">

            {/* ── Add Admin Modal ─────────────────────────────────────────── */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <Card className="w-full max-w-lg bg-white border-slate-200 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500" />
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <UserPlus className="w-5 h-5 text-emerald-600" /> Provision Account
                                </CardTitle>
                                <p className="text-slate-500 text-sm">Create a new administrative access node</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddAdmin} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="username" className="text-xs font-bold text-slate-500 uppercase tracking-widest">Username</Label>
                                        <Input id="username" name="username" required placeholder="e.g. mod_john" className="bg-slate-50 border-slate-200 focus:border-emerald-500/50 h-11" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="role" className="text-xs font-bold text-slate-500 uppercase tracking-widest">Role</Label>
                                        <select name="role" id="role" className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:border-emerald-500/50">
                                            <option value="admin">Admin</option>
                                            <option value="moderator">Moderator</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input id="email" name="email" type="email" placeholder="admin@dosrobazar.com" className="pl-10 bg-slate-50 border-slate-200 focus:border-emerald-500/50 h-11" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone" className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phone</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input id="phone" name="phone" placeholder="+977" className="pl-10 bg-slate-50 border-slate-200 focus:border-emerald-500/50 h-11" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input id="password" name="password" type={showPass ? "text" : "password"} required className="pl-10 bg-slate-50 border-slate-200 focus:border-emerald-500/50 h-11" />
                                        <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors text-xs">
                                            {showPass ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="secretKey" className="text-xs font-bold text-slate-500 uppercase tracking-widest">Platform Secret Key</Label>
                                    <div className="relative">
                                        <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input id="secretKey" name="secretKey" type="password" required placeholder="Superadmin password" className="pl-10 bg-slate-50 border-slate-200 focus:border-emerald-500/50 h-11" />
                                    </div>
                                </div>
                                {formError && <ErrorMessage error={formError} />}
                                {formSuccess && (
                                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-600 text-sm font-bold flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" /> {formSuccess}
                                    </div>
                                )}
                                <div className="flex gap-3 pt-1">
                                    <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1 bg-transparent border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-900">Cancel</Button>
                                    <Button type="submit" disabled={formLoading} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                                        {formLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating...</> : "Add Administrator"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500">
                        System Insights
                    </h1>
                    <p className="text-slate-500 text-lg flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-600" />
                        Live platform health and performance metrics
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchData(true)}
                        disabled={refreshing}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-500/30 transition-all shadow-sm"
                        title="Refresh"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                    </button>
                    {adminProfile?.role === "superadmin" && (
                        <Button
                            onClick={() => { setFormError(null); setFormSuccess(null); setIsAddModalOpen(true); }}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-5 rounded-2xl flex items-center gap-2 shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-all hover:scale-105"
                        >
                            <Plus className="w-5 h-5" /> Add Administrator
                        </Button>
                    )}
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Server</span>
                        <span className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            Operational
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Stats Grid ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Users"
                    value={stats?.totalUsers ?? "—"}
                    icon={Users}
                    change={stats?.userChange}
                    changeUp={stats?.userChangeUp}
                    color="text-blue-500"
                    sub={`${stats?.recentUsers ?? 0} joined this month`}
                />
                <StatCard
                    label="Active Listings"
                    value={stats?.totalItems ?? "—"}
                    icon={Package}
                    change={stats?.itemChange}
                    changeUp={stats?.itemChangeUp}
                    color="text-emerald-500"
                    sub={`${stats?.recentItems ?? 0} listed this month`}
                />
                <StatCard
                    label="Verified Sellers"
                    value={stats?.verifiedSellers ?? "—"}
                    icon={ShieldCheck}
                    color="text-amber-500"
                    sub={`${stats?.pendingSellers ?? 0} pending review`}
                />
                <StatCard
                    label="Auction Items"
                    value={stats?.totalBiddable ?? "—"}
                    icon={Hammer}
                    color="text-rose-500"
                    sub="items with active bidding"
                />
            </div>

            {/* ── Middle Section ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Activity Feed */}
                <Card className="xl:col-span-2 bg-white border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-5">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg text-slate-900 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-500/5">
                                    <Clock className="w-4 h-4 text-emerald-600" />
                                </div>
                                Recent Activity
                            </CardTitle>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last 30 days</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {activity.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-slate-300">
                                <AlertCircle className="w-8 h-8 mb-3 opacity-40" />
                                <p className="text-sm font-bold">No recent activity</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {activity.map((a: any) => (
                                    <div key={String(a.id)} className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-all group">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-900 text-sm group-hover:border-emerald-500/30 shadow-sm transition-colors">
                                                {initial(a.actor)}
                                            </div>
                                            {a.type === "warning" && (
                                                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-white" />
                                            )}
                                            {a.type === "completed" && (
                                                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-slate-600 leading-relaxed truncate">
                                                <span className="font-bold text-slate-900">{a.actor}</span>
                                                <span className="text-slate-400 mx-1.5">{a.action}</span>
                                                {a.target && (
                                                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 font-bold text-xs">
                                                        {a.target}
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1.5">
                                                <Zap className="w-3 h-3" />
                                                {timeAgo(a.time)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Stats sidebar */}
                <div className="space-y-6">
                    {/* Latest Users */}
                    <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="pb-3 text-slate-900">
                            <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-500" /> New Users
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 pt-0">
                            {latestUsers.length === 0 ? (
                                <p className="text-slate-300 text-xs">No users yet</p>
                            ) : latestUsers.map((u: any) => (
                                <div key={u._id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-all">
                                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-xs font-black flex-shrink-0">
                                        {initial(u.username)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-slate-900 text-xs font-bold truncate">{u.username}</p>
                                        <p className="text-slate-400 text-[10px] truncate">{u.email || u.role}</p>
                                    </div>
                                    <span className="text-[9px] text-slate-300 flex-shrink-0">{timeAgo(u.createdAt)}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Latest Items */}
                    <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="pb-3 text-slate-900">
                            <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Tag className="w-4 h-4 text-emerald-500" /> New Listings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 pt-0">
                            {latestItems.length === 0 ? (
                                <p className="text-slate-300 text-xs">No items yet</p>
                            ) : latestItems.map((item: any) => (
                                <div key={item._id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-all">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-black flex-shrink-0">
                                        {initial(item.title)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-slate-900 text-xs font-bold truncate">{item.title}</p>
                                        <p className="text-slate-400 text-[10px]">
                                            by {item.author?.username || "unknown"} · Rs {item.price?.toLocaleString() || 0}
                                        </p>
                                    </div>
                                    <span className="text-[9px] text-slate-300 flex-shrink-0">{timeAgo(item.createdAt)}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
