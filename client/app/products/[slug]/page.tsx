"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getProductBySlug, toggleFavorite, getSimilarItems } from "../../lib/api";
import { Loader2, MapPin, Heart, Share2, MessageCircle, ShoppingCart, Clock, Tag, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";
import { getFavorites } from "../../lib/api";
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
        username: string;
        photo: string;
    };
}

export default function ProductDetailPage() {
    const params = useParams();
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
                <div className="max-w-5xl mx-auto">
                    {/* Main Product Section: 2-Column Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                        {/* Left Column: Premium Image Gallery */}
                        <div className="space-y-6">
                            <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted/20 border-2 border-primary/5 shadow-2xl transition-all duration-500 hover:shadow-primary/5">
                                <Image
                                    src={(product.images && product.images.length > 0) ? product.images[activeImageIndex] : (product.image || "/placeholder.jpg")}
                                    alt={product.title}
                                    fill
                                    className="object-contain p-4 transition-transform duration-700 hover:scale-105"
                                    priority
                                />
                                {product.isBiddable && isBuyerMode && (user?.username !== product.author?.username) && (
                                    <Badge className="absolute top-6 left-6 h-9 px-4 text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground border-none shadow-lg">
                                        Open to Bids
                                    </Badge>
                                )}

                                <div className="absolute top-6 right-6 flex gap-2">
                                    {isBuyerMode && (user?.username !== product.author?.username) && (
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className={`rounded-full shadow-lg backdrop-blur-md transition-all duration-300 ${isFavorite ? "bg-white text-red-500 hover:bg-white" : "bg-white/80 text-gray-500 hover:bg-white hover:text-red-400"}`}
                                            onClick={handleFavorite}
                                            disabled={favLoading}
                                        >
                                            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                                        </Button>
                                    )}
                                    <Button size="icon" variant="secondary" className="rounded-full shadow-lg bg-white/80 text-gray-500 hover:bg-white hover:text-primary backdrop-blur-md">
                                        <Share2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto py-2 scrollbar-none px-2">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImageIndex(idx)}
                                            className={`relative h-20 w-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${activeImageIndex === idx ? "border-primary shadow-lg scale-105" : "border-primary/5 hover:border-primary/40"}`}
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

                        {/* Right Column: Refined Product Info */}
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20 font-bold text-[10px] uppercase tracking-widest">
                                            {product.category || "General"}
                                        </Badge>
                                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 font-bold text-[10px] uppercase tracking-widest">
                                            {product.condition || "Excellent"}
                                        </Badge>
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
                                        {product.title}
                                    </h1>
                                </div>

                                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2 group">
                                        <div className="p-2 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                                            <MapPin className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="font-medium">{product.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 group">
                                        <div className="p-2 rounded-full bg-secondary/5 group-hover:bg-secondary/10 transition-colors">
                                            <Clock className="h-4 w-4 text-secondary" />
                                        </div>
                                        <span className="font-medium italic opacity-80">{formatTime(product.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-muted/10 border border-primary/5 shadow-inner space-y-6">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Current Price</span>
                                    <div className="space-y-1">
                                        <div className="flex items-baseline gap-3">
                                            {product.offerPrice && product.offerPrice > 0 ? (
                                                <>
                                                    <span className="text-3xl font-black text-red-500 tracking-tighter">Rs. {product.offerPrice.toLocaleString()}</span>
                                                    <span className="text-sm font-bold text-muted-foreground/60 line-through decoration-muted-foreground/40">Rs. {product.price.toLocaleString()}</span>
                                                </>
                                            ) : (
                                                <span className="text-3xl font-black text-primary tracking-tighter">Rs. {product.price.toLocaleString()}</span>
                                            )}
                                        </div>
                                        {product.offerPrice && product.offerPrice > 0 && product.offerDuration && (
                                            <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest bg-red-500/5 w-fit px-3 py-1 rounded-full border border-red-500/10">
                                                <Clock className="w-3.5 h-3.5" />
                                                Deal Ends in: {product.offerDuration}{product.offerUnit}
                                            </div>
                                        )}
                                        {product.isBiddable && isBuyerMode && (user?.username !== product.author?.username) && (
                                            <span className="text-xs font-bold text-secondary uppercase tracking-wider block mt-1">(Starting Offer)</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button size="lg" className="flex-1 h-12 gap-2 text-xs font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-lg">
                                        <MessageCircle className="h-4 w-4" />
                                        Inquire
                                    </Button>
                                    {isBuyerMode && (user?.username !== product.author?.username) && (
                                        product.isBiddable ? (
                                            <Button size="lg" variant="secondary" className="flex-1 h-12 gap-2 text-xs font-bold uppercase tracking-widest bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg">
                                                Place a Bid
                                            </Button>
                                        ) : (
                                            <Button size="lg" variant="secondary" className="flex-1 h-12 gap-2 text-xs font-bold uppercase tracking-widest bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg">
                                                <ShoppingCart className="h-4 w-4" />
                                                Purchase
                                            </Button>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Seller Details Card */}
                            <Card className="rounded-3xl border-muted/60 overflow-hidden group hover:border-primary/20 transition-all duration-500">
                                <CardContent className="p-6 flex items-center gap-5">
                                    <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-primary/5 ring-2 ring-primary/5 group-hover:ring-primary/20 transition-all">
                                        {product.author?.photo ? (
                                            <Image
                                                src={product.author.photo}
                                                alt={product.author.username}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary font-black text-2xl">
                                                {product.author?.username?.[0] || "U"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-extrabold text-lg text-foreground tracking-tight">{product.author?.username || "Verified Seller"}</h4>
                                            <Badge variant="outline" className="h-5 text-[9px] uppercase font-bold tracking-tighter bg-green-500/10 text-green-600 border-green-500/20">Verified</Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground font-medium opacity-80 flex items-center gap-1.5">
                                            <Clock className="h-3 w-3" /> Professional Member since 2024
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm" className="rounded-xl font-bold text-[10px] uppercase tracking-widest border-primary/20 hover:bg-primary/5 transition-all">
                                        View Store
                                    </Button>
                                </CardContent>
                            </Card>

                            <div className="space-y-4 pt-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-1 rounded-full bg-secondary shadow-sm shadow-secondary/20"></div>
                                    <h3 className="text-xl font-black text-foreground tracking-tight">Details</h3>
                                </div>
                                <div className="relative overflow-hidden transition-all duration-500">
                                    <div className={`prose dark:prose-invert max-w-none text-muted-foreground/90 leading-relaxed text-xs font-medium whitespace-pre-line bg-muted/5 p-5 rounded-2xl border border-dashed border-muted-foreground/10 italic ${!isDescriptionExpanded ? "max-h-24 overflow-hidden" : ""}`}>
                                        {product.content}
                                    </div>
                                    {!isDescriptionExpanded && product.content.length > 200 && (
                                        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background/90 to-transparent flex items-end justify-center">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="text-[10px] uppercase font-bold tracking-widest text-primary hover:bg-transparent"
                                                onClick={() => setIsDescriptionExpanded(true)}
                                            >
                                                Read More
                                            </Button>
                                        </div>
                                    )}
                                    {isDescriptionExpanded && (
                                        <div className="flex justify-center mt-2">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="text-[10px] uppercase font-bold tracking-widest text-primary hover:bg-transparent" 
                                                onClick={() => setIsDescriptionExpanded(false)}
                                            >
                                                Show Less
                                            </Button>
                                        </div>
                                    )}
                                </div>
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
