"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import CategoryNav from "@/app/components/CategoryNav";
import HeroBanner from "@/app/components/HeroBanner";
import ProductCard from "@/app/components/ProductCard";
import Footer from "@/app/components/Footer";
import { Button } from "@/app/components/ui/button";

export default function Home() {
  const [isBuyerMode, setIsBuyerMode] = useState(true);

  // Mock data for products
  const recentListings = [
    {
      id: 1,
      title: "iPhone 14 Pro - Excellent Condition",
      price: 899,
      image: "data:image/webp;base64,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",
      location: "San Francisco, CA",
      timePosted: "2h ago",
      isBiddable: true,
    },
    {
      id: 2,
      title: "Vintage Leather Jacket",
      price: 150,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
      location: "Los Angeles, CA",
      timePosted: "5h ago",
      isBiddable: true,
    },
    {
      id: 3,
      title: "MacBook Pro 16\" 2023",
      price: 2199,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
      location: "Seattle, WA",
      timePosted: "1d ago",
      isBiddable: false,
    },
    {
      id: 4,
      title: "Gaming Chair - Like New",
      price: 299,
      image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400",
      location: "Austin, TX",
      timePosted: "3h ago",
      isBiddable: true,
    },
    {
      id: 5,
      title: "Canon EOS R5 Camera",
      price: 3299,
      image: "https://images.unsplash.com/photo-1606980702954-f34cb5446478?w=400",
      location: "New York, NY",
      timePosted: "6h ago",
      isBiddable: false,
    },
    {
      id: 6,
      title: "Designer Sneakers Collection",
      price: 450,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      location: "Miami, FL",
      timePosted: "12h ago",
      isBiddable: true,
    },
  ];

  const recommendedItems = [
    {
      id: 7,
      title: "Smart Watch Series 8",
      price: 399,
      image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400",
      location: "Boston, MA",
      timePosted: "4h ago",
      isBiddable: false,
    },
    {
      id: 8,
      title: "Mountain Bike - Carbon Frame",
      price: 1200,
      image: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400",
      location: "Denver, CO",
      timePosted: "8h ago",
      isBiddable: true,
    },
    {
      id: 9,
      title: "Acoustic Guitar - Professional",
      price: 650,
      image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400",
      location: "Nashville, TN",
      timePosted: "1d ago",
      isBiddable: false,
    },
    {
      id: 10,
      title: "Designer Handbag",
      price: 850,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
      location: "Chicago, IL",
      timePosted: "10h ago",
      isBiddable: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isBuyerMode={isBuyerMode} onModeToggle={setIsBuyerMode} />
      <CategoryNav />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 space-y-12">
          {/* Hero Banner */}
          <HeroBanner />

          {isBuyerMode ? (
            <>
              {/* Recently Listed Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Recently Listed</h2>
                    <p className="text-muted-foreground">Fresh items just added to the marketplace</p>
                  </div>
                  <Button variant="outline">View All</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recentListings.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              </section>

              {/* Recommended Items Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Recommended for You</h2>
                    <p className="text-muted-foreground">Handpicked based on your interests</p>
                  </div>
                  <Button variant="outline">View All</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recommendedItems.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              </section>
            </>
          ) : (
            <>
              {/* Seller Mode View */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Your Listings</h2>
                    <p className="text-muted-foreground">Manage your items and track performance</p>
                  </div>
                  <Button className="gap-2">
                    Upload New Item
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recentListings.slice(0, 3).map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              </section>

              {/* Stats Section */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Active Listings</h3>
                  <p className="text-4xl font-bold">12</p>
                </div>
                <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Total Sales</h3>
                  <p className="text-4xl font-bold">$4,250</p>
                </div>
                <div className="bg-gradient-to-br from-primary/80 to-secondary/80 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Pending Bids</h3>
                  <p className="text-4xl font-bold">8</p>
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

