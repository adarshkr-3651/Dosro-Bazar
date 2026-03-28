"use client";

import { useState, useEffect } from "react";
import { FileText, Users, Package, Megaphone, TrendingUp, Loader2, Store, UserCheck } from "lucide-react";
import { getUserStatsAction, getItemStatsAction, getAdStatsAction } from "@/app/lib/admin-data-actions";

export default function ReportsPage() {
    const [userStats, setUserStats] = useState<any>(null);
    const [itemStats, setItemStats] = useState<any>(null);
    const [adStats, setAdStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            const [uRes, iRes, aRes] = await Promise.all([
                getUserStatsAction(),
                getItemStatsAction(),
                getAdStatsAction(),
            ]);
            if (uRes.success) setUserStats(uRes.data);
            if (iRes.success) setItemStats(iRes.data);
            if (aRes.success) setAdStats(aRes.data);
            setLoading(false);
        };
        fetchAll();
    }, []);

    const overviewCards = [
        { label: "Total Users", value: userStats?.total, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        { label: "Active Sellers", value: userStats?.sellers ?? "—", icon: Store, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        { label: "Total Items", value: itemStats?.total, icon: Package, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
        { label: "Running Ads", value: adStats?.running, icon: Megaphone, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                    <FileText className="w-10 h-10 text-emerald-500" /> Reports
                </h1>
                <p className="text-zinc-500">Platform-wide analytics and performance overview.</p>
            </div>

            {loading ? (
                <div className="py-32 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-emerald-500" /></div>
            ) : (
                <>
                    {/* Overview KPIs */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {overviewCards.map(card => (
                            <div key={card.label} className={`p-6 rounded-3xl border ${card.border} ${card.bg} space-y-3`}>
                                <div className={`p-2.5 rounded-xl ${card.bg} w-fit border ${card.border}`}>
                                    <card.icon className={`w-5 h-5 ${card.color}`} />
                                </div>
                                <div>
                                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{card.label}</p>
                                    <p className={`text-4xl font-black mt-1 ${card.color}`}>{card.value ?? "—"}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Two-column breakdown */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* User Breakdown */}
                        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-7 space-y-5">
                            <h2 className="text-white font-bold text-lg flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-400" /> User Breakdown
                            </h2>
                            <div className="space-y-3">
                                {[
                                    { label: "Buyers", value: userStats?.buyers, pct: userStats?.total ? Math.round((userStats.buyers / userStats.total) * 100) : 0, color: "bg-blue-500" },
                                    { label: "Admins", value: userStats?.admins, pct: userStats?.total ? Math.round((userStats.admins / userStats.total) * 100) : 0, color: "bg-purple-500" },
                                    { label: "New (30d)", value: userStats?.recentUsers, pct: userStats?.total ? Math.round((userStats.recentUsers / userStats.total) * 100) : 0, color: "bg-emerald-500" },
                                ].map(row => (
                                    <div key={row.label} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-zinc-400 font-bold">{row.label}</span>
                                            <span className="text-white font-black">{row.value ?? "—"}</span>
                                        </div>
                                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                            <div className={`h-full ${row.color} rounded-full transition-all duration-700`} style={{ width: `${row.pct}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Item & Engagement */}
                        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-7 space-y-5">
                            <h2 className="text-white font-bold text-lg flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-purple-400" /> Engagement Metrics
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "Total Items", value: itemStats?.total, color: "text-white" },
                                    { label: "New Items (30d)", value: itemStats?.recentItems, color: "text-emerald-400" },
                                    { label: "Total Likes", value: itemStats?.totalLikes, color: "text-rose-400" },
                                    { label: "Total Comments", value: itemStats?.totalComments, color: "text-blue-400" },
                                ].map(m => (
                                    <div key={m.label} className="p-4 bg-zinc-950/50 border border-zinc-900 rounded-2xl">
                                        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">{m.label}</p>
                                        <p className={`text-2xl font-black mt-1 ${m.color}`}>{m.value ?? "—"}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Advertisement Overview */}
                        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-7 space-y-5">
                            <h2 className="text-white font-bold text-lg flex items-center gap-2">
                                <Megaphone className="w-5 h-5 text-amber-400" /> Advertisement Status
                            </h2>
                            <div className="space-y-3">
                                {[
                                    { label: "Running", value: adStats?.running, color: "bg-emerald-500" },
                                    { label: "Stopped", value: adStats?.stopped, color: "bg-rose-500" },
                                    { label: "Expired", value: adStats?.expired, color: "bg-amber-500" },
                                ].map(row => (
                                    <div key={row.label} className="flex items-center gap-4">
                                        <span className="text-zinc-400 text-sm font-bold w-20 flex-shrink-0">{row.label}</span>
                                        <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                            <div className={`h-full ${row.color} rounded-full`} style={{ width: adStats?.total ? `${Math.round(((row.value ?? 0) / adStats.total) * 100)}%` : "0%" }} />
                                        </div>
                                        <span className="text-white font-black text-sm w-8 text-right">{row.value ?? 0}</span>
                                    </div>
                                ))}
                                <p className="text-zinc-600 text-xs pt-2 border-t border-zinc-900">Total Campaigns: <span className="text-zinc-400 font-bold">{adStats?.total ?? 0}</span></p>
                            </div>
                        </div>

                        {/* Verification Summary */}
                        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-7 space-y-5">
                            <h2 className="text-white font-bold text-lg flex items-center gap-2">
                                <UserCheck className="w-5 h-5 text-emerald-400" /> Verification Health
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "Verified", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", hint: "Identity confirmed" },
                                    { label: "Pending", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", hint: "Awaiting review" },
                                    { label: "Rejected", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20", hint: "Documents failed" },
                                    { label: "Unverified", color: "text-zinc-500", bg: "bg-zinc-800 border-zinc-700", hint: "Not submitted" },
                                ].map(s => (
                                    <div key={s.label} className={`p-4 rounded-2xl border ${s.bg}`}>
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${s.color}`}>{s.label}</p>
                                        <p className="text-zinc-600 text-[10px] mt-0.5">{s.hint}</p>
                                        <p className="text-xs text-zinc-500 mt-2 font-bold">Visit Verifications page to manage</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-zinc-700 text-xs font-bold uppercase tracking-widest">
                        Reports generated from live data · Last refreshed on page load
                    </p>
                </>
            )}
        </div>
    );
}
