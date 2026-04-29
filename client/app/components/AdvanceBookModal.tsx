"use client";

import { useState, useRef } from "react";
import { X, Loader2, Wallet, CheckCircle2 } from "lucide-react";
import { initiateAdvanceBookAction } from "@/app/lib/api";
import { Input } from "@/app/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";

interface AdvanceBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
}

export default function AdvanceBookModal({ isOpen, onClose, product }: AdvanceBookModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'esewa' | 'khalti' | null>(null);
    const esewaFormRef = useRef<HTMLFormElement>(null);
    const [esewaParams, setEsewaParams] = useState<any>(null);

    const hasActiveOffer = product?.offerPrice && product.offerPrice > 0 && (!product.offerExpiresAt || new Date(product.offerExpiresAt) > new Date());
    const effectivePrice = hasActiveOffer ? product.offerPrice : (product?.price || 0);
    const minAdvance = Math.round(effectivePrice * 0.02);
    const [advanceAmount, setAdvanceAmount] = useState<string>(minAdvance.toString());

    // Reset state when modal opens
    if (!isOpen || !product) return null;

    const handleNext = () => {
        if (step === 1) {
            setStep(2);
        }
    };

    const handlePayment = async () => {
        if (!paymentMethod) {
            toast.error("Please select a payment method.");
            return;
        }

        const parsedAmount = parseInt(advanceAmount) || 0;
        if (parsedAmount < minAdvance) {
            toast.error(`Minimum advance amount is Rs. ${minAdvance.toLocaleString()} (2%)`);
            return;
        }

        setLoading(true);
        try {
            const res = await initiateAdvanceBookAction(product._id, paymentMethod, parsedAmount);
            
            if (res.success) {
                if (paymentMethod === 'esewa') {
                    setEsewaParams(res.parameters);
                    // Wait for state to update, then submit form
                    setTimeout(() => esewaFormRef.current?.submit(), 100);
                } else if (paymentMethod === 'khalti') {
                    toast.info("Redirecting to Khalti...");
                    if (res.payment_url) {
                        window.location.href = res.payment_url;
                    } else {
                        toast.error("Khalti payment URL not found.");
                        setLoading(false);
                    }
                }
            } else {
                toast.error(res.error || "Failed to initiate payment");
                setLoading(false);
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong.");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
            {/* Hidden eSewa form for auto-submission */}
            {esewaParams && (
                <form ref={esewaFormRef} action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST" className="hidden">
                    {Object.entries(esewaParams).map(([key, value]) => (
                        <input key={key} type="hidden" name={key} value={value as string} />
                    ))}
                </form>
            )}

            <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl border overflow-hidden relative animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground transition-all z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6 md:p-8 space-y-6">
                    <div className="space-y-6">
                        <div className="space-y-2 text-center mt-2">
                            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Confirm Booking</h2>
                            <p className="text-sm text-muted-foreground">Secure this item by paying a 2% advance.</p>
                            <p className="text-[10px] text-primary font-medium bg-primary/5 py-1 px-3 rounded-full inline-block">
                                Don&apos;t worry, we will transfer this amount to the seller only after your confirmation.
                            </p>
                        </div>

                        <div className="p-4 bg-muted/30 rounded-2xl border border-primary/10 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0 border">
                                    <Image
                                        src={product.images?.[0] || product.image || "/placeholder.jpg"}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-sm truncate">{product.title}</p>
                                    <p className="text-xs text-muted-foreground">Seller: {product.author?.username}</p>
                                </div>
                            </div>
                            <div className="h-px bg-border/50 my-2" />
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Item Price {hasActiveOffer && <span className="text-[10px] text-red-500 font-bold uppercase">(Offer)</span>}</span>
                                <span className="font-semibold text-primary">Rs. {effectivePrice.toLocaleString()}</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <span className="font-bold text-primary flex items-center gap-2">Advance Amount</span>
                                    <span className="text-xs text-muted-foreground font-medium">Min: 2% (Rs. {minAdvance.toLocaleString()})</span>
                                </div>
                                <div className="relative group/input">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-bold text-xs uppercase tracking-widest z-10">Rs.</div>
                                    <Input
                                        type="number"
                                        min={minAdvance}
                                        value={advanceAmount}
                                        onChange={(e) => setAdvanceAmount(e.target.value)}
                                        className="h-12 pl-10 pr-3 bg-background border-primary/20 focus:border-primary/50 text-lg font-black tracking-tight"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setPaymentMethod('esewa')}
                                className={`h-16 rounded-2xl border-2 flex items-center justify-center transition-all ${
                                    paymentMethod === 'esewa' ? 'border-[#60bb46] bg-[#60bb46]/5 shadow-md' : 'border-border hover:border-[#60bb46]/30'
                                }`}
                            >
                                <span className="font-black text-[#60bb46] text-lg">eSewa</span>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('khalti')}
                                className={`h-16 rounded-2xl border-2 flex items-center justify-center transition-all ${
                                    paymentMethod === 'khalti' ? 'border-[#5C2D91] bg-[#5C2D91]/5 shadow-md' : 'border-border hover:border-[#5C2D91]/30'
                                }`}
                            >
                                <span className="font-black text-[#5C2D91] text-lg">Khalti</span>
                            </button>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={loading || !paymentMethod}
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Pay Securely"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
