"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CheckCircle2, MessageCircle, ShoppingBag, ArrowRight, Wallet, Package } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { toast } from "sonner";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    const type = searchParams.get("type");
    const itemId = searchParams.get("item");
    const amount = searchParams.get("amount"); // Optional

    useEffect(() => {
        setMounted(true);
        // Play a subtle success sound if desired or trigger confetti here
        toast.success("Payment verified successfully!");
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
                <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    {/* Success Icon */}
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                            <div className="relative h-24 w-24 bg-primary rounded-full flex items-center justify-center shadow-2xl">
                                <CheckCircle2 className="h-12 w-12 text-primary-foreground" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black tracking-tight text-foreground">
                                {type === 'boost' ? 'Boost Activated!' : type === 'ad' ? 'Advertisement Confirmed!' : 'Payment Successful!'}
                            </h1>
                            <p className="text-muted-foreground font-medium">
                                {type === 'boost' ? 'Your product is now being promoted across the platform.' : type === 'ad' ? 'Your advertisement is now live on our homepage.' : 'Your advance booking is confirmed.'}
                            </p>
                        </div>
                    </div>

                    {/* Details Card */}
                    <Card className="border-primary/10 shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Package className="h-4 w-4" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Booking Status</span>
                                    </div>
                                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 font-bold uppercase text-[10px]">
                                        {type === 'boost' ? 'Active' : 'Confirmed'}
                                    </Badge>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground font-medium">Transaction Type</span>
                                        <span className="font-bold uppercase text-xs tracking-tighter">
                                            {type === 'boost' ? 'Product Boost' : type === 'ad' ? 'Display Ad' : 'Advance Booking'}
                                        </span>
                                    </div>
                                    {amount && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground font-medium">Amount Paid</span>
                                            <span className="font-bold text-primary">Rs. {Number(amount).toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-primary/5 p-6 border-t border-primary/5">
                                <p className="text-xs text-primary/70 font-semibold leading-relaxed">
                                    {type === 'boost' 
                                        ? 'Your listing will now appear with priority search results and a boost badge for the next 24 hours.' 
                                        : 'The seller has been notified. An automated message with your contact details has been sent to start the conversation.'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <Button 
                            onClick={() => router.push(type === 'boost' ? `/products/${itemId}` : `/messages?itemId=${itemId}`)}
                            className="h-12 w-full gap-2 text-sm font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-lg transition-all active:scale-[0.98]"
                        >
                            {type === 'boost' ? <ArrowRight className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
                            {type === 'boost' ? 'View Boosted Listing' : 'Contact Seller'}
                        </Button>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <Button 
                                variant="outline" 
                                onClick={() => router.push("/")}
                                className="h-11 gap-2 text-xs font-bold uppercase tracking-wider border-primary/10 hover:bg-primary/5 transition-all"
                            >
                                <ShoppingBag className="h-4 w-4" />
                                Home
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => router.push(type === 'boost' ? "/profile?tab=listings" : "/profile?tab=bookings")}
                                className="h-11 gap-2 text-xs font-bold uppercase tracking-wider border-primary/10 hover:bg-primary/5 transition-all"
                            >
                                {type === 'boost' ? <Package className="h-4 w-4" /> : <Wallet className="h-4 w-4" />}
                                {type === 'boost' ? 'My Listings' : 'Bookings'}
                            </Button>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.3em]">
                            Secure Transaction via Dosro Bazar
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><CheckCircle2 className="h-12 w-12 text-primary animate-pulse" /></div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
