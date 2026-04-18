"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getProductBySlug, toggleFavorite, getSimilarItems, sendChatMessage, placeBid, getItemBids, getFavorites } from "../../lib/api";
import { resolvePhotoUrl } from "../../lib/image-utils";
import { Loader2, MapPin, Heart, Share2, MessageCircle, ShoppingCart, Clock, Tag, AlertCircle, Sparkles, Gavel, ArrowUpRight, TrendingUp, Truck, Wallet, CheckCircle2, XCircle, UserCheck } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";
import ProductCard from "../../components/ProductCard";

interface Product {
    _id: string;
    slug: string;
    title: string;
    price: number;
    image: string; // Kept for safety
    images: string[];
    location: string;
    content: string; // Description
    category: string;
    condition: string;
    isBiddable: boolean;
    createdAt: string;
    offerPrice?: number;
    offerDuration?: string;
    offerUnit?: string;
    author: {
        _id: string;
        username: string;
        photo: string;
    };
    offerExpiresAt?: string | Date;
    deliveryAvailable: boolean;
    paymentMethods: string[];
    deliveryChargeAmount: number;
    shippingPartners: string[];
}

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const { user, isBuyerMode } = useAuth(); // Get user and mode from context

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);
    const [favLoading, setFavLoading] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [similarItems, setSimilarItems] = useState<any[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [bidAmount, setBidAmount] = useState<string>("");
    const [bidLoading, setBidLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [bids, setBids] = useState<any[]>([]);

    useEffect(() => {
        const fetchBids = async () => {
            if (product?._id) {
                try {
                    const data = await getItemBids(product._id);
                    if (data.success) {
                        setBids(data.data);
                    }
                } catch (err) {
                    console.error("Failed to fetch bids", err);
                }
            }
        };
        fetchBids();
    }, [product?._id]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductBySlug(slug);
                if (data.success) {
                    setProduct(data.data);
                } else {
                    setError("Product not found");
                }
            } catch (err: any) {
                setError(err.message || "Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchProduct();
        }
    }, [slug]);

    // Separate effect to check favorite status
    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (user && product) {
                try {
                    const favData = await getFavorites();
                    if (favData.success && Array.isArray(favData.data)) {
                        const isFav = favData.data.some((item: any) => item.slug === slug);
                        setIsFavorite(isFav);
                        setFavoriteIds(new Set(favData.data.map((item: any) => item._id)));
                    }
                } catch (err) {
                    console.error("Failed to check favorite status", err);
                }
            }
        };

        checkFavoriteStatus();
    }, [user, product, slug]);

    // Fetch similar items
    useEffect(() => {
        const fetchSimilar = async () => {
            if (slug) {
                try {
                    const data = await getSimilarItems(slug);
                    if (data.success) {
                        setSimilarItems(data.data);
                    }
                } catch (err) {
                    console.error("Failed to fetch similar items", err);
                }
            }
        };

        fetchSimilar();
    }, [slug]);

    // Offer Countdown Effect
    useEffect(() => {
        if (!product?.offerExpiresAt || (product?.offerPrice || 0) <= 0) {
            setTimeLeft("");
            return;
        }

        const calculateTimeLeft = () => {
            const expiryDate = new Date(product.offerExpiresAt!);
            const now = new Date();
            const difference = expiryDate.getTime() - now.getTime();
            
            if (difference <= 0) return "Expired";

            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            if (hours > 0) {
                return `${hours}h ${minutes}m`;
            } else {
                return `${minutes}m ${seconds}s`;
            }
        };

        const initial = calculateTimeLeft();
        setTimeLeft(initial);
        if (initial === "Expired") return;

        const timer = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);
            if (remaining === "Expired") clearInterval(timer);
        }, 1000);

        return () => clearInterval(timer);
    }, [product?.offerExpiresAt, product?.offerPrice]);

    const handleFavorite = async () => {
        if (!slug) return;
        setFavLoading(true);
        try {
            const response = await toggleFavorite(slug);
            setIsFavorite(response.status);
            toast.success(response.message);
        } catch (error: any) {
            toast.error(error.message || "Failed to update favorite");
        } finally {
            setFavLoading(false);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: product.title,
            text: `Check out this ${product.title} on Dosro Bazar!`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    const handleInquire = async () => {
        if (!user) {
            toast.error("Please login to send messages");
            router.push("/login");
            return;
        }
        if (!product?.author?._id) {
            toast.error("Seller information is missing");
            return;
        }

        try {
            await sendChatMessage(product.author._id, product._id, `Hi, I'm inquiring about "${product.title}"`);
            router.push("/messages");
        } catch (err: any) {
            toast.error(err.message || "Failed to start conversation");
        }
    };

    const handleBid = async (isPurchase = false) => {
        if (!user) {
            toast.error("Please login to place a bid");
            router.push("/login");
            return;
        }
        if (!product?._id) return;

        const currentPrice = product.offerPrice && product.offerPrice > 0 ? product.offerPrice : product.price;
        const amount = isPurchase ? currentPrice : Number(bidAmount);

        if (!amount || isNaN(amount)) {
            toast.error("Please enter a valid bid amount");
            return;
        }

        if (amount < currentPrice) {
            toast.error(`Bid must be at least Rs. ${currentPrice.toLocaleString()}`);
            return;
        }

        if (amount > product.price * 2) {
            toast.error(`Bid cannot exceed double the listed price (Rs. ${(product.price * 2).toLocaleString()})`);
            return;
        }

        setBidLoading(true);
        try {
            await placeBid(product._id, amount);
            toast.success(isPurchase ? "Purchase request sent!" : "Bid placed successfully!");
            setBidAmount("");
        } catch (err: any) {
            toast.error(err.message || "Failed to place bid");
        } finally {
            setBidLoading(false);
        }
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex justify-center items-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col justify-center items-center space-y-4">
                    <AlertCircle className="h-12 w-12 text-destructive" />
                    <h2 className="text-2xl font-bold">Product Not Found</h2>
                    <p className="text-muted-foreground">The item you are looking for does not exist or has been removed.</p>
                    <Button asChild variant="outline">
                        <a href="/">Back to Home</a>
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-0 md:py-4">
                <div className="w-full">
                    {/* Main Product Section: Redesigned Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-8 lg:items-stretch group/layout">
                                        
                        {/* Left Column: Compact Image Gallery (2/5 width) */}
                        <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-24 lg:self-start">
                            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-muted/20 border-2 border-primary/5 shadow-2xl group/main">
                                <Image
                                    src={(product.images && product.images.length > 0) ? product.images[activeImageIndex] : (product.image || "/placeholder.jpg")}
                                    alt={product.title}
                                    fill
                                    className="object-contain p-6 transition-transform duration-1000 group-hover/main:scale-110"
                                    priority
                                />
                                {product.isBiddable && isBuyerMode && (user?.username !== product.author?.username) && (
                                    <div className="absolute top-6 left-6 flex flex-col gap-1.5">
                                        <Badge className="h-8 px-4 text-[9px] font-black uppercase tracking-[0.2em] bg-primary text-primary-foreground border-none shadow-xl">
                                            Live Auction
                                        </Badge>
                                        <div className="flex items-center gap-1 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-primary/10 shadow-md">
                                            <TrendingUp className="w-3 h-3 text-secondary animate-pulse" />
                                            <span className="text-[8px] font-black text-secondary tracking-widest uppercase">High Interest</span>
                                        </div>
                                    </div>
                                )}

                                <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 translate-x-4 group-hover/main:opacity-100 group-hover/main:translate-x-0 transition-all duration-500">
                                    {isBuyerMode && (user?.username !== product.author?.username) && (
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className={`h-11 w-11 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20 transition-all duration-300 ${isFavorite ? "bg-white text-red-500" : "bg-white/80 text-gray-500 hover:text-red-400"}`}
                                            onClick={handleFavorite}
                                            disabled={favLoading}
                                        >
                                            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                                        </Button>
                                    )}
                                    <Button 
                                        size="icon" 
                                        variant="secondary" 
                                        className="h-11 w-11 rounded-2xl shadow-2xl bg-white/80 text-gray-500 hover:text-primary backdrop-blur-xl border border-white/20 transition-all hover:scale-110"
                                        onClick={handleShare}
                                    >
                                        <Share2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Refined Thumbnails */}
                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto py-2 scrollbar-none">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImageIndex(idx)}
                                            className={`relative h-16 w-16 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-500 ${activeImageIndex === idx ? "border-primary shadow-xl scale-110 -translate-y-1" : "border-transparent opacity-60 hover:opacity-100"}`}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${product.title} view ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                        </div>

                        {/* Right Column: Information Dashboard (3/5 width) - Synchronized with left side height */}
                        <div className="lg:col-span-3 lg:h-0 lg:min-h-full flex flex-col overflow-hidden">
                            <div className="flex-1 space-y-8 overflow-y-auto lg:pr-4 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
                            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-muted/20 to-muted/5 border border-primary/5 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors" />
                                
                                <div className="flex flex-col gap-1 relative z-10">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 mb-1">Price Dynamics</span>
                                    <div className="space-y-2">
                                        <div className="flex flex-col">
                                            {product.isBiddable && bids.length === 0 ? (
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1 flex items-center gap-1.5"><Tag className="w-3 h-3" /> Starting Bid</span>
                                                    <span className="text-4xl font-black text-foreground tracking-tighter">Rs. {product.price.toLocaleString()}</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 flex items-center gap-1.5"><TrendingUp className="w-3 h-3" /> Latest Valuation</span>
                                                    <div className="flex items-baseline gap-3">
                                                        {product.offerPrice && product.offerPrice > 0 && timeLeft !== "Expired" ? (
                                                            <>
                                                                <span className="text-4xl font-black text-red-500 tracking-tighter">Rs. {product.offerPrice.toLocaleString()}</span>
                                                                <span className="text-sm font-bold text-muted-foreground/60 line-through decoration-muted-foreground/40 italic">Rs. {product.price.toLocaleString()}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-4xl font-black text-primary tracking-tighter">Rs. {product.price.toLocaleString()}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {product.offerPrice && product.offerPrice > 0 && timeLeft !== "Expired" && (
                                            <div className="flex items-center gap-2 text-red-500 font-bold text-[10px] uppercase tracking-widest bg-red-500/10 w-fit px-4 py-1.5 rounded-full border border-red-500/20 shadow-sm animate-pulse">
                                                <Clock className="w-4 h-4" />
                                                Deal Expiring: {timeLeft || product.offerDuration + product.offerUnit}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Custom Bid Density Chart Integration */}
                                {product.isBiddable && bids.length > 0 && (
                                    <div className="mt-8 pt-8 border-t border-primary/5">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-5 w-1.5 rounded-full bg-secondary shadow-lg shadow-secondary/20"></div>
                                                    <h3 className="text-xs font-black text-foreground uppercase tracking-widest">Pricing Density Graph</h3>
                                                </div>
                                                <Badge variant="ghost" className="text-[9px] font-black uppercase tracking-widest text-primary/40">Market Sentiment</Badge>
                                            </div>
                                            
                                            <div className="h-28 flex items-end gap-2 px-1">
                                                {(() => {
                                                    const amounts = bids.map(b => b.amount);
                                                    const maxBid = Math.max(...amounts, product.price);
                                                    const minBid = Math.min(...amounts, product.price);
                                                    const range = maxBid - minBid || 1;
                                                    const binCount = 8;
                                                    const bins = Array(binCount).fill(0);
                                                    
                                                    amounts.forEach(amt => {
                                                        const idx = Math.min(Math.floor(((amt - minBid) / range) * binCount), binCount - 1);
                                                        bins[idx]++;
                                                    });
                                                    
                                                    const maxBin = Math.max(...bins, 1);
                                                    
                                                    return bins.map((val, i) => (
                                                        <div 
                                                            key={i} 
                                                            className="flex-1 rounded-t-xl group/bar relative transition-all duration-700 bg-gradient-to-t from-primary/20 to-primary/40 hover:from-primary/40 hover:to-primary/60 border-x border-t border-primary/10"
                                                            style={{ height: `${Math.max((val / maxBin) * 100, 8)}%` }}
                                                        >
                                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[8px] font-black px-2 py-1.5 rounded-xl border border-primary/10 shadow-2xl opacity-0 group-hover/bar:opacity-100 transition-all duration-300 whitespace-nowrap z-50 pointer-events-none scale-0 group-hover/bar:scale-100">
                                                                PRICE REGION {i + 1}
                                                                <br/>
                                                                <span className="text-primary/60">PREFERED INTEREST</span>
                                                            </div>
                                                        </div>
                                                    ));
                                                })()}
                                            </div>
                                            
                                            <div className="flex justify-between items-center px-1">
                                                <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground/30">Competitive Bids</span>
                                                <div className="flex-1 h-[1px] mx-4 bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
                                                <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground/30">Premium Offers</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4 mt-8 pt-8 border-t border-primary/5">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button onClick={handleInquire} size="lg" className="flex-1 h-14 gap-3 text-xs font-black uppercase tracking-[0.2em] bg-[#5D4037] hover:bg-[#3E2723] rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95" disabled={bidLoading}>
                                            <MessageCircle className="h-5 w-5" />
                                            Direct Message
                                        </Button>
                                        
                                        {isBuyerMode && (user?.username !== product.author?.username) && (
                                            <Button onClick={() => handleBid(true)} disabled={bidLoading} size="lg" variant="secondary" className="flex-1 h-14 gap-3 text-xs font-black uppercase tracking-[0.2em] bg-white dark:bg-zinc-900 text-foreground border-2 border-primary/10 hover:border-primary/30 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95">
                                                <ShoppingCart className="h-5 w-5 text-primary" />
                                                Fast Purchase
                                            </Button>
                                        )}
                                    </div>

                                    {isBuyerMode && product.isBiddable && (user?.username !== product.author?.username) && (
                                        <div className="flex gap-3 pt-2">
                                            <div className="relative flex-1 group/input">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black text-[10px] uppercase tracking-widest z-10 group-focus-within/input:text-secondary transition-colors">Rs.</div>
                                                <Input
                                                    type="number"
                                                    placeholder="Enter your proposal"
                                                    value={bidAmount}
                                                    onChange={(e) => setBidAmount(e.target.value)}
                                                    className="h-14 pl-12 pr-4 bg-white dark:bg-zinc-900 border-2 border-primary/5 focus:border-primary/30 focus:ring-0 rounded-2xl transition-all font-bold text-lg shadow-inner"
                                                    disabled={bidLoading}
                                                />
                                            </div>
                                            <Button 
                                                onClick={() => handleBid(false)} 
                                                disabled={bidLoading || !bidAmount}
                                                size="lg"
                                                className="h-14 px-10 gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95 shadow-secondary/20"
                                            >
                                                {bidLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Gavel className="h-5 w-5" />}
                                                Place Bid
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Integrated Seller & Specifications Card - Flexible to fill height */}
                            <div className="flex-1 min-h-0 rounded-[2.5rem] bg-background border border-primary/5 shadow-xl overflow-hidden group/combined flex flex-col">
                                {/* Seller Header - Adorable Glassmorphism Design */}
                                <div className="p-8 bg-muted/5 border-b border-primary/5 flex flex-col md:flex-row md:items-center justify-between gap-6 group-hover/combined:bg-muted/10 transition-colors duration-500">
                                    <div className="flex items-center gap-5">
                                        <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-background shadow-xl ring-4 ring-primary/5">
                                            <Image
                                                src={resolvePhotoUrl(product.author.photo, true) || "/user.png"}
                                                alt={product.author.username}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover/combined:scale-110"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-black tracking-tighter text-foreground">{product.author.username}</span>
                                                <Badge variant="secondary" className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-500/10 text-green-600 border border-green-500/20">
                                                    <UserCheck className="w-3 h-3 mr-1" /> Verified
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full">
                                                    <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Top Rated Seller</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-muted-foreground/60 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> Usually responds in 1h
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <Button variant="outline" className="h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest border-primary/10 hover:bg-primary/5 gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm" onClick={handleInquire}>
                                            <MessageCircle className="w-4 h-4" />
                                            Inquire
                                        </Button>
                                        <Button variant="secondary" className="h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-primary/5 text-primary hover:bg-primary/10 gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm">
                                            <ArrowUpRight className="w-4 h-4" />
                                            Account
                                        </Button>
                                    </div>
                                </div>

                                {/* Specifications Body - Grow to fill available space */}
                                <div className="p-8 flex-1 space-y-8 flex flex-col">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="h-4 w-1 rounded-full bg-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Item Specifications</span>
                                        </div>
                                        <h1 className="text-3xl font-black text-foreground tracking-tighter leading-none">{product.title}</h1>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-muted/10 border border-primary/5 flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                                                <Tag className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black uppercase text-muted-foreground/60 tracking-widest">Category</span>
                                                <span className="text-xs font-bold">{product.category || "General"}</span>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-muted/10 border border-primary/5 flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-secondary/5 flex items-center justify-center">
                                                <Sparkles className="h-5 w-5 text-secondary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black uppercase text-muted-foreground/60 tracking-widest">Condition</span>
                                                <span className="text-xs font-bold">{product.condition || "Excellent"}</span>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-muted/10 border border-primary/5 flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                                                <Truck className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black uppercase text-muted-foreground/60 tracking-widest">Delivery</span>
                                                <div className="flex items-center gap-1">
                                                    {product.deliveryAvailable ? (
                                                        <span className="text-xs font-bold flex items-center gap-1 text-green-600"><CheckCircle2 className="h-3 w-3" /> Available</span>
                                                    ) : (
                                                        <span className="text-xs font-bold flex items-center gap-1 text-red-500"><XCircle className="h-3 w-3" /> Not Available</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-muted/10 border border-primary/5 flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-secondary/5 flex items-center justify-center">
                                                <MapPin className="h-5 w-5 text-secondary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black uppercase text-muted-foreground/60 tracking-widest">Location</span>
                                                <span className="text-xs font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">{product.location}</span>
                                            </div>
                                        </div>

                                        {product.deliveryAvailable && (
                                            <div className="p-4 rounded-2xl bg-muted/10 border border-primary/5 flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                                                    <Wallet className="h-5 w-5 text-primary" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black uppercase text-muted-foreground/60 tracking-widest">Charge</span>
                                                    <span className="text-xs font-bold">{product.deliveryChargeAmount > 0 ? `Rs. ${product.deliveryChargeAmount.toLocaleString()}` : "Free"}</span>
                                                </div>
                                            </div>
                                        )}

                                        {product.shippingPartners && product.shippingPartners.length > 0 && (
                                            <div className="p-4 rounded-2xl bg-muted/10 border border-primary/5 flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-secondary/5 flex items-center justify-center">
                                                    <Truck className="h-5 w-5 text-secondary" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black uppercase text-muted-foreground/60 tracking-widest">Partner</span>
                                                    <span className="text-xs font-bold truncate max-w-[100px]">{product.shippingPartners[0]}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {product.paymentMethods && product.paymentMethods.length > 0 && (
                                        <div className="pt-2">
                                            <span className="text-[9px] font-black uppercase text-muted-foreground/40 tracking-widest block mb-2 px-1">Accepted Payment Methods</span>
                                            <div className="flex flex-wrap gap-2">
                                                {product.paymentMethods.map((method, idx) => (
                                                    <Badge key={idx} variant="outline" className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border-primary/10 bg-primary/5">
                                                        {method}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
            </div>

            {/* Tier 3: Bottom Full-Width Details Section */}
                    <div className="mt-16 pt-16 border-t border-primary/5 space-y-10">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-2.5 rounded-full bg-primary shadow-lg shadow-primary/20"></div>
                                <div className="flex flex-col">
                                    <h2 className="text-3xl font-black tracking-tighter uppercase italic text-foreground/80 leading-none">Narrative & Insight</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Product Deep Dive</span>
                                        <Separator className="w-12 bg-primary/20" />
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground/60 font-bold tracking-widest uppercase px-6">In-depth exploration of the item's history, condition, and value proposition.</p>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-[3.5rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div className="prose dark:prose-invert max-w-none text-muted-foreground/90 leading-relaxed text-base font-medium whitespace-pre-line bg-muted/5 backdrop-blur-sm p-12 rounded-[3.5rem] border-2 border-dashed border-primary/5 italic relative z-10 shadow-inner">
                                {product.content}
                            </div>
                        </div>
                    </div>

                    {/* Recommended Products Section - Positioned Below main info */}
                    {similarItems.length > 0 && (
                        <div className="mt-24 space-y-10">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-secondary">
                                        <Sparkles className="h-5 w-5 animate-pulse" />
                                        <span className="font-extrabold text-sm uppercase tracking-[0.3em]">Curated For You</span>
                                    </div>
                                    <h2 className="text-4xl font-extrabold tracking-tight">Recommended Products</h2>
                                    <p className="text-muted-foreground font-medium italic opacity-70">Hand-picked items matching your preferences</p>
                                </div>
                                <Button variant="ghost" className="hidden md:flex gap-2 text-primary font-bold hover:bg-primary/5 uppercase tracking-widest text-[11px]">
                                    Browse All Items
                                    <AlertCircle className="h-4 w-4 rotate-180" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                                {similarItems.map((item) => (
                                    <ProductCard
                                        key={item._id}
                                        id={item._id}
                                        slug={item.slug}
                                        {...item}
                                        isFavorite={favoriteIds.has(item._id)}
                                        onFavoriteToggle={() => {
                                            setFavoriteIds(prev => {
                                                const newSet = new Set(prev);
                                                if (newSet.has(item._id)) newSet.delete(item._id);
                                                else newSet.add(item._id);
                                                return newSet;
                                            });
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
