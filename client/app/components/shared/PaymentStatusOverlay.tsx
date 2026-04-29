"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { CheckCircle2, XCircle, MessageCircle, ShoppingBag, ArrowRight, Package, Wallet, AlertTriangle, User } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";

export default function PaymentStatusOverlay() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<"success" | "failed" | null>(null);

    const type = searchParams.get("type");
    const plan = searchParams.get("plan");
    const expiry = searchParams.get("expiry");
    const itemId = searchParams.get("item");
    const amount = searchParams.get("amount");
    const isFlagged = searchParams.get('flagged') === 'true';

    useEffect(() => {
        const success = searchParams.get("payment_success") === "true";
        const failed = searchParams.get("payment_failed") === "true";

        if (success) {
            // Do not show the full-screen overlay for advertisements
            // These are handled by the HeroBanner component's toast notifications
            if (type === 'ad') return;

            setStatus("success");
            setIsOpen(true);

            // Auto-close after 3 seconds ONLY for clean advertisement bookings
            // If flagged, we keep it open so the user can read the "Under Review" notice
            if (type === 'ad' && !isFlagged) {
                const timer = setTimeout(() => {
                    handleClose();
                }, 3000);
                return () => clearTimeout(timer);
            }
        } else if (failed) {
            setStatus("failed");
            setIsOpen(true);
        }
    }, [searchParams, type]);

    const handleClose = () => {
        setIsOpen(false);
        // Clean up URL
        const params = new URLSearchParams(searchParams.toString());
        params.delete("payment_success");
        params.delete("payment_failed");
        params.delete("type");
        params.delete("plan");
        params.delete("expiry");
        params.delete("item");
        params.delete("amount");
        params.delete("flagged");

        const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
        window.history.replaceState({}, '', newUrl);
    };

    if (!status) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden bg-background border-none shadow-2xl">
                <div className={`p-8 text-center space-y-4 ${status === 'success' ? 'bg-gradient-to-b from-emerald-500/10 to-transparent' : 'bg-gradient-to-b from-rose-500/10 to-transparent'}`}>
                    <div className="relative mx-auto w-20 h-20">
                        <div className={`absolute inset-0 rounded-full blur-2xl animate-pulse ${status === 'success' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`} />
                        <div className={`relative h-full w-full rounded-full flex items-center justify-center shadow-lg ${status === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                            {status === 'success' ? <CheckCircle2 className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <DialogTitle className="text-2xl font-black tracking-tight">
                            {status === 'success'
                                ? (isFlagged ? 'Under Review' : (type === 'boost' ? 'Boost Activated!' : type === 'ad' ? 'Advertisement Confirmed!' : 'Payment Successful!'))
                                : 'Payment Failed'}
                        </DialogTitle>
                        <DialogDescription className="font-medium">
                            {status === 'success'
                                ? (isFlagged ? 'Your advertisement image is being reviewed by our team due to policy concerns.' : (type === 'boost' ? 'Your product is now being promoted.' : type === 'ad' ? 'Your advertisement is now live on our homepage.' : 'Your advance booking is confirmed.'))
                                : 'Something went wrong with your transaction. Please try again.'}
                        </DialogDescription>
                    </div>
                </div>

                <div className="p-8 pt-0 space-y-6">
                    {status === 'success' && (
                        <Card className="border-primary/10 shadow-sm bg-muted/30">
                            <CardContent className="p-4 space-y-3">
                                {isFlagged ? (
                                    <div className="flex gap-3 text-left p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                                        <p className="text-[11px] font-bold text-amber-700 leading-tight">
                                            AD UNDER REVIEW: This image does not follow our policies. We will contact you soon.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground font-bold uppercase tracking-wider">Transaction</span>
                                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-black text-[10px]">
                                                CONFIRMED
                                            </Badge>
                                        </div>
                                        <div className="space-y-2 pt-1">
                                            <div className="flex justify-between text-sm font-medium">
                                                <span className="text-muted-foreground">Type</span>
                                                <span className="font-bold">
                                                    {type === 'boost' ? `Boost (${plan})` : type === 'ad' ? `Display Ad (${plan})` : 'Advance Booking'}
                                                </span>
                                            </div>
                                            {amount && (
                                                <div className="flex justify-between text-sm font-medium">
                                                    <span className="text-muted-foreground">Amount</span>
                                                    <span className="font-bold text-primary">Rs. {Number(amount).toLocaleString()}</span>
                                                </div>
                                            )}
                                            {expiry && (
                                                <div className="flex justify-between text-sm font-medium">
                                                    <span className="text-muted-foreground">Expires</span>
                                                    <span className="font-bold text-primary">{expiry}</span>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex flex-col gap-3">
                        {status === 'success' ? (
                            <>
                                <Button
                                    onClick={() => {
                                        handleClose();
                                        if (type === 'ad') {
                                            router.push("/");
                                        } else {
                                            router.push(type === 'boost' ? `/products/${itemId}` : `/messages?itemId=${itemId}`);
                                        }
                                    }}
                                    className="h-12 w-full gap-2 text-sm font-bold uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                                >
                                    {type === 'ad' ? <ShoppingBag className="h-4 w-4" /> : (type === 'boost' ? <ArrowRight className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />)}
                                    {type === 'ad' ? 'Continue Shopping' : (type === 'boost' ? 'View Listing' : 'Contact Seller')}
                                </Button>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" onClick={handleClose} className="h-11 font-bold text-xs uppercase tracking-wider">
                                        <ShoppingBag className="h-4 w-4 mr-2" /> Home
                                    </Button>
                                    <Button variant="outline" onClick={() => {
                                        handleClose();
                                        router.push(type === 'boost' ? "/profile?tab=listings" : type === 'ad' ? "/profile" : "/profile?tab=bookings");
                                    }} className="h-11 font-bold text-xs uppercase tracking-wider">
                                        {type === 'boost' ? <Package className="h-4 w-4 mr-2" /> : type === 'ad' ? <User className="h-4 w-4 mr-2" /> : <Wallet className="h-4 w-4 mr-2" />}
                                        {type === 'boost' ? 'Listings' : type === 'ad' ? 'Profile' : 'Bookings'}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <Button onClick={handleClose} className="h-12 w-full font-bold uppercase tracking-widest">
                                Close and Try Again
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
