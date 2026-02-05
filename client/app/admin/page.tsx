import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Users, Package, ShoppingCart, TrendingUp, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";

export default function AdminDashboard() {
    const stats = [
        { label: "Total Users", value: "1,284", icon: Users, change: "+12%", trendingUp: true },
        { label: "Active Listings", value: "432", icon: Package, change: "+5.4%", trendingUp: true },
        { label: "Total Sales", value: "$12,450", icon: ShoppingCart, change: "-2.1%", trendingUp: false },
        { label: "Platform Growth", value: "18.2%", icon: TrendingUp, change: "+4.3%", trendingUp: true },
    ];

    const recentActivity = [
        { id: 1, user: "Alice Johnson", action: "listed a new item", target: "iPhone 13 Pro", time: "2 minutes ago" },
        { id: 2, user: "Bob Smith", action: "verified their account", target: null, time: "15 minutes ago" },
        { id: 3, user: "Charlie Davis", action: "purchased an item", target: "Mechanical Keyboard", time: "1 hour ago" },
        { id: 4, user: "Diana Prince", action: "reported a listing", target: "Suspicious Item #42", time: "3 hours ago" },
        { id: 5, user: "Evan Wright", action: "updated their profile", target: null, time: "5 hours ago" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">System Overview</h1>
                <p className="text-zinc-500 text-lg">Real-time health and performance metrics for Remarket Hub.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} className="bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400">{stat.label}</CardTitle>
                            <stat.icon className="w-4 h-4 text-zinc-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className={`flex items-center mt-1 text-xs font-semibold ${stat.trendingUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {stat.trendingUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                {stat.change}
                                <span className="text-zinc-600 font-normal ml-1">since last week</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <Card className="lg:col-span-2 bg-zinc-900/40 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-emerald-500" />
                            Administrative Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-zinc-800/30 transition-colors border border-transparent hover:border-zinc-800/50">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-400">
                                        {activity.user.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-zinc-300">
                                            <span className="font-bold text-white">{activity.user}</span> {activity.action}
                                            {activity.target && <span className="text-emerald-500 font-medium italic">: {activity.target}</span>}
                                        </p>
                                        <p className="text-xs text-zinc-500 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 border border-zinc-800 rounded-xl text-sm font-semibold text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all">
                            View Audit Log
                        </button>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-zinc-900/40 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Admin Commands</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {[
                            "Generate Reports",
                            "Review Flagged Content",
                            "Broadcast System Notification",
                            "Run Security Baseline",
                            "Database Maintenance"
                        ].map((action) => (
                            <button
                                key={action}
                                className="w-full text-left px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-700 transition-all"
                            >
                                {action}
                            </button>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
