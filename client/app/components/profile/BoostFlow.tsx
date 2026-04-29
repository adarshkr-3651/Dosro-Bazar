"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { getMyListings, initiateBoostAction } from "@/app/lib/api";
import { Loader2, Rocket, Check, Zap, Sparkles, Trophy, CreditCard, ChevronRight, AlertCircle, ShoppingBag } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import Image from "next/image";
import { toast } from "sonner";

interface BoostFlowProps {
    isOpen: boolean;
    onClose: () => void;
    initialItemId?: string | null;
}

const PLANS = [
    {
        id: "59",
        name: "Silver Reach",
        price: 59,
        description: "Boost your product to 2x more buyers in your local zone.",
        features: ["Local zone priority", "Active for 24 hours", "Standard visibility"],
        icon: <Zap className="h-5 w-5 text-slate-400" />,
        color: "from-slate-400/20 to-transparent",
        borderColor: "border-slate-200 dark:border-slate-800"
    },
    {
        id: "99",
        name: "Gold Exposure",
        price: 99,
        description: "Get 5x more views and appear in 'Recommended' across all cities.",
        features: ["City-wide reach", "Active for 24 hours", "High visibility badge", "Recommended section"],
        icon: <Sparkles className="h-5 w-5 text-amber-500" />,
        color: "from-amber-500/20 to-transparent",
        borderColor: "border-amber-200 dark:border-amber-900/50",
        popular: true
    },
    {
        id: "199",
        name: "Diamond Elite",
        price: 199,
        description: "Maximum reach. Front page priority and instant notification to interested buyers.",
        features: ["Nationwide reach", "Active for 24 hours", "Top search priority", "Push notifications", "Premium analytics"],
        icon: <Trophy className="h-5 w-5 text-blue-500" />,
        color: "from-blue-500/20 to-transparent",
        borderColor: "border-blue-200 dark:border-blue-900/50"
    }
];

export default function BoostFlow({ isOpen, onClose, initialItemId }: BoostFlowProps) {
    const [step, setStep] = useState<"prompt" | "select" | "payment">("select");
    const [selectedItemId, setSelectedItemId] = useState<string | null>(initialItemId || null);
    const [selectedPlan, setSelectedPlan] = useState<string>("99");
    const [listings, setListings] = useState<any[]>([]);
    const [loadingListings, setLoadingListings] = useState(false);
    const [initiating, setInitiating] = useState(false);
    const [esewaParams, setEsewaParams] = useState<any>(null);
    const esewaFormRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (initialItemId) {
                setSelectedItemId(initialItemId);
                setStep("prompt");
                // Also fetch listings to get the item details for the prompt if needed
                fetchListings();
            } else {
                setStep("select");
                fetchListings();
            }
        }
    }, [isOpen, initialItemId]);

    const fetchListings = async () => {
        setLoadingListings(true);
        try {
            const response = await getMyListings();
            if (response.success) {
                // Only show active, non-boosted items (or allow re-boosting)
                setListings(response.data.filter((item: any) => item.status === "active"));
            }
        } catch (error) {
            console.error("Failed to fetch listings:", error);
        } finally {
            setLoadingListings(false);
        }
    };

    const handleInitiateBoost = async (paymentMethod: "esewa" | "khalti") => {
        if (!selectedItemId) return;
        
        setInitiating(true);
        try {
            const response = await initiateBoostAction(selectedItemId, selectedPlan, paymentMethod);
            if (response.success) {
                if (paymentMethod === "esewa" && response.parameters) {
                    setEsewaParams(response.parameters);
                    // Wait for state to update, then submit form
                    setTimeout(() => esewaFormRef.current?.submit(), 100);
                } else if (paymentMethod === "khalti" && response.payment_url) {
                    window.location.href = response.payment_url;
                }
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to initiate payment");
        } finally {
            setInitiating(false);
        }
    };

    const selectedItem = listings.find(l => l._id === selectedItemId);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-background border shadow-2xl">
                {/* Hidden eSewa form for auto-submission */}
                {esewaParams && (
                    <form ref={esewaFormRef} action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST" className="hidden">
                        {Object.entries(esewaParams).map(([key, value]) => (
                            <input key={key} type="hidden" name={key} value={value as string} />
                        ))}
                    </form>
                )}

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-muted flex">
                    <div className={`h-full bg-primary transition-all duration-500 ${
                        step === "prompt" ? "w-1/3" : step === "select" ? "w-2/3" : "w-full"
                    }`} />
                </div>

                <div className="p-6">
                    {step === "prompt" && (
                        <div className="space-y-6 py-4 animate-in fade-in zoom-in duration-300">
                            <div className="text-center space-y-4">
                                <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                                </div>
                                <DialogHeader>
                                    <DialogTitle className="text-3xl font-black tracking-tight text-center">Boost Your Sale!</DialogTitle>
                                    <DialogDescription className="text-base text-muted-foreground leading-relaxed text-center">
                                        Your item is now live. Do you want to boost it to reach <span className="text-primary font-bold">10x more buyers</span> and sell it today?
                                    </DialogDescription>
                                </DialogHeader>
                            </div>

                            {selectedItem && (
                                <div className="p-4 rounded-2xl border bg-muted/30 flex items-center gap-4">
                                    <div className="relative h-16 w-16 rounded-xl overflow-hidden border shadow-sm">
                                        <Image 
                                            src={selectedItem.images[0].startsWith('http') ? selectedItem.images[0] : `${process.env.NEXT_PUBLIC_API_URL}/${selectedItem.images[0]}`}
                                            alt={selectedItem.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-sm truncate uppercase tracking-tight">{selectedItem.title}</p>
                                        <p className="text-xs text-primary font-bold">Rs. {selectedItem.price.toLocaleString()}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-3">
                                <Button 
                                    className="h-14 text-lg font-black w-full rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" 
                                    onClick={() => setStep("payment")}
                                >
                                    Yes, Show Me Plans <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    className="h-12 w-full rounded-xl text-muted-foreground font-bold hover:bg-destructive/5 hover:text-destructive transition-colors" 
                                    onClick={onClose}
                                >
                                    No, thanks
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === "select" && (
                        <div className="space-y-6">
                            <div className="text-center space-y-4">
                                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Rocket className="h-8 w-8 text-primary" />
                                </div>
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black tracking-tight text-center">Boost Your Product Reach</DialogTitle>
                                    <DialogDescription className="text-muted-foreground leading-relaxed text-center">
                                        Reach thousands of potential buyers across every zone. Boosted items get 10x more engagement and sell 3x faster!
                                    </DialogDescription>
                                </DialogHeader>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-bold flex items-center gap-2">
                                    <ShoppingBag className="h-4 w-4 text-primary" />
                                    {initialItemId ? "Boosting current item" : "Select a product to boost"}
                                </h4>
                                
                                <ScrollArea className={`${initialItemId ? 'h-auto' : 'h-[250px]'} rounded-xl border bg-muted/20 p-4`}>
                                    {loadingListings ? (
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
                                        </div>
                                    ) : (initialItemId && selectedItem) ? (
                                        <div className="flex items-center gap-4 p-3 rounded-xl border border-primary bg-primary/5 ring-1 ring-primary/20">
                                            <div className="relative h-14 w-14 rounded-lg overflow-hidden shrink-0 border">
                                                <Image 
                                                    src={selectedItem.images[0].startsWith('http') ? selectedItem.images[0] : `${process.env.NEXT_PUBLIC_API_URL}/${selectedItem.images[0]}`}
                                                    alt={selectedItem.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm truncate">{selectedItem.title}</p>
                                                <p className="text-xs text-primary font-semibold">Rs. {selectedItem.price.toLocaleString()}</p>
                                            </div>
                                            <Badge variant="outline" className="text-[10px] border-primary/20 text-primary">Pre-selected</Badge>
                                        </div>
                                    ) : listings.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-sm text-muted-foreground">No active listings found.</p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-3">
                                            {listings.map((item) => (
                                                <div 
                                                    key={item._id}
                                                    onClick={() => setSelectedItemId(item._id)}
                                                    className={`flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer hover:border-primary/50 group ${selectedItemId === item._id ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'bg-card'}`}
                                                >
                                                    <div className="relative h-14 w-14 rounded-lg overflow-hidden shrink-0 border">
                                                        <Image 
                                                            src={item.images[0].startsWith('http') ? item.images[0] : `${process.env.NEXT_PUBLIC_API_URL}/${item.images[0]}`}
                                                            alt={item.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-sm truncate">{item.title}</p>
                                                        <p className="text-xs text-primary font-semibold">Rs. {item.price.toLocaleString()}</p>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedItemId === item._id ? 'border-primary bg-primary' : 'border-muted-foreground/20 group-hover:border-primary/30'}`}>
                                                        {selectedItemId === item._id && <Check className="h-3 w-3 text-primary-foreground" />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </div>

                            <div className="pt-2 flex flex-col gap-3">
                                <Button 
                                    className="h-12 text-lg font-bold w-full" 
                                    disabled={!selectedItemId} 
                                    onClick={() => setStep("payment")}
                                >
                                    Choose Plan & Pay <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                                <Button variant="ghost" className="h-12 w-full" onClick={onClose}>
                                    Maybe later
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === "payment" && (
                        <div className="space-y-6">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-primary" />
                                    Choose Plan & Pay
                                </DialogTitle>
                                <DialogDescription>
                                    Select a boost level and pick your preferred payment gateway.
                                </DialogDescription>
                            </DialogHeader>

                            <ScrollArea className="h-[280px] pr-4 -mr-4">
                                <div className="grid gap-3">
                                    {PLANS.map((plan) => (
                                        <div 
                                            key={plan.id}
                                            onClick={() => setSelectedPlan(plan.id)}
                                            className={`relative overflow-hidden rounded-xl border p-4 transition-all cursor-pointer group ${selectedPlan === plan.id ? 'border-primary bg-primary/[0.03] ring-1 ring-primary/20' : 'bg-card hover:border-primary/30'}`}
                                        >
                                            <div className="relative flex items-center gap-4">
                                                <div className={`p-2 rounded-lg bg-background border ${plan.borderColor} group-hover:scale-110 transition-transform`}>
                                                    {plan.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-bold text-sm">{plan.name}</h4>
                                                        <p className="text-sm font-black">Rs. {plan.price}</p>
                                                    </div>
                                                    <p className="text-[10px] text-muted-foreground truncate">{plan.description}</p>
                                                </div>
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPlan === plan.id ? 'border-primary bg-primary' : 'border-muted-foreground/20'}`}>
                                                    {selectedPlan === plan.id && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    <span>Select Gateway</span>
                                    <span className="text-primary">Total: Rs. {PLANS.find(p => p.id === selectedPlan)?.price}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        disabled={initiating}
                                        onClick={() => handleInitiateBoost("esewa")}
                                        className="group relative flex flex-col items-center justify-center gap-1 p-4 rounded-2xl border-2 border-[#60bb46]/20 bg-[#60bb46]/5 hover:bg-[#60bb46]/10 hover:border-[#60bb46]/40 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        <div className="h-10 w-full flex items-center justify-center">
                                            <span className="text-2xl font-black text-[#60bb46] tracking-tighter">eSewa</span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#60bb46]/60">Digital Wallet</span>
                                    </button>

                                    <button 
                                        disabled={initiating}
                                        onClick={() => handleInitiateBoost("khalti")}
                                        className="group relative flex flex-col items-center justify-center gap-1 p-4 rounded-2xl border-2 border-[#5C2D91]/20 bg-[#5C2D91]/5 hover:bg-[#5C2D91]/10 hover:border-[#5C2D91]/40 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        <div className="h-10 w-full flex items-center justify-center">
                                            <span className="text-2xl font-black text-[#5C2D91] tracking-tighter">Khalti</span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#5C2D91]/60">Digital Wallet</span>
                                    </button>
                                </div>
                            </div>

                            {initiating && (
                                <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground animate-pulse font-bold uppercase">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Redirecting...
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <Button variant="outline" className="flex-1 h-10 text-xs" onClick={() => setStep("select")} disabled={initiating}>
                                    Back
                                </Button>
                                <Button variant="ghost" className="flex-1 h-10 text-xs" onClick={onClose} disabled={initiating}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
