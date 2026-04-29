"use client";

import { useEffect, useState, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getNotifications, updateBidStatus, markNotificationsAsRead, markNotificationAsRead, respondToBidAction } from "../lib/api";
import { Loader2, Bell, Check, X, ArrowUpDown, Clock, Tag, Filter, Phone, MessageSquare, CheckCircle2, Trash2, User } from "lucide-react";
import { AcceptBidModal } from "../components/notifications/AcceptBidModal";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { ProductPreviewModal } from "../components/ProductPreviewModal";

interface BidNotification {
    _id: string;
    recipient: string;
    recipientRole: "buyer" | "seller";
    sender: {
        _id: string;
        username: string;
        photo: string;
    };
    type: "bid_placed" | "bid_accepted" | "bid_rejected" | "bid_accepted_share_details" | "bid_accepted_open_chat" | "bid_accepted_wait" | "buyer_responded_contact_shared" | "buyer_responded_open_chat" | "deal_closed" | "item_deleted" | "bid_placed_buyer_copy" | "bid_updated" | "bid_updated_buyer_copy";
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
    metadata?: Record<string, string>;
    isRead: boolean;
    createdAt: string;
}

export default function NotificationsPage() {
    const { user, isBuyerMode } = useAuth();
    const { socket } = useSocket();
    const router = useRouter();
    const [notifications, setNotifications] = useState<BidNotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<"date" | "price">("date");
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [acceptModalOpen, setAcceptModalOpen] = useState(false);
    const [selectedBidForAccept, setSelectedBidForAccept] = useState<{ id: string, amount: number, itemName: string } | null>(null);
    const [isEditingBidId, setIsEditingBidId] = useState<string | null>(null);
    const [editAmount, setEditAmount] = useState<string>("");
    const [previewSlug, setPreviewSlug] = useState<string | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }
        fetchNotifications();
    }, [user, isBuyerMode]);

    // Handle real-time notifications via global socket
    useEffect(() => {
        if (!socket || !user) return;

        const handleNewNotification = (notif: BidNotification) => {
            console.log('[Notifications] New notification received:', notif);
            // Only show if it matches the current role view
            const currentRole = isBuyerMode ? "buyer" : "seller";
            if (notif.recipientRole !== currentRole) return;

            setNotifications(prev => {
                // Replace existing notification for the same bid+type combo to avoid duplicates
                const idx = prev.findIndex(
                    n => n.relatedBid?._id === notif.relatedBid?._id && n.type === notif.type
                );
                if (idx !== -1) {
                    const updated = [...prev];
                    updated[idx] = notif;
                    return updated;
                }
                return [notif, ...prev];
            });

            // Update header badge
            window.dispatchEvent(new Event('notificationsUpdated'));
        };

        socket.on("newNotification", handleNewNotification);

        return () => {
            socket.off("newNotification", handleNewNotification);
        };
    }, [socket, user, isBuyerMode]);

    const fetchNotifications = async () => {
        try {
            const response = await getNotifications(isBuyerMode ? 'buyer' : 'seller');
            if (response.success) {
                setNotifications(response.data as BidNotification[]);
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (bidId: string, status: "accepted" | "rejected", followUp?: string) => {
        if (status === "accepted" && !followUp) {
            const bid = notifications.find(n => n.relatedBid?._id === bidId);
            if (bid) {
                setSelectedBidForAccept({ 
                    id: bidId, 
                    amount: bid.relatedBid?.amount || 0, 
                    itemName: bid.relatedItem?.title || "Item" 
                });
                setAcceptModalOpen(true);
                return;
            }
        }

        setActionLoading(bidId);
        try {
            await updateBidStatus(bidId, status, followUp);
            toast.success(status === "accepted" ? "Bid accepted! Follow-up initiated." : "Bid rejected successfully");
            fetchNotifications();
            window.dispatchEvent(new Event('notificationsUpdated'));
        } catch (err: any) {
            toast.error(err.message || "Action failed");
        } finally {
            setActionLoading(null);
        }
    };

    const handleBuyerResponse = async (bidId: string, action: string) => {
        setActionLoading(bidId + action);
        try {
            await respondToBidAction(bidId, action);
            toast.success(`Response sent successfully: ${action.replace('_', ' ')}`);
            fetchNotifications();
            window.dispatchEvent(new Event('notificationsUpdated'));
        } catch (err: any) {
            toast.error(err.message || "Failed to send response");
        } finally {
            setActionLoading(null);
        }
    };

    const handleUpdateBid = async (bidId: string) => {
        const amount = parseInt(editAmount);
        if (!amount || isNaN(amount)) {
            toast.error("Please enter a valid amount");
            return;
        }

        // Enforce greater bid for reapplies
        const originalNotif = notifications.find(n => n.relatedBid?._id === bidId);
        if (originalNotif && originalNotif.relatedBid?.status === 'rejected') {
            if (amount <= originalNotif.relatedBid.amount) {
                toast.error(`Your new bid must be greater than your previous rejected bid of Rs. ${originalNotif.relatedBid.amount.toLocaleString()}`);
                return;
            }
        }

        setActionLoading(bidId);
        try {
            const { updateBidAction } = await import("../lib/api"); // dynamic import if not in scope
            await updateBidAction(bidId, amount);
            toast.success("Bid updated successfully!");
            setIsEditingBidId(null);
            fetchNotifications();
            window.dispatchEvent(new Event('notificationsUpdated'));
        } catch (err: any) {
            toast.error(err.message || "Failed to update bid");
        } finally {
            setActionLoading(null);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })) as BidNotification[]);
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

    const handleDeleteNotification = async (id: string) => {
        setActionLoading(id + "delete");
        try {
            const { deleteNotificationAction } = await import("../lib/api");
            await deleteNotificationAction(id);
            setNotifications(prev => prev.filter(n => n._id !== id));
            toast.success("Notification deleted");
            window.dispatchEvent(new Event('notificationsUpdated'));
        } catch (err: any) {
            toast.error(err.message || "Failed to delete");
        } finally {
            setActionLoading(null);
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

    const handleProductClick = (e: React.MouseEvent, notification: BidNotification) => {
        if (!isBuyerMode && notification.recipientRole === "seller" && notification.relatedItem) {
            e.preventDefault();
            e.stopPropagation();
            setPreviewSlug(notification.relatedItem.slug);
            setIsPreviewOpen(true);
        }
    };

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
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em] animate-pulse">
                            Tip: You can manage all your active proposals in <Link href="/profile" className="text-primary hover:underline">Profile &gt; My Bids</Link>
                        </p>
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
                                            <Link 
                                                href={`/products/${notification.relatedItem.slug}`} 
                                                className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted border border-primary/5 transition-transform hover:scale-105 active:scale-95"
                                                onClick={(e) => handleProductClick(e, notification)}
                                            >
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
                                                            notification.type.includes("accepted") || notification.type === "deal_closed" ? "bg-green-500/10 text-green-600" :
                                                                notification.type === "item_deleted" ? "bg-orange-500/10 text-orange-600" :
                                                                    "bg-red-500/10 text-red-600"
                                                            }`}>
                                                            {notification.type.replace(/_/g, " ")}
                                                        </Badge>
                                                        <span className="text-[10px] font-bold text-muted-foreground/60 flex items-center gap-1 italic">
                                                            <Clock className="h-3 w-3" />
                                                            {new Date(notification.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-[13px] font-bold text-foreground leading-snug flex items-center flex-wrap gap-x-2">
                                                        {notification.message}
                                                        {(notification.type === "bid_placed_buyer_copy" || notification.type === "bid_updated_buyer_copy") && notification.relatedBid?.status === "pending" && (
                                                            <button 
                                                                onClick={() => {
                                                                    setIsEditingBidId(notification.relatedBid!._id);
                                                                    setEditAmount(notification.relatedBid!.amount.toString());
                                                                }}
                                                                className="text-[10px] font-black text-primary hover:text-primary/80 uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded border border-primary/10 transition-all hover:scale-105 active:scale-95"
                                                            >
                                                                Edit Bid
                                                            </button>
                                                        )}
                                                        {notification.type === "bid_rejected" && notification.relatedBid?.status === "rejected" && (
                                                            <button 
                                                                onClick={() => {
                                                                    setIsEditingBidId(notification.relatedBid!._id);
                                                                    setEditAmount((notification.relatedBid!.amount + 1).toString());
                                                                }}
                                                                className="text-[10px] font-black text-primary hover:text-primary/80 uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded border border-primary/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
                                                            >
                                                                <ArrowUpDown className="h-3 w-3" />
                                                                Reapply
                                                            </button>
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="text-right flex flex-col items-end gap-1 min-w-[80px]">
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => handleDeleteNotification(notification._id)}
                                                            disabled={actionLoading === notification._id + "delete"}
                                                            className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground/40 hover:text-destructive transition-all duration-200 active:scale-90"
                                                            title="Delete notification"
                                                        >
                                                            {actionLoading === notification._id + "delete" ? (
                                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="h-3 w-3" />
                                                            )}
                                                        </button>
                                                        {notification.relatedBid?.amount && (
                                                            <div className="flex flex-col items-end">
                                                                <span className="text-sm font-black text-primary tracking-tighter">
                                                                    Rs. {notification.relatedBid.amount.toLocaleString()}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
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

                                                {/* Editing Inline for Bid */}
                                                {isEditingBidId === notification.relatedBid?._id && (
                                                    <div className="pt-2 animate-in slide-in-from-top-1 duration-200">
                                                        <div className="flex items-center gap-2 max-w-[400px]">
                                                            <div className="relative flex-1 min-w-[150px]">
                                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary">Rs.</span>
                                                                <Input 
                                                                    type="number"
                                                                    value={editAmount}
                                                                    onChange={(e) => setEditAmount(e.target.value)}
                                                                    className="h-8 pl-8 pr-2 text-sm font-bold bg-background/50 border-primary/20 focus:border-primary/50"
                                                                    placeholder="Amount"
                                                                />
                                                            </div>
                                                            <Button 
                                                                size="sm" 
                                                                className="h-7 px-2 text-[9px] font-bold uppercase tracking-widest"
                                                                onClick={() => handleUpdateBid(notification.relatedBid!._id)}
                                                                disabled={actionLoading === notification.relatedBid?._id}
                                                            >
                                                                {actionLoading === notification.relatedBid?._id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
                                                            </Button>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm" 
                                                                className="h-7 px-2 text-[9px] font-bold uppercase tracking-widest"
                                                                onClick={() => setIsEditingBidId(null)}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}

                                            {/* Actions for bid_placed or bid_updated (Seller view) */}
                                            {(notification.type === "bid_placed" || notification.type === "bid_updated") && notification.relatedBid?.status === "pending" && (
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

                                            {/* Specialized Actions for Buyer */}
                                            {notification.type === "bid_accepted_share_details" && notification.metadata && (
                                                <div className="flex items-center gap-2 pt-1">
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline"
                                                        className="h-8 gap-2 border-primary/20 text-primary font-bold text-[10px] uppercase tracking-widest"
                                                        asChild
                                                    >
                                                        <a href={`tel:${notification.metadata.phone}`}>
                                                            <Phone className="h-3 w-3" />
                                                            Contact Seller
                                                        </a>
                                                    </Button>
                                                    <div className="text-[10px] text-muted-foreground italic">
                                                        {notification.metadata.name}: {notification.metadata.phone}
                                                    </div>
                                                </div>
                                            )}

                                            {notification.type === "bid_accepted_wait" && (
                                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleBuyerResponse(notification.relatedBid!._id, "share_details")}
                                                        disabled={actionLoading === notification.relatedBid!._id + "share_details"}
                                                        className="h-8 gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-[10px] uppercase tracking-widest"
                                                    >
                                                        {actionLoading === notification.relatedBid!._id + "share_details" ? <Loader2 className="h-3 w-3 animate-spin" /> : <User className="h-3 w-3" />}
                                                        Send Details
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleBuyerResponse(notification.relatedBid!._id, "open_chat")}
                                                        disabled={actionLoading === notification.relatedBid!._id + "open_chat"}
                                                        className="h-8 gap-2 bg-green-500 hover:bg-green-600 text-white font-bold text-[10px] uppercase tracking-widest"
                                                    >
                                                        {actionLoading === notification.relatedBid!._id + "open_chat" ? <Loader2 className="h-3 w-3 animate-spin" /> : <MessageSquare className="h-3 w-3" />}
                                                        Open Chat
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleBuyerResponse(notification.relatedBid!._id, "close_deal")}
                                                        disabled={actionLoading === notification.relatedBid!._id + "close_deal"}
                                                        className="h-8 gap-2 border-primary/20 text-primary font-bold text-[10px] uppercase tracking-widest"
                                                    >
                                                        {actionLoading === notification.relatedBid!._id + "close_deal" ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                                                        Close Deal
                                                    </Button>
                                                </div>
                                            )}

                                            {/* Info display for shared details from buyer to seller */}
                                            {notification.type === "buyer_responded_contact_shared" && notification.metadata && (
                                                <div className="mt-2 p-2 rounded bg-muted/30 text-[11px]">
                                                    <p className="font-bold">Buyer Details:</p>
                                                    <p>Name: {notification.metadata.name}</p>
                                                    <p>Phone: {notification.metadata.phone}</p>
                                                    <p>Email: {notification.metadata.email}</p>
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

            {selectedBidForAccept && (
                <AcceptBidModal
                    isOpen={acceptModalOpen}
                    onClose={() => {
                        setAcceptModalOpen(false);
                        setSelectedBidForAccept(null);
                    }}
                    onConfirm={async (followUp) => {
                        await handleAction(selectedBidForAccept.id, "accepted", followUp);
                    }}
                    bidAmount={selectedBidForAccept.amount}
                    itemName={selectedBidForAccept.itemName}
                />
            )}

            <ProductPreviewModal 
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                slug={previewSlug || ""}
            />
        </div>
    );
}
