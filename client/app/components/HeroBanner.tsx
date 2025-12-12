"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";

const HeroBanner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-secondary rounded-2xl">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Buy, Sell, or Bid on Amazing Deals
          </h1>
          <p className="text-lg text-white/90 mb-6">
            Join thousands of happy buyers and sellers. Find great deals or sell your items quickly and easily.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" variant="secondary" className="gap-2">
              Start Selling
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="bg-white hover:bg-white/90">
              Browse Items
            </Button>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-secondary/20 rounded-full blur-2xl" />
      </div>
    </div>
  );
};

export default HeroBanner;

