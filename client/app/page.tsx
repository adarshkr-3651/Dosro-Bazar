"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import {  } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getAllItems, getMyListings, getFavorites, getRecommendations, getSellerStats } from "@/app/lib/api";
import Header from "@/app/components/Header";
import CategoryNav from "@/app/components/CategoryNav";
import HeroBanner from "@/app/components/HeroBanner";
import ProductCard from "@/app/components/ProductCard";
import BookingBanner from "@/app/components/BookingBanner";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Tag, TrendingUp, Activity, ShoppingCart, Loader2, Rocket, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import BoostFlow from "@/app/components/profile/BoostFlow";

function StatCard({ title, value, subtitle, icon, gradient, borderColor, link, onClick }: any) {
  const content = (
    <div 
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border ${borderColor} bg-card p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50`} />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-black tracking-tight">{value}</h3>
          {subtitle && <p className="text-[10px] font-bold text-primary mt-1 uppercase tracking-wider">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-xl bg-background/50 border border-white/10 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          {icon}
        </div>
      </div>
    </div>
  );

  if (link) {
    return <Link href={link} className="block">{content}</Link>;
  }
  return content;
}

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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sellerStats, setSellerStats] = useState({ pendingBidsCount: 0, totalSales: 0, soldItemsCount: 0 });
  const [loadingStats, setLoadingStats] = useState(false);
  const [isBoostOpen, setIsBoostOpen] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);



  // Initialize from mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch all items for Buyer Mode
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const initialLimit = user ? 15 : 10; // 3 rows for logged-in users, 2 rows initially for guests
        const data = await getAllItems(1, initialLimit);
        if (data.success) {
          console.log("[InfiniteScroll] Initial items fetched:", data.data.length, "Total pages:", data.pages);
          setRecentListings(data.data);
          setHasMore(1 < data.pages);
          setPage(1);
        }
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [user]); // Re-fetch when user login status changes

  const loadMore = async () => {
    if (loadingMore || !hasMore || !isBuyerMode || user) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await getAllItems(nextPage, 10);
      if (data.success) {
        console.log("[InfiniteScroll] More items fetched. Page:", nextPage, "New items count:", data.data.length);
        setRecentListings(prev => [...prev, ...data.data]);
        setPage(nextPage);
        setHasMore(nextPage < data.pages);
      }
    } catch (error) {
      console.error("Failed to fetch more items:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Infinite scroll observer for guests
  useEffect(() => {
    if (!mounted || user || !hasMore || !isBuyerMode || !observerTarget.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          console.log("[InfiniteScroll] Trigger intersected!");
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [mounted, user, hasMore, isBuyerMode, page, loadingMore]);

  // Filter listings based on selected category
  const filteredListings = (selectedCategory === "All" 
    ? recentListings 
    : recentListings.filter(item => item.category === selectedCategory)
  ).filter(item => !item.isBooked && item.status !== "sold");

  const filteredRecommended = (selectedCategory === "All"
    ? recommendedItems
    : recommendedItems.filter((item: any) => item.category === selectedCategory)
  ).filter((item: any) => !item.isBooked && item.status !== "sold");

  // Limit listings for Recently Added section
  // Guest mode: show all accumulated items via infinite scroll
  // Logged-in mode: show at least 15 items (3 rows)
  const displayedRecent = user 
    ? (showAllRecent ? filteredListings : filteredListings.slice(0, 15)) 
    : filteredListings;

  // Fetch recommendations only for logged-in users
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return; // Don't fetch for guests
      try {
        const data = await getRecommendations();
        if (data.success) {
          setRecommendedItems(data.data);
        }
      } catch (error) {
        console.error("Error loading recommendations:", error);
      }
    };

    fetchRecommendations();
  }, [user]);

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

  // Fetch seller stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!isBuyerMode && user) {
        setLoadingStats(true);
        try {
          const response = await getSellerStats();
          if (response.success) {
            setSellerStats(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch seller stats:", error);
        } finally {
          setLoadingStats(false);
        }
      }
    };

    fetchStats();
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
      {isBuyerMode && <CategoryNav selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />}

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 space-y-12">
          {/* Hero Banner - Only show in Buyer Mode */}
          {isBuyerMode && (
            <Suspense fallback={<div className="w-full h-[220px] md:h-[400px] rounded-3xl bg-muted animate-pulse" />}>
              <HeroBanner />
            </Suspense>
          )}

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
                  {user && filteredListings.length > 15 && (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAllRecent(!showAllRecent)}
                    >
                      {showAllRecent ? "Show Less" : "View All"}
                    </Button>
                  )}
                </div>
                {displayedRecent.length > 0 ? (
                  <>
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
                    
                    {/* Infinite Scroll Trigger for Guest Users */}
                    {!user && hasMore && (
                      <div 
                        ref={observerTarget}
                        id="infinite-scroll-trigger" 
                        className="h-20 flex items-center justify-center mt-8"
                      >
                        {loadingMore && (
                          <div className="flex gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-xl border-2 border-dashed">
                    <p className="text-muted-foreground">No items found in this category.</p>
                  </div>
                )}
              </section>

              {/* Recommended Items Section - Only for logged-in users */}
              {user && (
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
              )}
            </>
          ) : (
            <>
              {/* Booking Banner for Sellers */}
              <BookingBanner />

              {/* Stats Section */}
              <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <StatCard 
                  title="Active Listings" 
                  value={sellerListings.length} 
                  icon={<Tag className="h-5 w-5 text-emerald-500" />}
                  gradient="from-emerald-500/10 to-transparent"
                  borderColor="border-emerald-500/20"
                />
                <StatCard 
                  title="Total Sales" 
                  value={sellerStats.soldItemsCount || 0} 
                  subtitle={`Revenue: Rs. ${(sellerStats.totalSales || 0).toLocaleString()}`}
                  icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
                  gradient="from-blue-500/10 to-transparent"
                  borderColor="border-blue-500/20"
                />
                <StatCard 
                  title="Pending Bids" 
                  value={sellerStats.pendingBidsCount} 
                  icon={<Activity className="h-5 w-5 text-orange-500" />}
                  gradient="from-orange-500/10 to-transparent"
                  borderColor="border-orange-500/20"
                  link="/notifications"
                />
                <StatCard 
                  title="Boost Product" 
                  value="New" 
                  icon={<Rocket className="h-5 w-5 text-purple-500" />}
                  gradient="from-purple-500/10 to-transparent"
                  borderColor="border-purple-500/20"
                  onClick={() => setIsBoostOpen(true)}
                />
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
      <BoostFlow isOpen={isBoostOpen} onClose={() => setIsBoostOpen(false)} />
    </div>
  );
}

