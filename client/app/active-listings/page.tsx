"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { getMyListings } from "../lib/api";
import { Loader2, Package } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

interface Product {
    _id: string;
    slug: string;
    title: string;
    price: number;
    images: string[];
    location: string;
    createdAt: string;
    isBiddable: boolean;
    offerPrice?: number;
    offerExpiresAt?: string;
}

export default function ActiveListingsPage() {
    const { isBuyerMode } = useAuth();
    const [listings, setListings] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchListings = async () => {
        try {
            const data = await getMyListings();
            // Assuming the structure is { success: true, data: [...] }
            setListings(data.data || []);
        } catch (error) {
            console.error("Failed to fetch listings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">My Active Listings</h1>
                        <p className="text-muted-foreground">Manage and track your published items</p>
                    </div>
                    <Button asChild>
                        <Link href="/upload">Upload New Item</Link>
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : listings.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                        {listings.map((product) => (
                            <ProductCard
                                key={product._id}
                                id={product._id}
                                slug={product.slug}
                                title={product.title}
                                price={product.price}
                                images={product.images}
                                location={product.location}
                                timePosted={formatTime(product.createdAt)}
                                isBiddable={product.isBiddable}
                                isFavorite={false} // Seller doesn't favorite their own items here
                                showEdit={true}
                                offerPrice={product.offerPrice}
                                offerExpiresAt={product.offerExpiresAt}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                        <div className="bg-secondary/20 p-4 rounded-full">
                            <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-semibold text-foreground/90">No active listings</h3>
                            <p className="text-muted-foreground">You haven't uploaded any items for sale yet.</p>
                        </div>
                        <Button asChild>
                            <Link href="/upload">Start Selling</Link>
                        </Button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
