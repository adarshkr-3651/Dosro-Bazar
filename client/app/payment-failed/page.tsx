"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { XCircle, RefreshCw, ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";

function PaymentFailedContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [seconds, setSeconds] = useState(5);
    const [progress, setProgress] = useState(100);

    const reason = searchParams.get("reason") || searchParams.get("error");
    const itemId = searchParams.get("item");

    useEffect(() => {
        const duration = 5000;
        const interval = 100;
        const totalSteps = duration / interval;
        const stepSize = 100 / totalSteps;

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev - stepSize;
                return next <= 0 ? 0 : next;
            });
        }, interval);

        const countdown = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    // Add a small buffer for the animation to finish
                    setTimeout(() => {
                        if (itemId) {
                            router.push(`/products/${itemId}`);
                        } else {
                            router.push("/");
                        }
                    }, 500);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
            clearInterval(countdown);
        };
    }, [router, itemId]);

    const getErrorMessage = () => {
        switch (reason) {
            case "incomplete":
                return "The payment was not completed. Please try again.";
            case "booking_not_found":
                return "We couldn't find the booking record. Please contact support.";
            case "verification_error":
                return "There was an error verifying your payment with the gateway.";
            case "missing_data":
                return "Payment data is missing. Please restart the process.";
            case "no_data":
                return "No payment data received from the gateway.";
            case "not_complete":
                return "The transaction was not completed successfully.";
            default:
                return "An unexpected error occurred during the payment process.";
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-background">
            {/* Background decorative elements to simulate depth */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none filter blur-[100px]">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-destructive rounded-full animate-pulse delay-700" />
            </div>

            {/* Main Overlay */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
                <div className="max-w-md w-full animate-in zoom-in-95 fade-in duration-500">
                    <Card className="border-none shadow-2xl bg-card overflow-hidden ring-1 ring-white/10">
                        {/* Header Section */}
                        <div className="bg-destructive p-8 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            <div className="relative z-10 flex flex-col items-center gap-4">
                                <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
                                    <XCircle className="h-10 w-10 text-white" />
                                </div>
                                <div className="space-y-1">
                                    <h1 className="text-2xl font-black text-white tracking-tight uppercase">Payment Failed</h1>
                                    <p className="text-destructive-foreground/90 text-[10px] font-bold uppercase tracking-[0.25em]">Transaction Aborted</p>
                                </div>
                            </div>
                        </div>

                        <CardContent className="p-8 space-y-8">
                            {/* Error Details */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">
                                    <ShieldAlert className="h-3 w-3 text-destructive" />
                                    Security Status
                                </div>
                                <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10">
                                    <p className="text-sm font-medium text-foreground leading-relaxed">
                                        {getErrorMessage()}
                                    </p>
                                </div>
                            </div>

                            {/* Redirect Info */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                    <span className="flex items-center gap-2">
                                        <div className="h-1 w-1 bg-destructive rounded-full animate-ping" />
                                        Auto-Redirecting
                                    </span>
                                    <span className="text-destructive tabular-nums bg-destructive/10 px-2 py-0.5 rounded-full">{seconds}s</span>
                                </div>
                                <Progress value={progress} className="h-1 bg-muted overflow-hidden" />
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <Button 
                                    onClick={() => itemId ? router.push(`/products/${itemId}`) : router.push("/")}
                                    className="h-12 gap-2 text-xs font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all bg-primary hover:bg-primary/90"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Retry
                                </Button>
                                
                                <Button 
                                    variant="outline" 
                                    onClick={() => router.back()}
                                    className="h-12 gap-2 text-xs font-bold uppercase tracking-widest border-2 active:scale-95 transition-all hover:bg-muted"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back
                                </Button>
                            </div>
                        </CardContent>

                        {/* Footer decorative line */}
                        <div className="h-1 bg-gradient-to-r from-transparent via-destructive to-transparent opacity-20" />
                    </Card>
                    
                    <div className="mt-6 text-center">
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.4em] drop-shadow-sm">
                            Safe Transfer Protocol • Dosro Bazar
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PaymentFailedPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary opacity-50" />
            </div>
        }>
            <PaymentFailedContent />
        </Suspense>
    );
}

