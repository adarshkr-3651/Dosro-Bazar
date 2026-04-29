"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { Star, MessageSquare, Loader2, UserCircle, Calendar } from "lucide-react";
import { getSellerReviews } from "@/app/lib/api";
import Image from "next/image";
import { Badge } from "@/app/components/ui/badge";

interface SellerReviewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    sellerId: string;
    sellerName: string;
}

export function SellerReviewsModal({ isOpen, onClose, sellerId, sellerName }: SellerReviewsModalProps) {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && sellerId) {
            fetchReviews();
        }
    }, [isOpen, sellerId]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await getSellerReviews(sellerId);
            if (res.success) {
                setReviews(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-card border shadow-2xl">
                <DialogHeader className="p-6 border-b border-primary/5 bg-muted/20">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                            <Star className="w-6 h-6 text-amber-500 fill-current" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold tracking-tight">Seller Reviews</DialogTitle>
                            <DialogDescription className="text-xs uppercase tracking-widest font-bold text-muted-foreground/60">
                                Feedback for {sellerName}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-primary/20" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Loading Reviews...</p>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="py-20 text-center space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                <MessageSquare className="w-8 h-8 text-muted-foreground/20" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">No reviews yet for this seller.</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review._id} className="p-4 rounded-2xl border bg-muted/10 space-y-3 hover:border-primary/20 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted border">
                                            {review.buyer?.photo ? (
                                                <Image src={review.buyer.photo} alt={review.buyer.username} fill className="object-cover" />
                                            ) : (
                                                <UserCircle className="w-full h-full text-muted-foreground/40" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">{review.buyer?.username || "Anonymous"}</p>
                                            <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                                                <Calendar className="w-2.5 h-2.5" />
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 gap-1 h-6 text-[10px] font-black">
                                        <Star className="w-2.5 h-2.5 fill-current" />
                                        {review.rating.toFixed(1)}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                                        &quot;{review.comment || "No comment provided."}&quot;
                                    </p>
                                    {review.item && (
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-primary/40">
                                            Bought: {review.item.title}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 bg-muted/20 border-t border-primary/5 flex justify-center">
                    <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">
                        Verified Transactions Only
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
