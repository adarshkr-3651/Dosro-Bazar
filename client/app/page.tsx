"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { getAllItems, getMyListings, getFavorites, getRecommendations } from "@/app/lib/api";
import Header from "@/app/components/Header";
import CategoryNav from "@/app/components/CategoryNav";
import HeroBanner from "@/app/components/HeroBanner";
import ProductCard from "@/app/components/ProductCard";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export default function Home() {
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [sellerListings, setSellerListings] = useState<any[]>([]);
  const [recommendedItems, setRecommendedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isBuyerMode, setIsBuyerMode } = useAuth(); // Using AuthContext to check login status
  const [mounted, setMounted] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAllRecent, setShowAllRecent] = useState(false);

  // Initialize from mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch all items for Buyer Mode
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getAllItems();
        if (data.success) {
          setRecentListings(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Filter listings based on selected category
  const filteredListings = selectedCategory === "All" 
    ? recentListings 
    : recentListings.filter(item => item.category === selectedCategory);

  const filteredRecommended = selectedCategory === "All"
    ? recommendedItems
    : recommendedItems.filter((item: any) => item.category === selectedCategory);

  // Limit listings for Recently Added section
  // 2 rows = 10 items (assuming 5 cols)
  // 5 rows = 25 items
  const displayedRecent = showAllRecent 
    ? filteredListings.slice(0, 25) 
    : filteredListings.slice(0, 10);

  // Fetch recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        console.log("[Home] Fetching recommendations...");
        const data = await getRecommendations();
        if (data.success) {
          console.log(`[Home] Successfully loaded ${data.data?.length || 0} recommendations.`);
          setRecommendedItems(data.data);
        }
      } catch (error) {
        console.error("[Home] Error loading recommendations:", error);
      }
    };

    fetchRecommendations();
  }, []);

  // Fetch user's items for Seller Mode
  useEffect(() => {
    const fetchSellerItems = async () => {
      if (!isBuyerMode && user) {
        try {
          const data = await getMyListings();
          if (data.success) {
            setSellerListings(data.data);
          }
        } catch (error) {
          console.error("Failed to fetch seller items:", error);
        }
      }
    };

    fetchSellerItems();
  }, [isBuyerMode, user]);

  // Fetch favorites when user is logged in
  useEffect(() => {
    const fetchFavoriteIds = async () => {
      if (user) {
        try {
          const response = await getFavorites();
          if (response.success && Array.isArray(response.data)) {
            // response.data is array of objects, map to IDs
            setFavoriteIds(new Set(response.data.map((item: any) => item._id)));
          }
        } catch (error) {
          console.error("Failed to fetch favorites:", error);
        }
      }
    };
    fetchFavoriteIds();
  }, [user]);

  const handleFavoriteToggle = (itemId: string, isFav: boolean) => {
    setFavoriteIds((prev) => {
      const newSet = new Set(prev);
      if (isFav) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  };


  if (!mounted) {
    return null; // or a loading spinner to prevent hydration mismatch
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CategoryNav selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 space-y-12">
          {/* Hero Banner - Only show in Buyer Mode */}
          {isBuyerMode && <HeroBanner />}

          {isBuyerMode ? (
            <>
              {/* Recently Listed Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Recently Listed</h2>
                    <p className="text-muted-foreground">
                      {selectedCategory !== "All" 
                        ? `Showing items in ${selectedCategory}` 
                        : "Fresh items just added to the marketplace"}
                    </p>
                  </div>
                  {filteredListings.length > 10 && (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAllRecent(!showAllRecent)}
                    >
                      {showAllRecent ? "Show Less" : "View All"}
                    </Button>
                  )}
                </div>
                {displayedRecent.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                    {displayedRecent.map((product) => (
                      <ProductCard
                        key={product._id}
                        id={product._id}
                        slug={product.slug}
                        {...product}
                        isFavorite={favoriteIds.has(product._id)}
                        onFavoriteToggle={() => handleFavoriteToggle(product._id, !favoriteIds.has(product._id))}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-xl border-2 border-dashed">
                    <p className="text-muted-foreground">No items found in this category.</p>
                  </div>
                )}
              </section>

              {/* Recommended Items Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Recommended for You</h2>
                    <p className="text-muted-foreground">
                      {selectedCategory !== "All" 
                        ? `Recommendations in ${selectedCategory}` 
                        : "Handpicked based on your interests"}
                    </p>
                  </div>
                  <Button variant="outline">View All</Button>
                </div>
                {filteredRecommended.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                    {filteredRecommended.map((product: any) => (
                      <ProductCard
                        key={product._id}
                        id={product._id}
                        slug={product.slug}
                        {...product}
                        isFavorite={favoriteIds.has(product._id)}
                        onFavoriteToggle={() => handleFavoriteToggle(product._id, !favoriteIds.has(product._id))}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-xl border-2 border-dashed">
                    <p className="text-muted-foreground">No recommendations found in this category.</p>
                  </div>
                )}
              </section>
            </>
          ) : (
            <>
              {/* Stats Section */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/active-listings" className="block transition-transform hover:scale-[1.02]">
                  <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl py-3 px-6 text-white shadow-sm">
                    <h3 className="text-sm font-semibold mb-0.5 opacity-90">Active Listings</h3>
                    <p className="text-3xl font-bold">{sellerListings.length}</p>
                  </div>
                </Link>
                <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-xl py-3 px-6 text-white shadow-sm">
                  <h3 className="text-sm font-semibold mb-0.5 opacity-90">Total Sales</h3>
                  <p className="text-3xl font-bold">Rs. 4,250</p>
                </div>
                <div className="bg-gradient-to-br from-primary/80 to-secondary/80 rounded-xl py-3 px-6 text-white shadow-sm">
                  <h3 className="text-sm font-semibold mb-0.5 opacity-90">Pending Bids</h3>
                  <p className="text-3xl font-bold">8</p>
                </div>
              </section>

              {/* Seller Mode View */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Your Listings</h2>
                    <p className="text-muted-foreground">Manage your items and track performance</p>
                  </div>
                  <Button className="gap-2" asChild>
                    <Link href="/upload">
                      Upload New Item
                    </Link>
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                  {sellerListings.map((product) => (
                    <ProductCard key={product._id} id={product._id} slug={product.slug} {...product} showEdit={true} />
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

