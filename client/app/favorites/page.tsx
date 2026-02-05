"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { getFavorites } from "../lib/api";
import { Loader2, Heart } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

interface Product {
    _id: string;
    slug: string;
    title: string;
    price: number;
    image: string;
    location: string;
    createdAt: string;
    isBiddable: boolean;
}

export default function FavoritesPage() {
    const { isBuyerMode } = useAuth();
    const [favorites, setFavorites] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFavorites = async () => {
        try {
            const data = await getFavorites();
            setFavorites(data.data || []);
        } catch (error) {
            console.error("Failed to fetch favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    // Helper to format time relative
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 24) return `${diffInHours}h ago`;
        return `${Math.floor(diffInHours / 24)}d ago`;
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
                    <p className="text-muted-foreground">Items you've saved for later</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : favorites.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                        {favorites.map((product) => (
                            <ProductCard
                                key={product._id}
                                id={product._id}
                                slug={product.slug}
                                title={product.title}
                                price={product.price}
                                image={product.image}
                                location={product.location}
                                timePosted={formatTime(product.createdAt)}
                                isBiddable={product.isBiddable}
                                isFavorite={true}
                                onFavoriteToggle={fetchFavorites} // Refresh list on toggle (remove)
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                        <div className="bg-secondary/20 p-4 rounded-full">
                            <Heart className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-semibold">No favorites yet</h3>
                            <p className="text-muted-foreground">Start exploring and save items you like!</p>
                        </div>
                        <Button asChild>
                            <Link href="/">Browse Items</Link>
                        </Button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
