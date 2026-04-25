"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { User, MessageCircle, Clock, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";

interface AcceptBidModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (followUp: "share_details" | "open_chat" | "wait") => Promise<void>;
    bidAmount: number;
    itemName: string;
}

export function AcceptBidModal({ isOpen, onClose, onConfirm, bidAmount, itemName }: AcceptBidModalProps) {
    const [loading, setLoading] = useState<string | null>(null);

    const handleSelect = async (followUp: "share_details" | "open_chat" | "wait") => {
        setLoading(followUp);
        try {
            await onConfirm(followUp);
            onClose();
        } catch (error) {
            console.error("Failed to confirm acceptance follow-up", error);
        } finally {
            setLoading(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black italic">Accept Bid - Rs. {bidAmount.toLocaleString()}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        You are accepting the bid for <span className="font-bold text-foreground">"{itemName}"</span>. 
                        Please choose how you'd like to proceed with the buyer.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <Card 
                        className="cursor-pointer transition-all hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
                        onClick={() => !loading && handleSelect("share_details")}
                    >
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                                <User className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-sm">Share Personal Details</p>
                                <p className="text-xs text-muted-foreground">Share your name, phone, and email automatically.</p>
                            </div>
                            {loading === "share_details" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                        </CardContent>
                    </Card>

                    <Card 
                        className="cursor-pointer transition-all hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
                        onClick={() => !loading && handleSelect("open_chat")}
                    >
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                                <MessageCircle className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-sm">Open Chat with Buyer</p>
                                <p className="text-xs text-muted-foreground">Accept bid and start a conversation immediately.</p>
                            </div>
                            {loading === "open_chat" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                        </CardContent>
                    </Card>

                    <Card 
                        className="cursor-pointer transition-all hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
                        onClick={() => !loading && handleSelect("wait")}
                    >
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-sm">Wait for Buyer Response</p>
                                <p className="text-xs text-muted-foreground">Notify buyer and let them choose the next step.</p>
                            </div>
                            {loading === "wait" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                        </CardContent>
                    </Card>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} disabled={!!loading}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
