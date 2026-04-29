"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getProductBySlug, toggleFavorite, getSimilarItems, sendChatMessage, placeBid, getItemBids, getFavorites, getAllItems } from "../../lib/api";
import { resolvePhotoUrl } from "../../lib/image-utils";
import { Loader2, MapPin, Heart, Share2, MessageCircle, ShoppingCart, Clock, Tag, AlertCircle, Sparkles, Gavel, ArrowUpRight, TrendingUp, Truck, Wallet, CheckCircle2, XCircle, UserCheck, X, Star, MessageSquare } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";
import ProductCard from "../../components/ProductCard";
import AdvanceBookModal from "../../components/AdvanceBookModal";
import { SellerReviewsModal } from "../../components/SellerReviewsModal";
import { LocationMapModal } from "../../components/LocationMapModal";
import { BidHistoryChart } from "../../components/BidHistoryChart";

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
    bidPrice: number;
    createdAt: string;
    offerPrice?: number;
    offerDuration?: string;
    offerUnit?: string;
    author: {
        _id: string;
        username: string;
        photo: string;
        averageRating?: number;
        numReviews?: number;
    };
    offerExpiresAt?: string | Date;
    deliveryAvailable: boolean;
    deliveryChargeType: "manual" | "buyer_pays";
    deliveryChargeAmount: number;
    shippingPartners: string[];
    paymentMethods: string[];
    isBooked?: boolean;
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
    const [isAdvanceBookModalOpen, setIsAdvanceBookModalOpen] = useState(false);
    const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);

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
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('payment_success') === 'true') {
            const type = urlParams.get('type');
            const amount = urlParams.get('amount');
            const plan = urlParams.get('plan');
            const expiry = urlParams.get('expiry');

            if (type === 'boost') {
                toast.success("Boost Activated!", {
                    description: `This product is now boosted${plan ? ` (${plan} plan)` : ''}${expiry ? ` until ${expiry}` : ''}.`,
                    duration: 8000
                });
            } else if (type === 'advance') {
                toast.success("Booking Confirmed!", {
                    description: `You have successfully paid Rs. ${Number(amount).toLocaleString()} as advance for this item.`,
                    duration: 8000
                });
            } else {
                toast.success("Payment Successful!");
            }

            // Clean up URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, []);

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
            toast.error("Please login to send an offer");
            router.push("/login");
            return;
        }
        if (!product?._id) return;

        if (product.isBooked) {
            toast.error("This item is already booked.");
            return;
        }

        const hasActiveOffer = product.offerPrice && product.offerPrice > 0 && timeLeft !== "Expired";
        
        const listingPrice = product.price;
        const sellerMinBid = product.bidPrice;
        
        const minAllowedBid = (sellerMinBid && sellerMinBid > 0) 
            ? sellerMinBid 
            : Math.round(listingPrice * 0.75);
        
        const maxAllowedBid = listingPrice * 2;

        const amount = isPurchase ? (hasActiveOffer ? product.offerPrice : product.price) : Number(bidAmount);

        if (!amount || isNaN(amount)) {
            toast.error("Please enter a valid offer amount");
            return;
        }

        if (amount < minAllowedBid) {
            toast.error(`Offer must be at least Rs. ${minAllowedBid.toLocaleString()} ${!sellerMinBid ? "(75% of listing price)" : ""}`);
            return;
        }

        if (amount > maxAllowedBid) {
            toast.error(`Offer cannot exceed Rs. ${maxAllowedBid.toLocaleString()} (2x listing price)`);
            return;
        }

        setBidLoading(true);
        try {
            await placeBid(product._id, amount);
            toast.success(`Bid Placed Successfully!`, {
                description: `Your offer of Rs. ${amount.toLocaleString()} for "${product.title}" is now active. You can track and manage all your proposals in the "My Bids" section of your Profile.`,
                duration: 8000,
            });
            setBidAmount("");
            
            // Show nudge message to grab the item
            setTimeout(() => {
                toast("💡 Let's grab this product before anyone reserves/books!", {
                    description: "You can use Advance Booking to secure this item right now.",
                    duration: 6000,
                });
            }, 1000);
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
                                {isBuyerMode && (user?.username !== product.author?.username) && !product.isBooked && (
                                    <div className="absolute top-6 left-6 flex flex-col gap-1.5">
                                        <Badge className="h-8 px-4 text-[9px] font-black uppercase tracking-[0.2em] bg-primary text-primary-foreground border-none shadow-xl">
                                            Active Offers
                                        </Badge>
                                        <div className="flex items-center gap-1 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-primary/10 shadow-md">
                                            <TrendingUp className="w-3 h-3 text-secondary animate-pulse" />
                                            <span className="text-[8px] font-black text-secondary tracking-widest uppercase">High Interest</span>
                                        </div>
                                    </div>
                                )}

                                {product.isBooked && (
                                    <div className="absolute inset-0 z-20 bg-background/40 backdrop-blur-[2px] flex items-center justify-center p-6">
                                        <div className="bg-background/90 border-2 border-primary shadow-2xl px-6 py-3 rounded-2xl flex items-center gap-3 animate-in zoom-in-95 duration-300">
                                            <Wallet className="h-6 w-6 text-primary" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black uppercase tracking-widest text-primary">Item Booked</span>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Advance Payment Received</span>
                                            </div>
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-0.5">Price Dynamics</span>
                                        <div className="space-y-1.5">
                                            <div className="flex flex-col">
                                                {(() => {
                                                    const hasActiveOffer = !!(product.offerPrice && product.offerPrice > 0 && timeLeft !== "Expired");
                                                    const displayPrice = hasActiveOffer ? product.offerPrice : product.price;
                                                    const isBooked = product.isBooked;

                                                    if (isBooked) {
                                                        return (
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5"><CheckCircle2 className="w-2.5 h-2.5" /> Booking Confirmed</span>
                                                                <div className="flex items-baseline gap-2">
                                                                    <span className="text-2xl font-bold text-primary tracking-tight">Rs. {product.price.toLocaleString()}</span>
                                                                    <Badge className="bg-primary/10 text-primary border-none text-[8px] font-bold uppercase h-4 px-1.5">Booked</Badge>
                                                                </div>
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                                                                {hasActiveOffer ? (
                                                                    <><Sparkles className="w-2.5 h-2.5 text-secondary animate-pulse" /> Exclusive Deal</>
                                                                ) : bids.length > 0 ? (
                                                                    <><TrendingUp className="w-2.5 h-2.5" /> Latest Valuation</>
                                                                ) : (
                                                                    <><Tag className="w-2.5 h-2.5 text-secondary" /> Starting Offer</>
                                                                )}
                                                            </span>
                                                            <div className="flex items-baseline gap-2">
                                                                <span className={`text-2xl font-bold tracking-tight ${hasActiveOffer ? 'text-red-500' : 'text-foreground'}`}>
                                                                    Rs. {displayPrice!.toLocaleString()}
                                                                </span>
                                                                {hasActiveOffer && (
                                                                    <span className="text-xs font-medium text-muted-foreground/60 line-through italic">
                                                                        Rs. {product.price.toLocaleString()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                            {!!(product.offerPrice && product.offerPrice > 0 && timeLeft !== "Expired") && (
                                                <div className="flex items-center gap-1.5 text-red-500 font-bold text-[9px] uppercase tracking-widest bg-red-500/5 w-fit px-3 py-1 rounded-full border border-red-500/10">
                                                    <Clock className="w-3 h-3" />
                                                    Deal Expiring: {timeLeft || product.offerDuration + product.offerUnit}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Custom Bid Density Chart Integration */}
                                    {bids.length > 0 && (
                                        <div className="border-l border-primary/5 pl-6 flex flex-col justify-between gap-2">
                                            {/* Header */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="h-3 w-1 rounded-full bg-secondary" />
                                                    <h3 className="text-[10px] font-bold text-foreground uppercase tracking-widest">Live Bid Chart</h3>
                                                </div>
                                                <span className="text-[8px] font-bold uppercase tracking-widest text-primary/40">{bids.length} offer{bids.length > 1 ? 's' : ''}</span>
                                            </div>

                                            {/* Bar chart */}
                                            {(() => {
                                                const fmt = (n: number) =>
                                                    n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K` : `${n}`;

                                                const sorted = [...bids].sort((a, b) => a.amount - b.amount);
                                                const listingPrice = product.price;
                                                const maxAmt = Math.max(...sorted.map(b => b.amount), listingPrice);
                                                const minAmt = Math.min(...sorted.map(b => b.amount), listingPrice);
                                                const range = maxAmt - minAmt || 1;

                                                // colour ramp: low bid = amber, at/above listing = green
                                                const barColor = (amt: number) => {
                                                    const t = Math.min((amt - minAmt) / range, 1);
                                                    if (t < 0.5) return `hsl(38 92% ${50 + t * 10}%)`;   // amber → orange
                                                    return `hsl(${142 - (1 - t) * 40} 71% 45%)`;           // orange → green
                                                };

                                                const listingPct = ((listingPrice - minAmt) / range) * 100;

                                                return (
                                                    <div className="relative flex flex-col gap-1 flex-1">
                                                        {/* Listing price dashed line */}
                                                        <div
                                                            className="absolute bottom-5 z-10 w-full"
                                                            style={{ left: `${Math.max(0, Math.min(listingPct, 96))}%`, width: '1px' }}
                                                        >
                                                            <div className="h-full absolute top-0 border-l border-dashed border-primary/40" style={{ height: '56px', bottom: 0, top: 'auto' }} />
                                                            <span className="absolute -top-3.5 -translate-x-1/2 text-[7px] font-black text-primary uppercase whitespace-nowrap bg-background px-0.5">
                                                                Rs.{fmt(listingPrice)}
                                                            </span>
                                                        </div>

                                                        {/* Bars */}
                                                        <div className="flex items-end gap-[3px] h-14">
                                                            {sorted.map((bid, i) => {
                                                                const heightPct = Math.max(((bid.amount - minAmt) / range) * 100, 18);
                                                                return (
                                                                    <div key={i} className="group/bar relative flex-1 flex flex-col justify-end" style={{ height: '100%' }}>
                                                                        {/* Tooltip */}
                                                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-150 pointer-events-none z-20 whitespace-nowrap bg-foreground text-background text-[7px] font-black px-1.5 py-0.5 rounded-sm">
                                                                            Rs.{fmt(bid.amount)}
                                                                        </div>
                                                                        <div
                                                                            className="w-full rounded-t-sm transition-all duration-300 group-hover/bar:brightness-110 group-hover/bar:scale-x-105"
                                                                            style={{
                                                                                height: `${heightPct}%`,
                                                                                backgroundColor: barColor(bid.amount),
                                                                                boxShadow: `0 0 6px ${barColor(bid.amount)}55`
                                                                            }}
                                                                        />
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>

                                                        {/* X-axis: min / max labels */}
                                                        <div className="flex justify-between px-0.5">
                                                            <span className="text-[7px] font-bold text-muted-foreground/50">Rs.{fmt(sorted[0].amount)}</span>
                                                            <span className="text-[7px] font-bold text-muted-foreground/50">Rs.{fmt(sorted[sorted.length - 1].amount)}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3 mt-6 pt-6 border-t border-primary/5">
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        {product.isBiddable ? (
                                            <Button onClick={handleInquire} size="sm" className="flex-1 h-11 gap-2 text-[11px] font-bold uppercase tracking-wider bg-[#5D4037] hover:bg-[#3E2723] rounded-lg shadow-sm transition-all" disabled={bidLoading}>
                                                <MessageCircle className="h-4 w-4" />
                                                Direct Message
                                            </Button>
                                        ) : (
                                            <div className="flex-1 flex items-center justify-center bg-muted/5 border border-dashed border-primary/10 rounded-xl h-11 px-4">
                                                <p className="text-[10px] text-muted-foreground font-medium text-center italic leading-tight">
                                                    You can text seller once your bid is accepted
                                                </p>
                                            </div>
                                        )}

                                        {isBuyerMode && (user?.username !== product.author?.username) && !product.isBooked && (
                                            <Button onClick={() => handleBid(true)} disabled={bidLoading} size="sm" variant="outline" className="flex-1 h-11 gap-2 text-[11px] font-bold uppercase tracking-wider border-primary/20 hover:bg-primary/5 rounded-lg transition-all">
                                                <ShoppingCart className="h-4 w-4 text-primary" />
                                                Accept Rs. {(product.offerPrice && product.offerPrice > 0 && timeLeft !== "Expired" ? product.offerPrice : product.price).toLocaleString()}
                                            </Button>
                                        )}
                                    </div>

                                    {isBuyerMode && (user?.username !== product.author?.username) && !product.isBooked && (
                                        <div className="flex gap-2 pt-1">
                                            <div className="relative flex-1 group/input">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-bold text-[9px] uppercase tracking-widest z-10">Rs.</div>
                                                <Input
                                                    type="number"
                                                    placeholder={product.bidPrice && product.bidPrice > 0 
                                                        ? `Min. bid: Rs. ${product.bidPrice.toLocaleString()}` 
                                                        : `Min. bid: Rs. ${Math.round(product.price * 0.75).toLocaleString()} (75% of list)`}
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
                                                className="h-11 px-6 gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold uppercase text-[10px] tracking-widest rounded-lg shadow-sm transition-all flex-shrink-0"
                                            >
                                                {bidLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gavel className="h-4 w-4" />}
                                                Send Offer
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    if (!user) {
                                                        toast.error("Please login to advance book an item");
                                                        router.push("/login");
                                                        return;
                                                    }
                                                    setIsAdvanceBookModalOpen(true);
                                                }}
                                                disabled={bidLoading}
                                                size="sm"
                                                className="h-11 px-4 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase text-[10px] tracking-widest rounded-lg shadow-sm transition-all flex-shrink-0"
                                            >
                                                <Wallet className="h-4 w-4" />
                                                Advance Book
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
                                        <Button variant="ghost" className="h-8 px-3 rounded-lg text-[10px] font-bold tracking-widest border border-amber-500/20 text-amber-500 hover:bg-amber-500/10 gap-1.5 pointer-events-none">
                                            <Star className="w-3.5 h-3.5 fill-current" />
                                            {product.author?.averageRating ? product.author.averageRating.toFixed(1) : "0.0"}
                                        </Button>
                                        <Button variant="secondary" className="h-8 px-3 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-amber-500/5 text-amber-600 hover:bg-amber-500/10 gap-1.5 border border-amber-500/10" onClick={() => setIsReviewsModalOpen(true)}>
                                            <MessageSquare className="w-3 h-3" />
                                            Reviews
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
                                                <div className="flex flex-col">
                                                    <span className={`text-xs font-semibold ${product.deliveryAvailable ? "text-green-600" : "text-red-500"} truncate`}>
                                                        {product.deliveryAvailable ? (product.shippingPartners?.length > 0 ? product.shippingPartners.join(', ') : "Available") : "N/A"}
                                                    </span>
                                                    {product.deliveryAvailable && (
                                                        <span className="text-[9px] text-muted-foreground uppercase tracking-tighter mt-0.5 whitespace-nowrap">
                                                            {product.deliveryChargeType === 'buyer_pays' ? "Delivery charge depends on your location" : `Fixed: Rs. ${product.deliveryChargeAmount}`}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div 
                                            className="p-3 rounded-lg bg-muted/5 border border-primary/5 flex items-center gap-2.5 cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-all group/loc"
                                            onClick={() => setIsMapModalOpen(true)}
                                            title="View on Map"
                                        >
                                            <div className="h-8 w-8 rounded-lg bg-secondary/5 flex items-center justify-center flex-shrink-0 group-hover/loc:scale-110 transition-transform">
                                                <MapPin className="h-4 w-4 text-secondary" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[8px] font-bold uppercase text-muted-foreground/50 tracking-wider">Location</span>
                                                <span className="text-xs font-semibold truncate flex items-center gap-1">
                                                    {product.location}
                                                    <ArrowUpRight className="h-2.5 w-2.5 opacity-0 group-hover/loc:opacity-100 transition-opacity" />
                                                </span>
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

                                    {/* Seller-only Bid History Chart */}
                                    {user?._id === product.author._id && (
                                        <div className="pt-4 border-t border-primary/5">
                                            <BidHistoryChart itemId={product._id} basePrice={product.price} />
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

                        {/* Seller Reviews Section */}
                        <div className="mt-12 space-y-6">
                            <div className="flex items-center justify-between border-b border-primary/5 pb-4">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-1 rounded-full bg-secondary"></div>
                                        <h2 className="text-lg font-bold tracking-tight uppercase text-foreground/80">Seller Reliability</h2>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground/50 font-bold tracking-wider uppercase px-3">Real feedback from the Dosro Bazar community.</p>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-[10px] font-bold uppercase tracking-widest border-amber-500/20 text-amber-600 hover:bg-amber-500/5 h-8 px-4 rounded-lg"
                                    onClick={() => setIsReviewsModalOpen(true)}
                                >
                                    View All {product.author.numReviews || 0} Reviews
                                </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-6 rounded-xl bg-amber-500/5 border border-amber-500/10 flex flex-col items-center justify-center text-center space-y-2">
                                    <div className="text-4xl font-black text-amber-600">{product.author.averageRating?.toFixed(1) || "0.0"}</div>
                                    <div className="flex gap-1 text-amber-500">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className={`w-4 h-4 ${star <= Math.round(product.author.averageRating || 0) ? 'fill-current' : 'opacity-20'}`} />
                                        ))}
                                    </div>
                                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600/60">Average Seller Rating</div>
                                </div>
                                
                                <div className="p-6 rounded-xl bg-muted/5 border border-primary/5 flex flex-col justify-center space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <UserCheck className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-foreground">Verified Trader</span>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">Dosro Bazar Trust Seal</span>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground/70 leading-relaxed font-medium">
                                        This seller has completed multiple successful transactions and maintained a high rating. Always communicate through Dosro Bazar for protected deals.
                                    </p>
                                </div>
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

            <LocationMapModal 
                isOpen={isMapModalOpen}
                onClose={() => setIsMapModalOpen(false)}
                destination={product.location}
                title={product.title}
            />

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
            
            <AdvanceBookModal 
                isOpen={isAdvanceBookModalOpen} 
                onClose={() => setIsAdvanceBookModalOpen(false)} 
                product={product} 
            />

            {product?.author && (
                <SellerReviewsModal 
                    isOpen={isReviewsModalOpen}
                    onClose={() => setIsReviewsModalOpen(false)}
                    sellerId={product.author._id}
                    sellerName={product.author.username}
                />
            )}
        </div>
    );
}
