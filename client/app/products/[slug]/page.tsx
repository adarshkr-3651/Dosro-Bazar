"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getProductBySlug, toggleFavorite, getSimilarItems, sendChatMessage, placeBid, getItemBids, getFavorites, getAllItems } from "../../lib/api";
import { resolvePhotoUrl } from "../../lib/image-utils";
import { Loader2, MapPin, Heart, Share2, MessageCircle, ShoppingCart, Clock, Tag, AlertCircle, Sparkles, Gavel, ArrowUpRight, TrendingUp, Truck, Wallet, CheckCircle2, XCircle, UserCheck, X } from "lucide-react";
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
    const [showSellerItemsModal, setShowSellerItemsModal] = useState(false);
    const [sellerItems, setSellerItems] = useState<any[]>([]);
    const [sellerItemsLoading, setSellerItemsLoading] = useState(false);

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
            // Trigger instant header update
            window.dispatchEvent(new CustomEvent('favoritesUpdated'));
        } catch (error: any) {
            toast.error(error.message || "Failed to update favorite");
        } finally {
            setFavLoading(false);
        }
    };

    const handleViewSellerProfile = async () => {
        if (!product?.author?._id) return;

        setShowSellerItemsModal(true);
        setSellerItemsLoading(true);
        try {
            const res = await getAllItems(1, 20, product.author._id);
            if (res.success) {
                setSellerItems(res.data);
            }
        } catch (error: any) {
            toast.error("Failed to fetch seller items");
        } finally {
            setSellerItemsLoading(false);
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
            router.push(`/messages?itemId=${product._id}&sellerId=${product.author._id}`);
            toast.success("Message sent! Redirecting to chat...");
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
                            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-muted/10 border border-primary/10 shadow-sm group/main">
                                <Image
                                    src={(product.images && product.images.length > 0) ? product.images[activeImageIndex] : (product.image || "/placeholder.jpg")}
                                    alt={product.title}
                                    fill
                                    className="object-contain p-4 transition-transform duration-700 group-hover/main:scale-105"
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

                                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 translate-x-2 group-hover/main:opacity-100 group-hover/main:translate-x-0 transition-all duration-300">
                                    {isBuyerMode && (user?.username !== product.author?.username) && (
                                        <button
                                            className={`h-9 w-9 flex items-center justify-center rounded-lg shadow-md backdrop-blur-md border border-white/20 transition-all duration-300 ${isFavorite ? "bg-white text-red-500" : "bg-white/80 text-gray-500 hover:text-red-400"}`}
                                            onClick={handleFavorite}
                                            disabled={favLoading}
                                        >
                                            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                                        </button>
                                    )}
                                    <button
                                        className="h-9 w-9 flex items-center justify-center rounded-lg shadow-md bg-white/80 text-gray-500 hover:text-primary backdrop-blur-md border border-white/20 transition-all hover:scale-105"
                                        onClick={handleShare}
                                    >
                                        <Share2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Refined Thumbnails */}
                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto py-1 scrollbar-none">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImageIndex(idx)}
                                            className={`relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden border transition-all duration-300 ${activeImageIndex === idx ? "border-primary shadow-md scale-105" : "border-transparent opacity-60 hover:opacity-100"}`}
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

                        {/* Right Column: Information Dashboard (3/5 width) */}
                        <div className="lg:col-span-3 flex flex-col gap-6 h-full">
                            <div className="p-6 rounded-xl bg-background border border-primary/10 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

                                <div className="flex flex-col gap-1 relative z-10">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-0.5">Price Dynamics</span>
                                    <div className="space-y-1.5">
                                        <div className="flex flex-col">
                                            {product.isBiddable && bids.length === 0 ? (
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-bold text-secondary uppercase tracking-widest flex items-center gap-1.5"><Tag className="w-2.5 h-2.5" /> Starting Bid</span>
                                                    <span className="text-2xl font-bold text-foreground tracking-tight">Rs. {product.price.toLocaleString()}</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5"><TrendingUp className="w-2.5 h-2.5" /> Latest Valuation</span>
                                                    <div className="flex items-baseline gap-2">
                                                        {product.offerPrice && product.offerPrice > 0 && timeLeft !== "Expired" ? (
                                                            <>
                                                                <span className="text-2xl font-bold text-red-500 tracking-tight">Rs. {product.offerPrice.toLocaleString()}</span>
                                                                <span className="text-xs font-medium text-muted-foreground/60 line-through italic">Rs. {product.price.toLocaleString()}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-2xl font-bold text-primary tracking-tight">Rs. {product.price.toLocaleString()}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {product.offerPrice && product.offerPrice > 0 && timeLeft !== "Expired" && (
                                            <div className="flex items-center gap-1.5 text-red-500 font-bold text-[9px] uppercase tracking-widest bg-red-500/5 w-fit px-3 py-1 rounded-full border border-red-500/10">
                                                <Clock className="w-3 h-3" />
                                                Deal Expiring: {timeLeft || product.offerDuration + product.offerUnit}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Custom Bid Density Chart Integration */}
                                {product.isBiddable && bids.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-primary/5">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="h-3 w-1 rounded-full bg-secondary"></div>
                                                    <h3 className="text-[10px] font-bold text-foreground uppercase tracking-widest">Pricing Density</h3>
                                                </div>
                                                <Badge variant="ghost" className="text-[8px] font-bold uppercase tracking-widest text-primary/40 h-auto py-0">Market Sentiment</Badge>
                                            </div>

                                            <div className="h-16 flex items-end gap-1 px-1">
                                                {(() => {
                                                    const amounts = bids.map(b => b.amount);
                                                    const maxBid = Math.max(...amounts, product.price);
                                                    const minBid = Math.min(...amounts, product.price);
                                                    const range = maxBid - minBid || 1;
                                                    const binCount = 12;
                                                    const bins = Array(binCount).fill(0);

                                                    amounts.forEach(amt => {
                                                        const idx = Math.min(Math.floor(((amt - minBid) / range) * binCount), binCount - 1);
                                                        bins[idx]++;
                                                    });

                                                    const maxBin = Math.max(...bins, 1);

                                                    return bins.map((val, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex-1 rounded-t-sm bg-primary/20 hover:bg-primary/40 transition-colors"
                                                            style={{ height: `${Math.max((val / maxBin) * 100, 10)}%` }}
                                                        />
                                                    ));
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3 mt-6 pt-6 border-t border-primary/5">
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button onClick={handleInquire} size="sm" className="flex-1 h-11 gap-2 text-[11px] font-bold uppercase tracking-wider bg-[#5D4037] hover:bg-[#3E2723] rounded-lg shadow-sm transition-all" disabled={bidLoading}>
                                            <MessageCircle className="h-4 w-4" />
                                            Direct Message
                                        </Button>

                                        {isBuyerMode && (user?.username !== product.author?.username) && (
                                            <Button onClick={() => handleBid(true)} disabled={bidLoading} size="sm" variant="outline" className="flex-1 h-11 gap-2 text-[11px] font-bold uppercase tracking-wider border-primary/20 hover:bg-primary/5 rounded-lg transition-all">
                                                <ShoppingCart className="h-4 w-4 text-primary" />
                                                Fast Purchase
                                            </Button>
                                        )}
                                    </div>

                                    {isBuyerMode && product.isBiddable && (user?.username !== product.author?.username) && (
                                        <div className="flex gap-2 pt-1">
                                            <div className="relative flex-1 group/input">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-bold text-[9px] uppercase tracking-widest z-10">Rs.</div>
                                                <Input
                                                    type="number"
                                                    placeholder="Enter your proposal"
                                                    value={bidAmount}
                                                    onChange={(e) => setBidAmount(e.target.value)}
                                                    className="h-11 pl-10 pr-3 bg-muted/5 border-primary/10 focus:border-primary/30 focus:ring-0 rounded-lg transition-all font-semibold text-sm"
                                                    disabled={bidLoading}
                                                />
                                            </div>
                                            <Button
                                                onClick={() => handleBid(false)}
                                                disabled={bidLoading || !bidAmount}
                                                size="sm"
                                                className="h-11 px-6 gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold uppercase text-[10px] tracking-widest rounded-lg shadow-sm transition-all"
                                            >
                                                {bidLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gavel className="h-4 w-4" />}
                                                Place Bid
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Integrated Seller & Specifications Card */}
                            <div className="flex-1 rounded-xl bg-background border border-primary/10 shadow-sm overflow-hidden flex flex-col">
                                {/* Seller Header */}
                                <div className="p-5 bg-muted/5 border-b border-primary/5 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-background shadow-sm">
                                            <Image
                                                src={resolvePhotoUrl(product.author.photo, true) || "/user.png"}
                                                alt={product.author.username}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-base font-bold tracking-tight text-foreground">{product.author.username}</span>
                                                <Badge variant="secondary" className="px-1.5 py-0 rounded-full text-[8px] font-bold uppercase tracking-widest bg-green-500/10 text-green-600 border-none h-4">
                                                    Verified
                                                </Badge>
                                            </div>
                                            <span className="text-[9px] font-medium text-muted-foreground/60 flex items-center gap-1">
                                                <Clock className="w-2.5 h-2.5" /> Usually responds in 1h
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" className="h-8 px-3 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-primary/10 hover:bg-primary/5 gap-1.5" onClick={handleInquire}>
                                            <MessageCircle className="w-3 h-3" />
                                            Inquire
                                        </Button>
                                        <Button variant="secondary" className="h-8 px-3 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-primary/5 text-primary hover:bg-primary/10 gap-1.5" onClick={handleViewSellerProfile}>
                                            <ArrowUpRight className="w-3 h-3" />
                                            Profile
                                        </Button>
                                    </div>
                                </div>

                                {/* Specifications Body */}
                                <div className="p-5 space-y-6">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-primary/40">Product Title</span>
                                        <h1 className="text-xl font-bold text-foreground tracking-tight leading-tight">{product.title}</h1>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-lg bg-muted/5 border border-primary/5 flex items-center gap-2.5">
                                            <div className="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                                                <Tag className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[8px] font-bold uppercase text-muted-foreground/50 tracking-wider">Category</span>
                                                <span className="text-xs font-semibold truncate">{product.category || "General"}</span>
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-lg bg-muted/5 border border-primary/5 flex items-center gap-2.5">
                                            <div className="h-8 w-8 rounded-lg bg-secondary/5 flex items-center justify-center flex-shrink-0">
                                                <Sparkles className="h-4 w-4 text-secondary" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[8px] font-bold uppercase text-muted-foreground/50 tracking-wider">Condition</span>
                                                <span className="text-xs font-semibold truncate">{product.condition || "Excellent"}</span>
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-lg bg-muted/5 border border-primary/5 flex items-center gap-2.5">
                                            <div className="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                                                <Truck className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[8px] font-bold uppercase text-muted-foreground/50 tracking-wider">Delivery</span>
                                                <span className={`text-xs font-semibold ${product.deliveryAvailable ? "text-green-600" : "text-red-500"}`}>
                                                    {product.deliveryAvailable ? "Available" : "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-lg bg-muted/5 border border-primary/5 flex items-center gap-2.5">
                                            <div className="h-8 w-8 rounded-lg bg-secondary/5 flex items-center justify-center flex-shrink-0">
                                                <MapPin className="h-4 w-4 text-secondary" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[8px] font-bold uppercase text-muted-foreground/50 tracking-wider">Location</span>
                                                <span className="text-xs font-semibold truncate">{product.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {product.paymentMethods && product.paymentMethods.length > 0 && (
                                        <div className="pt-1">
                                            <span className="text-[8px] font-bold uppercase text-muted-foreground/40 tracking-widest block mb-2 px-0.5">Accepted Payments</span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {product.paymentMethods.map((method, idx) => (
                                                    <Badge key={idx} variant="outline" className="px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider border-primary/10 bg-primary/5 h-auto">
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

                    {/* Tier 3: Bottom Full-Width Details Section */}
                    <div className="mt-10 pt-10 border-t border-primary/5 space-y-6">
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-1 rounded-full bg-primary"></div>
                                <h2 className="text-lg font-bold tracking-tight uppercase text-foreground/80">Product Narrative</h2>
                            </div>
                            <p className="text-[10px] text-muted-foreground/50 font-bold tracking-wider uppercase px-3">In-depth exploration of the item's details and condition.</p>
                        </div>

                        <div className="relative group">
                            <div className="prose dark:prose-invert max-w-none text-muted-foreground/80 leading-relaxed text-sm font-medium whitespace-pre-line bg-muted/5 p-6 rounded-xl border border-primary/5 relative z-10 italic">
                                {product.content}
                            </div>
                        </div>
                    </div>

                    {/* Recommended Products Section */}
                    {similarItems.length > 0 && (
                        <div className="mt-16 space-y-6">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 px-1">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-secondary">
                                        <Sparkles className="h-3 w-3" />
                                        <span className="font-bold text-[10px] uppercase tracking-widest">Curated For You</span>
                                    </div>
                                    <h2 className="text-xl font-bold tracking-tight">Recommended Products</h2>
                                </div>
                                <Button variant="ghost" className="hidden md:flex gap-1.5 text-primary font-bold hover:bg-primary/5 uppercase tracking-widest text-[9px] h-8">
                                    Browse All Items
                                    <ArrowUpRight className="h-3 w-3" />
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

            {/* Seller Items Modal Overlay */}
            {showSellerItemsModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="relative w-full max-w-6xl h-[90vh] bg-background border shadow-2xl rounded-3xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="p-6 border-b flex items-center justify-between bg-muted/5">
                            <div className="flex items-center gap-4">
                                <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-primary/20 p-0.5">
                                    <Image
                                        src={resolvePhotoUrl(product.author.photo, true) || "/user.png"}
                                        alt={product.author.username}
                                        fill
                                        className="object-cover rounded-full"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="font-bold text-xl tracking-tight">Products by {product.author.username}</h3>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{sellerItems.length} Active Listings</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowSellerItemsModal(false)}
                                className="h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-primary/10">
                            {sellerItemsLoading ? (
                                <div className="h-full flex flex-col items-center justify-center gap-4">
                                    <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">Fetching Seller Inventory</p>
                                </div>
                            ) : sellerItems.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {sellerItems.map((item) => (
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
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-40">
                                    <Sparkles className="h-12 w-12 text-primary/20" />
                                    <p className="text-sm font-bold uppercase tracking-widest">No other active listings found</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t bg-muted/5 flex justify-center">
                            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">Secure Peer-to-Peer Marketplace</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
