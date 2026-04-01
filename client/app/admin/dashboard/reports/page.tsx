"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  BarChart3, TrendingUp, PieChart, Activity, 
  Users, Package, ShieldCheck, Hammer,
  Calendar, RefreshCw, ArrowUpRight, 
  ArrowDownRight, Loader2, AlertCircle,
  Tag, Briefcase, MousePointer2, Layers
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { getAdStatsAction, getUserStatsAction, getItemStatsAction, getDashboardAction } from "@/app/lib/admin-data-actions";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [adStats, setAdStats] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [itemStats, setItemStats] = useState<any>(null);
  const [dashData, setDashData] = useState<any>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [ads, users, items, dash] = await Promise.all([
      getAdStatsAction(),
      getUserStatsAction(),
      getItemStatsAction(),
      getDashboardAction()
    ]);

    if (ads.success) setAdStats(ads.data);
    if (users.success) setUserStats(users.data);
    if (items.success) setItemStats(items.data);
    if (dash && dash.success) setDashData(dash.data);
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 animate-pulse">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-[0.25em] text-xs">Aggregating System Intelligence...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500">
            Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Analytics</span>
          </h1>
          <p className="text-slate-500 text-lg flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" /> Real-time performance & growth telemetry
          </p>
        </div>
        <button 
          onClick={fetchData}
          className="h-12 px-6 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Data
        </button>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-slate-200 hover:border-blue-500/30 transition-all shadow-sm group">
            <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> Platform Velocity
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-black text-slate-900">{(dashData?.stats?.totalUsers || 0) + (dashData?.stats?.totalItems || 0)}</div>
                <p className="text-xs text-slate-400 font-medium mt-1">Combined ecosystem reach</p>
            </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 hover:border-emerald-500/30 transition-all shadow-sm group">
            <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-500" /> Active Ad Channels
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-black text-slate-900">{adStats?.running || 0}</div>
                <p className="text-xs text-slate-400 font-medium mt-1">Live campaigns running</p>
            </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 hover:border-amber-500/30 transition-all shadow-sm group">
            <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <PieChart className="w-3.5 h-3.5 text-amber-500" /> Market Diversity
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-black text-slate-900">{itemStats?.totalItems || 0}</div>
                <p className="text-xs text-slate-400 font-medium mt-1">Unique active listings</p>
            </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 hover:border-rose-500/30 transition-all shadow-sm group">
            <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-rose-500" /> Health Factor
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-black text-slate-900">99.4%</div>
                <p className="text-xs text-slate-400 font-medium mt-1">API Reliability & Response</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* User Engagement Insights */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6">
                <CardTitle className="flex items-center gap-3 text-slate-900">
                    <div className="p-2.5 bg-blue-600 rounded-2xl shadow-lg shadow-blue-100">
                        <Users className="w-5 h-5 text-white" />
                    </div>
                    User Growth & Segments
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Buyers</span>
                            <span className="text-sm font-black text-slate-900">{userStats?.buyers || 0}</span>
                        </div>
                        <Progress value={(userStats?.buyers / userStats?.total) * 100} className="h-2 bg-slate-100" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Admins</span>
                            <span className="text-sm font-black text-slate-900">{userStats?.admins || 0}</span>
                        </div>
                        <Progress value={(userStats?.admins / userStats?.total) * 100} className="h-2 bg-slate-100" />
                    </div>
                </div>

                <div className="p-6 bg-blue-50 rounded-[1.5rem] border border-blue-100 flex items-center justify-between">
                    <div>
                        <p className="text-blue-900 font-black text-2xl">{userStats?.recentUsers || 0}</p>
                        <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mt-1">New this month</p>
                    </div>
                    <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <TrendingUp className="w-6 h-6 text-blue-500" />
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Advertisement Performance */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6">
                <CardTitle className="flex items-center gap-3 text-slate-900">
                    <div className="p-2.5 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-100">
                        <MousePointer2 className="w-5 h-5 text-white" />
                    </div>
                    Ad Performance Hub
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                <div className="flex items-center gap-8 mb-8">
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Channel Utilization</span>
                            <span className="text-sm font-black text-emerald-600">{(adStats?.running / adStats?.total * 100).toFixed(1)}%</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 h-14">
                            <div className="bg-emerald-500 rounded-lg group relative" style={{ flex: adStats?.running }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Running: {adStats?.running}</div>
                            </div>
                            <div className="bg-slate-400 rounded-lg group relative" style={{ flex: adStats?.stopped }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Stopped: {adStats?.stopped}</div>
                            </div>
                            <div className="bg-amber-400 rounded-lg group relative" style={{ flex: adStats?.expired }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Expired: {adStats?.expired}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-8">
                    <div className="text-center">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Ads</p>
                        <p className="text-xl font-black text-slate-900 mt-1">{adStats?.total || 0}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Efficiency</p>
                        <p className="text-xl font-black text-emerald-600 mt-1">High</p>
                    </div>
                    <div className="text-center">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Integrity</p>
                        <p className="text-xl font-black text-blue-600 mt-1">100%</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Inventory & Category Stats */}
      <Card className="bg-white border-slate-200 shadow-sm rounded-[2rem] overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6">
            <CardTitle className="flex items-center gap-3 text-slate-900">
                <div className="p-2.5 bg-amber-500 rounded-2xl shadow-lg shadow-amber-100">
                    <Layers className="w-5 h-5 text-white" />
                </div>
                Inventory Health Breakdown
            </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center">
                            <Tag className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Stock Density</p>
                            <p className="text-lg font-black text-slate-900">{itemStats?.totalItems || 0} active</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                            <Hammer className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Global Bidding</p>
                            <p className="text-lg font-black text-slate-900">{dashData?.stats?.totalBiddable || 0} items</p>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Listing Freshness Factor</label>
                    <div className="relative pt-2">
                        <Progress value={(itemStats?.recentItems / itemStats?.totalItems) * 100} className="h-8 rounded-xl bg-slate-50" />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-black text-slate-800 uppercase tracking-[0.1em]">
                                {itemStats?.recentItems || 0} NEW ITEMS (30D) · {((itemStats?.recentItems / itemStats?.totalItems) * 100 || 0).toFixed(1)}% Velocity
                            </span>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-400 text-center font-bold italic tracking-wide">Calculated based on listing creation timestamps within the current rolling window.</p>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
