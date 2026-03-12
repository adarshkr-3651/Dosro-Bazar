"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getProductBySlug, toggleFavorite, getSimilarItems } from "../../lib/api";
import { Loader2, MapPin, Heart, Share2, MessageCircle, ShoppingCart, Clock, Tag, AlertCircle } from "lucide-react";
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
    image: string;
    location: string;
    content: string; // Description
    category: string;
    condition: string;
    isBiddable: boolean;
    createdAt: string;
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
    const [similarItems, setSimilarItems] = useState<any[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

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

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Column: Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border">
                            <Image
                                src={product.image || "/placeholder.jpg"}
                                alt={product.title}
                                fill
                                className="object-contain p-2"
                                priority
                            />
                            {product.isBiddable && isBuyerMode && (user?.username !== product.author?.username) && (
                                <Badge className="absolute top-4 left-4 h-8 px-3 text-sm">
                                    Open to Bids
                                </Badge>
                            )}


                        </div>
                        {/* Placeholder for thumbnails if multiple images exist */}
                    </div>

                    {/* Right Column: Product Info */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-start justify-between gap-4">
                                <h1 className="text-3xl md:text-4xl font-bold text-foreground">{product.title}</h1>
                                {isBuyerMode && (user?.username !== product.author?.username) && (
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="rounded-full shrink-0"
                                        onClick={handleFavorite}
                                        disabled={favLoading}
                                    >
                                        <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                                    </Button>
                                )}


                            </div>
                            <div className="flex items-center gap-4 mt-4 text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>Posted {formatTime(product.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Tag className="h-4 w-4" />
                                    <span>{product.category || "General"}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{product.location}</span>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-bold text-primary">Rs. {product.price}</span>
                                {product.isBiddable && isBuyerMode && (user?.username !== product.author?.username) && <span className="text-sm font-medium text-muted-foreground mb-2">(Starting Price)</span>}


                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button size="lg" className="flex-1 gap-2 text-lg">
                                    <MessageCircle className="h-5 w-5" />
                                    Contact Seller
                                </Button>
                                {product.isBiddable ? (
                                    isBuyerMode && (user?.username !== product.author?.username) && (
                                        <Button size="lg" variant="secondary" className="flex-1 gap-2 text-lg">
                                            Place Bid
                                        </Button>
                                    )
                                ) : (
                                    isBuyerMode && (user?.username !== product.author?.username) && (
                                        <Button size="lg" variant="secondary" className="flex-1 gap-2 text-lg">
                                            <ShoppingCart className="h-5 w-5" />
                                            Buy Now
                                        </Button>
                                    )
                                )}



                            </div>
                        </div>

                        <Card>
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted">
                                    {product.author?.photo ? (
                                        <Image
                                            src={product.author.photo}
                                            alt={product.author.username}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                            {product.author?.username?.[0] || "U"}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-lg">{product.author?.username || "Unknown Seller"}</h4>
                                    <p className="text-sm text-muted-foreground">Joined recently</p>
                                </div>
                                <Button variant="ghost" size="sm">View Profile</Button>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Description</h3>
                            <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                                {product.content}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="bg-secondary/20 p-4 rounded-lg">
                                    <span className="text-sm text-muted-foreground block mb-1">Condition</span>
                                    <span className="font-semibold">{product.condition || "Good"}</span>
                                </div>
                                <div className="bg-secondary/20 p-4 rounded-lg">
                                    <span className="text-sm text-muted-foreground block mb-1">Category</span>
                                    <span className="font-semibold">{product.category || "General"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Items Section */}
                {similarItems.length > 0 && (
                    <div className="mt-16 space-y-8">
                        <Separator />
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Similar Items</h2>
                            <p className="text-muted-foreground">You might also be interested in these</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
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
            </main>

            <Footer />
        </div>
    );
}
