"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getNotifications, updateBidStatus, markNotificationsAsRead, markNotificationAsRead } from "../lib/api";
import { Loader2, Bell, Check, X, ArrowUpDown, Clock, Tag, Filter } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import Link from "next/link";

interface Notification {
    _id: string;
    recipient: string;
    sender: {
        _id: string;
        username: string;
        photo: string;
    };
    type: "bid_placed" | "bid_accepted" | "bid_rejected";
    message: string;
    relatedBid?: {
        _id: string;
        amount: number;
        status: string;
    };
    relatedItem?: {
        _id: string;
        title: string;
        images: string[];
        slug: string;
    };
    isRead: boolean;
    createdAt: string;
}

export default function NotificationsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<"date" | "price">("date");
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }
        fetchNotifications();
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const response = await getNotifications();
            if (response.success) {
                setNotifications(response.data);
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (bidId: string, status: "accepted" | "rejected") => {
        setActionLoading(bidId);
        try {
            await updateBidStatus(bidId, status);
            toast.success(`Bid ${status} successfully`);
            fetchNotifications(); // Refresh to update status and notifications
        } catch (err: any) {
            toast.error(err.message || "Action failed");
        } finally {
            setActionLoading(null);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success("All notifications marked as read");
            window.dispatchEvent(new Event('notificationsUpdated'));
        } catch (err: any) {
            console.error("Failed to mark all as read", err);
        }
    };

    const handleMarkSingleRead = async (id: string) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            window.dispatchEvent(new Event('notificationsUpdated'));
        } catch (err: any) {
            toast.error(err.message || "Failed to mark as read");
        }
    };

    const filteredNotifications = selectedProductId
        ? notifications.filter(n => n.relatedItem?._id === selectedProductId)
        : notifications;

    const sortedNotifications = [...filteredNotifications].sort((a, b) => {
        if (sortBy === "price") {
            const priceA = a.relatedBid?.amount || 0;
            const priceB = b.relatedBid?.amount || 0;
            return priceB - priceA;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const uniqueProducts = Array.from(
        new Map(
            notifications
                .filter(n => n.relatedItem)
                .map(n => [n.relatedItem!._id, n.relatedItem])
        ).values()
    );

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <div className="flex-1 flex justify-center items-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            <Bell className="h-8 w-8 text-primary" />
                            Notifications
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSortBy(sortBy === "date" ? "price" : "date")}
                            className="text-[10px] font-bold uppercase tracking-widest gap-2"
                        >
                            <ArrowUpDown className="h-3 w-3" />
                            Sort by: {sortBy === "date" ? "Recent" : "Price"}
                        </Button>

                        <div className="relative group">
                            <select
                                className="h-9 w-full md:w-[200px] rounded-md border border-input bg-background/50 backdrop-blur-sm pl-9 pr-4 text-[10px] font-bold uppercase tracking-widest cursor-pointer appearance-none focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all hover:bg-background hover:border-primary/20"
                                value={selectedProductId || ""}
                                onChange={(e) => setSelectedProductId(e.target.value || null)}
                            >
                                <option value="">Filter by product</option>
                                {uniqueProducts.map((p: any) => (
                                    <option key={p._id} value={p._id} className="bg-background text-foreground">
                                        {p.title}
                                    </option>
                                ))}
                            </select>
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary pointer-events-none transition-all group-hover:scale-110 z-10" />
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllRead}
                            className="text-[10px] font-bold uppercase tracking-widest text-primary"
                        >
                            Mark all read
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    {sortedNotifications.length === 0 ? (
                        <Card className="border-dashed py-20">
                            <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
                                <div className="p-4 rounded-full bg-muted/20">
                                    <Bell className="h-10 w-10 text-muted-foreground/40" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-lg font-bold">No notifications yet</p>
                                    <p className="text-sm text-muted-foreground">We'll notify you when someone bids on your items or updates your bids.</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        sortedNotifications.map((notification) => (
                            <Card
                                key={notification._id}
                                className={`group overflow-hidden transition-all duration-300 hover:shadow-md border-primary/5 ${!notification.isRead ? "bg-primary/5 border-l-4 border-l-primary" : "bg-card"}`}
                            >
                                <CardContent className="p-2 md:p-3">
                                    <div className="flex gap-3 md:gap-4">
                                        {/* Item Thumbnail */}
                                        {notification.relatedItem && (
                                            <Link href={`/product/${notification.relatedItem.slug}`} className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted border border-primary/5 transition-transform hover:scale-105 active:scale-95">
                                                <Image
                                                    src={notification.relatedItem.images?.[0] || "/placeholder.jpg"}
                                                    alt={notification.relatedItem.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </Link>
                                        )}

                                        <div className="flex-1 space-y-1">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className={`text-[9px] uppercase font-black border-none px-2 h-5 ${notification.type === "bid_placed" ? "bg-blue-500/10 text-blue-600" :
                                                            notification.type === "bid_accepted" ? "bg-green-500/10 text-green-600" :
                                                                "bg-red-500/10 text-red-600"
                                                            }`}>
                                                            {notification.type.replace("_", " ")}
                                                        </Badge>
                                                        <span className="text-[10px] font-bold text-muted-foreground/60 flex items-center gap-1 italic">
                                                            <Clock className="h-3 w-3" />
                                                            {new Date(notification.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-[13px] font-bold text-foreground leading-snug">
                                                        {notification.message}
                                                    </p>
                                                </div>

                                                <div className="text-right flex flex-col items-end gap-1">
                                                    {notification.relatedBid?.amount && (
                                                        <span className="text-sm font-black text-primary tracking-tighter">
                                                            Rs. {notification.relatedBid.amount.toLocaleString()}
                                                        </span>
                                                    )}
                                                    
                                                    {!notification.isRead && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleMarkSingleRead(notification._id)}
                                                            className="h-6 text-[9px] font-bold uppercase tracking-widest text-primary/90 hover:text-primary hover:bg-primary/5 px-2"
                                                        >
                                                            Mark Read
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions for bid_placed (Seller view) */}
                                            {notification.type === "bid_placed" && notification.relatedBid?.status === "pending" && (
                                                <div className="flex items-center gap-2 pt-1">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleAction(notification.relatedBid!._id, "accepted")}
                                                        disabled={actionLoading === notification.relatedBid?._id}
                                                        className="h-8 gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-[10px] uppercase tracking-widest"
                                                    >
                                                        {actionLoading === notification.relatedBid?._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleAction(notification.relatedBid!._id, "rejected")}
                                                        disabled={actionLoading === notification.relatedBid?._id}
                                                        className="h-8 gap-2 border-destructive/20 hover:bg-destructive/10 hover:text-destructive text-muted-foreground font-bold text-[10px] uppercase tracking-widest"
                                                    >
                                                        <X className="h-3 w-3" />
                                                        Deny
                                                    </Button>
                                                </div>
                                            )}

                                            {/* Status indicator for non-pending bids */}
                                            {notification.relatedBid && notification.relatedBid.status !== "pending" && (
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
                                                    <span className={notification.relatedBid.status === "accepted" ? "text-green-500" : "text-red-500"}>
                                                        Status: {notification.relatedBid.status}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
