"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ProductCard from "@/app/components/ProductCard";
import { searchSemantic, getFavorites } from "@/app/lib/api";
import { Loader2, SearchX } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
    const { user } = useAuth();

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                console.log(`[Search] Fetching results for: "${query}"`);
                const data = await searchSemantic(query);
                if (data.success) {
                    console.log(`[Search] Success! Received ${data.data?.length || 0} items for query: "${query}"`);
                    setResults(data.data);
                }
            } catch (error) {
                console.error(`[Search] Failed for query "${query}":`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (user) {
                try {
                    const response = await getFavorites();
                    if (response.success && Array.isArray(response.data)) {
                        setFavoriteIds(new Set(response.data.map((item: any) => item._id)));
                    }
                } catch (error) {
                    console.error("Failed to fetch favorites:", error);
                }
            }
        };
        fetchFavorites();
    }, [user]);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        {query ? `Search results for "${query}"` : "Search"}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {loading ? "Searching..." : `${results.length} items found`}
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Finding the best matches for you...</p>
                    </div>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                        {results.map((product) => (
                            <ProductCard
                                key={product._id}
                                id={product._id}
                                slug={product.slug}
                                {...product}
                                isFavorite={favoriteIds.has(product._id)}
                                onFavoriteToggle={() => {
                                    setFavoriteIds(prev => {
                                        const newSet = new Set(prev);
                                        if (newSet.has(product._id)) newSet.delete(product._id);
                                        else newSet.add(product._id);
                                        return newSet;
                                    });
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <SearchX className="h-16 w-16 text-muted-foreground mb-4" />
                        <h2 className="text-2xl font-semibold">No results found</h2>
                        <p className="text-muted-foreground mt-2 max-w-md">
                            We couldn't find any items matching your search. Try adjusting your terms or browse our categories.
                        </p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex justify-center items-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
                <Footer />
            </div>
        }>
            <SearchResults />
        </Suspense>
    );
}
