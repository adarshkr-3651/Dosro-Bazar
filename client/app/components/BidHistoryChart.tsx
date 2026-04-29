"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    ReferenceLine,
} from "recharts";
import { getItemBids } from "@/app/lib/api";
import { 
    Loader2, 
    TrendingUp, 
    TrendingDown, 
    Activity, 
    Zap, 
    Target, 
    BarChart3,
    ArrowUpRight,
    History
} from "lucide-react";

interface BidHistoryChartProps {
    itemId: string;
    basePrice: number;
}

export function BidHistoryChart({ itemId, basePrice }: BidHistoryChartProps) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalBids: 0,
        highestBid: 0,
        lowestBid: 0,
        trend: "neutral" as "up" | "down" | "neutral",
        percentageChange: 0,
        lastBidTime: ""
    });

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const res = await getItemBids(itemId);
                if (res.success && res.data.length > 0) {
                    const sortedBids = res.data.sort((a: any, b: any) => 
                        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    );

                    const chartData = sortedBids.map((bid: any) => {
                        const dateObj = bid.createdAt ? new Date(bid.createdAt) : new Date();
                        const isValid = !isNaN(dateObj.getTime());
                        const safeDate = isValid ? dateObj : new Date();

                        return {
                            time: safeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            fullTime: safeDate.toLocaleTimeString(),
                            amount: bid.amount,
                            date: safeDate.toLocaleDateString(),
                            bidder: bid.buyer?.username || "Anonymous"
                        };
                    });

                    if (chartData.length > 0) {
                        const highest = Math.max(...chartData.map(d => d.amount));
                        const lowest = Math.min(...chartData.map(d => d.amount));
                        const first = chartData[0].amount;
                        const last = chartData[chartData.length - 1].amount;
                        
                        let trend: "up" | "down" | "neutral" = "neutral";
                        let percentage = 0;

                        if (last > first) {
                            trend = "up";
                            percentage = ((last - first) / first) * 100;
                        } else if (last < first) {
                            trend = "down";
                            percentage = ((first - last) / first) * 100;
                        }

                        setStats({
                            totalBids: res.data.length,
                            highestBid: highest,
                            lowestBid: lowest,
                            trend,
                            percentageChange: percentage,
                            lastBidTime: chartData[chartData.length - 1]?.time || "Live"
                        });
                    }

                    setData(chartData);
                }
            } catch (error) {
                console.error("Failed to fetch bid history:", error);
            } finally {
                setLoading(false);
            }
        };

        if (itemId) fetchBids();
    }, [itemId]);

    const chartColor = useMemo(() => {
        if (stats.trend === "up") return "#22c55e"; // Success green
        if (stats.trend === "down") return "#ef4444"; // Destructive red
        return "#f59e0b"; // Amber
    }, [stats.trend]);

    if (loading) {
        return (
            <div className="h-[350px] flex flex-col items-center justify-center bg-muted/5 rounded-[2.5rem] border border-primary/10 backdrop-blur-sm">
                <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-primary/20" />
                    <Activity className="h-6 w-6 text-primary absolute inset-0 m-auto animate-pulse" />
                </div>
                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Syncing Live Market Data...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="h-[350px] flex flex-col items-center justify-center bg-gradient-to-br from-muted/5 to-primary/5 rounded-[2.5rem] border border-primary/10 p-10 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-grid-slate-100/[0.03] bg-[bottom_left_10px_10px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
                <div className="relative z-10">
                    <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-500 border border-primary/10">
                        <History className="h-10 w-10 text-primary/20" />
                    </div>
                    <h4 className="text-sm font-black text-foreground uppercase tracking-[0.2em]">Market Waiting...</h4>
                    <p className="text-[11px] text-muted-foreground mt-2 max-w-[250px] leading-relaxed font-medium">
                        The live auction floor is currently quiet. Place a bid to ignite the real-time performance analytics.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Advanced Stats Header */}
            <div className="grid grid-cols-4 gap-4">
                <div className="p-4 rounded-[1.5rem] bg-background border border-primary/5 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <Zap className="h-3 w-3 text-amber-500" />
                        <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/60">Momentum</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black tracking-tighter">+{stats.totalBids}</span>
                        <span className="text-[9px] font-bold text-muted-foreground/40 uppercase">Offers</span>
                    </div>
                </div>
                
                <div className="col-span-2 p-4 rounded-[1.5rem] bg-background border-2 border-primary/20 shadow-lg ring-4 ring-primary/5">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <Target className="h-3 w-3 text-primary" />
                            <span className="text-[9px] font-black uppercase tracking-wider text-primary">Current Winning Bid</span>
                        </div>
                        <div className={`flex items-center gap-1 text-[10px] font-black ${
                            stats.trend === "up" ? "text-green-500" : "text-red-500"
                        }`}>
                            {stats.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {stats.percentageChange.toFixed(2)}%
                        </div>
                    </div>
                    <span className="text-3xl font-black tracking-tighter text-primary">Rs. {stats.highestBid.toLocaleString()}</span>
                </div>

                <div className="p-4 rounded-[1.5rem] bg-background border border-primary/5 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <Activity className="h-3 w-3 text-green-500" />
                        <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/60">Last Sync</span>
                    </div>
                    <span className="text-xl font-black tracking-tighter uppercase">{stats.lastBidTime}</span>
                </div>
            </div>

            {/* Premium Chart Container */}
            <div className="relative p-6 bg-background/50 rounded-[3rem] border border-primary/10 shadow-2xl overflow-hidden group">
                <div className="absolute top-6 left-8 z-10">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-black uppercase tracking-[0.1em]">Live Price Velocity</h3>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-muted-foreground/60">Performance:</span>
                        <div className={`flex items-center gap-1 text-[10px] font-black ${
                            stats.trend === "up" ? "text-green-500" : "text-red-500"
                        }`}>
                            {stats.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {stats.percentageChange.toFixed(2)}%
                        </div>
                    </div>
                </div>

                <div className="h-[280px] w-full mt-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={chartColor} stopOpacity={0.25}/>
                                    <stop offset="100%" stopColor={chartColor} stopOpacity={0}/>
                                </linearGradient>
                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="4" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                            </defs>
                            <CartesianGrid 
                                strokeDasharray="10 10" 
                                vertical={false} 
                                stroke="hsl(var(--primary)/0.03)" 
                            />
                            <XAxis 
                                dataKey="time" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 9, fontWeight: 800, fill: 'hsl(var(--muted-foreground)/0.4)' }}
                                dy={15}
                                interval="preserveStartEnd"
                            />
                            <YAxis hide domain={['dataMin - 2000', 'dataMax + 2000']} />
                            <Tooltip 
                                cursor={{ stroke: 'hsl(var(--primary)/0.2)', strokeWidth: 2, strokeDasharray: '4 4' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-background/95 backdrop-blur-xl border border-primary/20 p-4 rounded-[2rem] shadow-2xl animate-in fade-in zoom-in-95 duration-300 ring-4 ring-primary/5">
                                                <div className="flex items-center justify-between gap-6 mb-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/50">Bidder Profile</span>
                                                        <span className="text-[10px] font-bold">{payload[0].payload.bidder}</span>
                                                    </div>
                                                    <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                                        <ArrowUpRight className="h-4 w-4 text-primary" />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-end gap-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Time</span>
                                                        <span className="text-[10px] font-bold">{payload[0].payload.fullTime}</span>
                                                    </div>
                                                    <div className="flex flex-col text-right">
                                                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/60">Bid Amount</span>
                                                        <span className="text-xl font-black text-primary tracking-tighter">
                                                            Rs. {payload[0].value?.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Area 
                                type="stepAfter" 
                                dataKey="amount" 
                                stroke={chartColor} 
                                strokeWidth={4}
                                fillOpacity={1} 
                                fill="url(#chartGradient)" 
                                animationDuration={2000}
                                animationEasing="ease-in-out"
                                filter="url(#glow)"
                            />
                            {/* Horizontal Reference Line for Ceiling */}
                            <ReferenceLine 
                                y={stats.highestBid} 
                                stroke="hsl(var(--primary)/0.1)" 
                                strokeDasharray="3 3"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend/Status Footer */}
                <div className="flex items-center justify-between mt-6 px-2">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/60">Real-Time Data Active</span>
                        </div>
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-primary/40">
                        Dosro Bazar Market Analytics • v2.0
                    </div>
                </div>
            </div>
        </div>
    );
}
