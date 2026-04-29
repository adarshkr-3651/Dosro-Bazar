"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { getProductBySlug } from "@/app/lib/api";
import { resolvePhotoUrl } from "@/app/lib/image-utils";
import { Loader2, MapPin, Heart, Share2, MessageCircle, ShoppingCart, Clock, Tag, TrendingUp, Truck, Wallet, CheckCircle2, XCircle, UserCheck, Sparkles, Gavel, ShieldCheck } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import Image from "next/image";
import { LocationMapModal } from "@/app/components/LocationMapModal";
import { ArrowUpRight } from "lucide-react";
import { BidHistoryChart } from "./BidHistoryChart";

interface ProductPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    slug: string;
}

export function ProductPreviewModal({ isOpen, onClose, slug }: ProductPreviewModalProps) {
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                const res = await getProductBySlug(slug);
                setProduct(res.data);
            } catch (error) {
                console.error("Failed to fetch product preview:", error);
            } finally {
                setLoading(false);
            }
        };
        if (isOpen) fetchProduct();
    }, [isOpen, slug]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl p-0 overflow-hidden border-none rounded-[2rem] max-h-[95vh] overflow-y-auto bg-background no-scrollbar">
                <DialogHeader className="sr-only">
                    <DialogTitle>Product Preview - {product?.title || "Loading..."}</DialogTitle>
                </DialogHeader>
                
                {loading ? (
                    <div className="flex justify-center items-center h-[600px]">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : product ? (
                    <div className="relative p-6 md:p-10">
                        {/* Preview Banner */}
                        <div className="absolute top-0 left-0 right-0 bg-secondary text-secondary-foreground py-2 text-center text-[10px] font-black uppercase tracking-[0.4em] z-50">
                            Buyer Preview Mode • Not Live Action
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-6">
                            {/* Left Column: Image Gallery */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-muted/20 border-2 border-primary/5 shadow-xl">
                                    <Image
                                        src={product.images?.[activeImageIndex] || "/placeholder.jpg"}
                                        alt={product.title}
                                        fill
                                        className="object-contain p-4"
                                    />
                                    {product.isBiddable && (
                                        <Badge className="absolute top-4 left-4 h-7 px-3 text-[8px] font-black uppercase tracking-widest bg-primary text-primary-foreground border-none">
                                            Live Auction
                                        </Badge>
                                    )}
                                </div>
                                {product.images?.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                                        {product.images.map((img: string, idx: number) => (
                                            <button
                                                key={idx}
                                                onClick={() => setActiveImageIndex(idx)}
                                                className={`relative h-14 w-14 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImageIndex === idx ? "border-primary scale-105" : "border-transparent opacity-60"}`}
                                            >
                                                <Image src={img} alt="preview thumb" fill className="object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Info */}
                            <div className="lg:col-span-3 space-y-6">
                                <div className="space-y-4">
                                    <div className="p-6 rounded-3xl bg-muted/20 border border-primary/5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Buyer's Valuation</p>
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-4xl font-black text-primary tracking-tighter">Rs. {product.price.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div className="flex gap-3">
                                            <Button size="lg" className="flex-1 h-12 gap-2 text-[10px] font-black uppercase tracking-widest bg-[#5D4037] rounded-xl pointer-events-none opacity-80">
                                                <MessageCircle className="h-4 w-4" /> Message Seller
                                            </Button>
                                            <Button size="lg" variant="secondary" className="flex-1 h-12 gap-2 text-[10px] font-black uppercase tracking-widest bg-white text-foreground border border-primary/10 rounded-xl pointer-events-none opacity-80">
                                                <ShoppingCart className="h-4 w-4 text-primary" /> Purchase
                                            </Button>
                                        </div>
                                        {product.isBiddable && (
                                            <div className="flex gap-2">
                                                <div className="h-12 flex-1 bg-muted/20 rounded-xl border border-primary/5 px-4 flex items-center text-[10px] text-muted-foreground font-bold">
                                                    Proposal Amount (Placeholder)
                                                </div>
                                                <Button size="lg" className="h-12 px-6 bg-secondary text-secondary-foreground text-[10px] font-black uppercase tracking-widest rounded-xl pointer-events-none opacity-80">
                                                    Bid
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Separator className="bg-primary/5" />

                                <div className="space-y-4">
                                    <h2 className="text-2xl font-black tracking-tight leading-none">{product.title}</h2>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-xl bg-muted/10 border border-primary/5 flex items-center gap-3">
                                            <Tag className="h-4 w-4 text-primary" />
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black uppercase text-muted-foreground/60 tracking-widest">Category</span>
                                                <span className="text-[10px] font-bold">{product.category}</span>
                                            </div>
                                        </div>
                                        <div 
                                            className="p-3 rounded-xl bg-muted/10 border border-primary/5 flex items-center gap-3 cursor-pointer hover:bg-primary/5 transition-all group/loc"
                                            onClick={() => setIsMapModalOpen(true)}
                                        >
                                            <MapPin className="h-4 w-4 text-secondary group-hover/loc:scale-110 transition-transform" />
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black uppercase text-muted-foreground/60 tracking-widest">Location</span>
                                                <span className="text-[10px] font-bold truncate max-w-[100px] flex items-center gap-1">
                                                    {product.location}
                                                    <ArrowUpRight className="h-2 w-2 opacity-0 group-hover/loc:opacity-100 transition-opacity" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bid History Chart Preview */}
                                    <div className="pt-2">
                                        <BidHistoryChart itemId={product._id} basePrice={product.price} />
                                    </div>
                                </div>

                                <div className="p-6 rounded-[2rem] bg-muted/5 border-2 border-dashed border-primary/5 italic text-sm text-muted-foreground/90 whitespace-pre-line leading-relaxed">
                                    {product.content}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-20 text-center">Product not found</div>
                )}
            </DialogContent>
            {product && (
                <LocationMapModal 
                    isOpen={isMapModalOpen}
                    onClose={() => setIsMapModalOpen(false)}
                    destination={product.location}
                    title={product.title}
                />
            )}
        </Dialog>
    );
}
