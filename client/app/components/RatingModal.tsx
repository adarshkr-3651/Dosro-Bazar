"use client";

import { useState } from "react";
import { Star, X, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { addReview, markSingleNotificationAsRead } from "../lib/api";

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    sellerName: string;
    sellerId: string;
    itemId: string;
    itemName: string;
    invoiceId: string;
    notificationId: string;
}

export default function RatingModal({ isOpen, onClose, sellerName, sellerId, itemId, itemName, invoiceId, notificationId }: RatingModalProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSkip = async () => {
        if (notificationId) {
            try {
                await markSingleNotificationAsRead(notificationId);
                window.dispatchEvent(new CustomEvent('notificationsUpdated'));
            } catch (e) {
                console.error("Failed to mark notification as read", e);
            }
        }
        onClose();
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a star rating");
            return;
        }

        setLoading(true);
        try {
            const res = await addReview({
                itemId,
                sellerId,
                rating,
                comment,
                invoiceId
            });

            if (res.success) {
                toast.success(`Thank you for rating ${sellerName}!`);
                
                // Mark the deal_closed notification as read so it doesn't prompt again
                if (notificationId) {
                    try {
                        await markSingleNotificationAsRead(notificationId);
                        // Optional: trigger header update
                        window.dispatchEvent(new CustomEvent('notificationsUpdated'));
                    } catch (e) {
                        console.error("Failed to mark notification as read", e);
                    }
                }
                
                onClose();
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to submit review");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md shadow-2xl border-none p-0 overflow-hidden rounded-2xl">
                <div className="bg-background p-6">
                    <DialogHeader className="pb-2">
                        <DialogTitle className="text-2xl font-black italic flex items-center gap-2">
                            Rate Your Experience
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground pt-1">
                            How was your experience for <span className="font-bold text-foreground">"{itemName}"</span> with <span className="font-bold text-primary">{sellerName}</span>?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-8 pt-6 pb-2">
                        {/* Stars */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                        className="transition-transform active:scale-90 hover:scale-110"
                                    >
                                        <Star 
                                            className={`h-10 w-10 ${
                                                (hoverRating || rating) >= star 
                                                    ? "fill-yellow-400 text-yellow-400" 
                                                    : "text-muted-foreground/20"
                                            } transition-colors duration-200`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 h-4">
                                {rating === 5 ? "Excellent! 🌟" : 
                                 rating === 4 ? "Very Good! ✨" :
                                 rating === 3 ? "Good! 👍" :
                                 rating === 2 ? "Could be better 😕" :
                                 rating === 1 ? "Disappointing 😞" : ""}
                            </span>
                        </div>

                        {/* Comment */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Share your feedback (Optional)</label>
                            <Input 
                                placeholder="Write a brief comment about the seller..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="h-12 bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl px-4"
                            />
                        </div>

                        <div className="flex flex-col gap-3 pt-2">
                            <Button 
                                className="w-full h-12 font-black uppercase tracking-[0.2em] rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98]"
                                onClick={handleSubmit}
                                disabled={loading || rating === 0}
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Submit Review
                            </Button>
                            <Button 
                                variant="ghost" 
                                className="w-full h-10 text-[10px] uppercase tracking-[0.3em] font-black text-muted-foreground/60 hover:text-foreground transition-colors"
                                onClick={handleSkip}
                            >
                                Skip for now
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
