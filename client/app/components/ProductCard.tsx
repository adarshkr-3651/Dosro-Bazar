import { useState, useEffect } from "react";
import { Heart, MapPin } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { toggleFavorite } from "../lib/api";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

interface ProductCardProps {
  id?: string | number;
  slug?: string;
  title: string;
  price: number;
  image: string;
  location: string;
  timePosted: string;
  isBiddable?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  showEdit?: boolean;
}

const ProductCard = ({
  id,
  slug,
  title,
  price,
  image,
  location,
  timePosted,
  isBiddable = false,
  isFavorite: initialFavorite = false,
  onFavoriteToggle,
  showEdit = false,
}: ProductCardProps) => {
  const [isFav, setIsFav] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);
  const { isBuyerMode } = useAuth();

  // Sync internal state with prop changes (for when parent updates list)
  useEffect(() => {
    setIsFav(initialFavorite);
  }, [initialFavorite]);

  // Construct the detail page URL. Use slug if available, otherwise fall back to id.
  // Ideally, backend items always have slugs.
  // If showEdit is true (Seller Mode), we go straight to edit page on click
  const productUrl = showEdit
    ? (slug ? `/products/${slug}/edit` : `/products/${id}/edit`)
    : (slug ? `/products/${slug}` : `/products/${id}`);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product detail
    e.stopPropagation();

    if (!slug) {
      toast.error("Cannot favorite this item (missing slug)");
      return;
    }

    setLoading(true);
    try {
      const response = await toggleFavorite(slug);
      setIsFav(response.status); // backend returns { status: true/false } for added/removed
      toast.success(response.message);
      if (onFavoriteToggle) onFavoriteToggle();
    } catch (error: any) {
      toast.error(error.message || "Failed to update favorite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-xl border-muted/60">
      <div className="relative aspect-square overflow-hidden bg-muted/30">
        {/* Fallback image handling could be improved, but assuming image is valid URL for now */}
        <Link href={productUrl} className="block w-full h-full">
          <Image
            src={image || "/placeholder.jpg"}
            alt={title}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out p-1"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        {isBuyerMode && !showEdit && (
          <Button
            size="icon"
            variant="secondary"
            className={`absolute top-2 right-2 z-10 h-7 w-7 rounded-full shadow-sm transition-all duration-300 ${isFav
              ? "bg-white text-red-500 hover:bg-white hover:text-red-600 hover:scale-110"
              : "bg-white/80 text-gray-400 hover:bg-white hover:text-red-400 hover:scale-110"
              }`}
            onClick={handleFavoriteClick}
            disabled={loading}
          >
            <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-current" : ""}`} />
          </Button>
        )}
        {isBiddable && isBuyerMode && !showEdit && (
          <Badge className="absolute top-2 left-2 bg-black/70 hover:bg-black/80 text-white backdrop-blur-sm px-2 py-0.5 text-[10px] h-5 font-normal tracking-wide z-10 rounded-full border-none">
            Bid
          </Badge>
        )}


      </div>
      <CardContent className="p-3">
        <Link href={productUrl} className="block mb-1.5">
          <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors text-foreground/90">{title}</h3>
        </Link>
        <div className="flex items-center justify-between mb-2">
          <span className="text-base font-bold text-primary tracking-tight">Rs. {price.toLocaleString()}</span>
          {isBiddable && isBuyerMode && !showEdit && (
            <Button size="sm" variant="outline" className="h-6 text-[10px] px-2 rounded-full pointer-events-none bg-transparent hover:bg-transparent">
              Bid Now
            </Button>
          )}


          {showEdit && (
            <Button size="sm" variant="ghost" className="h-7 text-xs px-2 hover:bg-muted" asChild onClick={(e) => e.stopPropagation()}>
              <Link href={`/products/${slug}/edit`}>
                Edit
              </Link>
            </Button>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
          <MapPin className="h-3 w-3 shrink-0 opacity-70" />
          <span className="truncate max-w-[60%]">{location}</span>
          <span className="ml-auto text-[10px] whitespace-nowrap opacity-60">{timePosted}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

