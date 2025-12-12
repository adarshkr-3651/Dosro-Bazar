"use client";

import { Heart, MapPin } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import Image from "next/image";

interface ProductCardProps {
  title: string;
  price: number;
  image: string;
  location: string;
  timePosted: string;
  isBiddable?: boolean;
}

const ProductCard = ({ title, price, image, location, timePosted, isBiddable = false }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white hover:text-secondary z-10"
        >
          <Heart className="h-4 w-4" />
        </Button>
        {isBiddable && (
          <Badge className="absolute top-2 left-2 bg-secondary z-10">
            Open to Bids
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2">{title}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-primary">${price}</span>
          {isBiddable && (
            <Button size="sm" variant="outline" className="text-xs">
              Place Bid
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{location}</span>
          <span className="ml-auto text-xs">{timePosted}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

