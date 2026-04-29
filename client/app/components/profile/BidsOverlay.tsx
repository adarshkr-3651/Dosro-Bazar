"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { getMyBids, updateBidAction, cancelBidAction } from "@/app/lib/api";
import { Loader2, Gavel, ExternalLink, Clock, CheckCircle2, XCircle, Pencil, Trash2, Check, X } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

interface BidsOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BidsOverlay({ isOpen, onClose }: BidsOverlayProps) {
    const [bids, setBids] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingBidId, setEditingBidId] = useState<string | null>(null);
    const [editAmount, setEditAmount] = useState<string>("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchBids();
        }
    }, [isOpen]);

    const fetchBids = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getMyBids();
            if (response.success) {
                setBids(response.data);
            } else {
                setError(response.message || "Failed to load bids");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBid = async (bidId: string) => {
        setActionLoading(bidId);
        try {
            await cancelBidAction(bidId);
            toast.success("Bid canceled successfully");
            fetchBids();
        } catch (err: any) {
            toast.error(err.message || "Failed to cancel bid");
        } finally {
            setActionLoading(null);
        }
    };

    const handleUpdateBid = async (bidId: string) => {
        const amount = parseFloat(editAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        setActionLoading(bidId);
        try {
            await updateBidAction(bidId, amount);
            toast.success("Bid updated successfully");
            setEditingBidId(null);
            fetchBids();
        } catch (err: any) {
            toast.error(err.message || "Failed to update bid");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden flex flex-col p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <Gavel className="h-6 w-6 text-primary" />
                        My Active Bids
                    </DialogTitle>
                    <DialogDescription>
                        Track the status of your offers on marketplace items.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 p-6 pt-2">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                            <p className="text-muted-foreground text-sm">Loading your bids...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-500 mb-2">Error: {error}</p>
                            <button onClick={fetchBids} className="text-primary text-sm hover:underline">Try again</button>
                        </div>
                    ) : bids.length === 0 ? (
                        <div className="text-center py-12">
                            <Gavel className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <p className="text-muted-foreground">You haven't placed any bids yet.</p>
                            <Link href="/" onClick={onClose} className="text-primary text-sm hover:underline mt-2 inline-block">Browse items</Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bids.map((bid) => (
                                <div key={bid._id} className="group relative flex items-start gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-all">
                                    <div className="relative h-20 w-20 rounded-lg overflow-hidden shrink-0 border">
                                        {bid.item?.images?.[0] ? (
                                            <Image 
                                                src={bid.item.images[0].startsWith('http') ? bid.item.images[0] : `${process.env.NEXT_PUBLIC_API_URL}/${bid.item.images[0]}`}
                                                alt={bid.item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-muted flex items-center justify-center">
                                                <Gavel className="h-8 w-8 text-muted-foreground/30" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                                                {bid.item?.title || "Deleted Item"}
                                            </h4>
                                            <Badge 
                                                variant={bid.status === 'accepted' ? 'default' : bid.status === 'rejected' ? 'destructive' : 'secondary'}
                                                className="capitalize text-[10px] h-5"
                                            >
                                                {bid.status}
                                            </Badge>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            {editingBidId === bid._id ? (
                                                <div className="flex items-center gap-1 animate-in slide-in-from-left-2 duration-300">
                                                    <span className="text-foreground font-bold">Rs.</span>
                                                    <Input 
                                                        type="number" 
                                                        value={editAmount}
                                                        onChange={(e) => setEditAmount(e.target.value)}
                                                        className="h-7 w-24 text-[11px] px-2"
                                                        autoFocus
                                                    />
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className="h-7 w-7 text-green-600 hover:bg-green-50"
                                                        onClick={() => handleUpdateBid(bid._id)}
                                                        disabled={actionLoading === bid._id}
                                                    >
                                                        {actionLoading === bid._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-4 w-4" />}
                                                    </Button>
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className="h-7 w-7 text-red-600 hover:bg-red-50"
                                                        onClick={() => setEditingBidId(null)}
                                                        disabled={actionLoading === bid._id}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="font-semibold text-foreground">Rs. {bid.amount.toLocaleString()}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(bid.createdAt).toLocaleDateString()}
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        <div className="pt-2 flex items-center gap-3">
                                            {bid.item?.slug && (
                                                <Link 
                                                    href={`/products/${bid.item.slug}`} 
                                                    onClick={onClose}
                                                    className="inline-flex items-center gap-1 text-[10px] font-medium text-primary hover:underline"
                                                >
                                                    View Item <ExternalLink className="h-2 w-2" />
                                                </Link>
                                            )}
                                            {bid.status === 'accepted' && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-600">
                                                    <CheckCircle2 className="h-2 w-2" /> Winner
                                                </span>
                                            )}
                                            {bid.status === 'pending' && editingBidId !== bid._id && (
                                                <div className="flex items-center gap-2 ml-auto">
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        className="h-6 px-2 text-[10px] gap-1 hover:bg-primary/5 hover:text-primary"
                                                        onClick={() => {
                                                            setEditingBidId(bid._id);
                                                            setEditAmount(bid.amount.toString());
                                                        }}
                                                    >
                                                        <Pencil className="h-3 w-3" /> Edit
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        className="h-6 px-2 text-[10px] gap-1 hover:bg-red-50 hover:text-red-600"
                                                        onClick={() => handleCancelBid(bid._id)}
                                                        disabled={actionLoading === bid._id}
                                                    >
                                                        {actionLoading === bid._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />} Cancel
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
