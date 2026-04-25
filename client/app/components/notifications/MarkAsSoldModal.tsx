"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { CheckCircle2, Loader2, User, CreditCard } from "lucide-react";
import { getAcceptedBidders, markProductAsSold } from "@/app/lib/api";
import { toast } from "sonner";
import { Card, CardContent } from "@/app/components/ui/card";
import Image from "next/image";

interface Buyer {
    _id: string;
    username: string;
    photo: string;
    email: string;
    phone: string;
}

interface MarkAsSoldModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: string;
    productTitle: string;
    productPrice: number;
    onSuccess: () => void;
}

export function MarkAsSoldModal({ isOpen, onClose, productId, productTitle, productPrice, onSuccess }: MarkAsSoldModalProps) {
    const [loading, setLoading] = useState(false);
    const [bidders, setBidders] = useState<Buyer[]>([]);
    const [selectedBuyer, setSelectedBuyer] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && productId) {
            fetchBidders();
        }
    }, [isOpen, productId]);

    const fetchBidders = async () => {
        setLoading(true);
        try {
            const response = await getAcceptedBidders(productId);
            setBidders(response.data);
            if (response.data.length === 1) {
                setSelectedBuyer(response.data[0]._id);
            }
        } catch (error) {
            toast.error("Failed to fetch buyers");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        if (!selectedBuyer) {
            toast.error("Please select a buyer");
            return;
        }

        setSubmitting(true);
        try {
            await markProductAsSold(productId, selectedBuyer, productPrice);
            toast.success("Product marked as sold! Invoice sent to chat.");
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to mark as sold");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black italic flex items-center gap-2">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                        Mark as Sold
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Select the buyer who purchased <span className="font-bold text-foreground">"{productTitle}"</span>.
                        An invoice will be generated and sent to both of you via chat.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : bidders.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="p-6 text-center text-muted-foreground">
                                <p className="text-sm font-medium">No accepted bids found.</p>
                                <p className="text-xs">You can only mark as sold to buyers whose bids you've accepted.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2">
                            {bidders.map((buyer) => (
                                <Card 
                                    key={buyer._id}
                                    className={`cursor-pointer transition-all hover:border-primary/50 ${selectedBuyer === buyer._id ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''}`}
                                    onClick={() => setSelectedBuyer(buyer._id)}
                                >
                                    <CardContent className="p-3 flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-muted overflow-hidden relative border">
                                            {buyer.photo && buyer.photo !== 'user.png' ? (
                                                <Image 
                                                    src={buyer.photo.startsWith('http') ? buyer.photo : `/uploads/users/${buyer.photo}`}
                                                    alt={buyer.username}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center font-bold text-muted-foreground">
                                                    {buyer.username[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate">{buyer.username}</p>
                                            <p className="text-[10px] text-muted-foreground truncate">{buyer.email}</p>
                                        </div>
                                        {selectedBuyer === buyer._id && (
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    <div className="p-4 rounded-xl bg-muted/30 border space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Final Price:</span>
                            <span className="font-black text-primary">Rs. {productPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <CreditCard className="h-3 w-3" />
                            <span>This will generate a formal invoice and close all other active bids.</span>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} disabled={submitting}>Cancel</Button>
                    <Button 
                        onClick={handleConfirm} 
                        disabled={submitting || !selectedBuyer || bidders.length === 0}
                        className="gap-2 rounded-xl"
                    >
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        Confirm Sale
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
