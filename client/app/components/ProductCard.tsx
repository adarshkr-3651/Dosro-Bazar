import { useState, useEffect } from "react";
import { Heart, MapPin, Image as ImageIcon, ChevronLeft, ChevronRight, Trash2, Pencil, Eye } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { toggleFavorite } from "../lib/api";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { MarkAsSoldModal } from "./notifications/MarkAsSoldModal";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { moveToRecycleBin } from "../lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/app/components/ui/dialog";
import { ProductPreviewModal } from "./ProductPreviewModal";

import { resolvePhotoUrl } from "../lib/image-utils";

interface ProductCardProps {
  id?: string | number;
  slug?: string;
  title: string;
  price: number;
  image?: string; // Kept for backward compatibility
  images?: string[];
  location: string;
  timePosted: string;
  isBiddable?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  showEdit?: boolean;
  offerPrice?: number;
  offerDuration?: string;
  offerUnit?: string;
  offerExpiresAt?: string | Date;
}

const ProductCard = ({
  id,
  slug,
  title,
  price,
  image,
  images,
  location,
  timePosted,
  isBiddable = false,
  isFavorite: initialFavorite = false,
  onFavoriteToggle,
  showEdit = false,
  offerPrice = 0,
  offerDuration = "",
  offerUnit = "h",
  offerExpiresAt,
}: ProductCardProps) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFav, setIsFav] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);
  const { user, isBuyerMode } = useAuth();
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isMarkSoldOpen, setIsMarkSoldOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const rawImages = (images && images.length > 0 ? images : (image ? [image] : [])).filter(img => img && img !== "");
  const allImages = rawImages.map(img => resolvePhotoUrl(img)).filter(Boolean) as string[];
  const hasMultipleImages = allImages.length > 1;

  // Auto-slide effect
  useEffect(() => {
    if (!hasMultipleImages) return;

    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % allImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [hasMultipleImages, allImages.length]);

  // Sync internal state with prop changes (for when parent updates list)
  useEffect(() => {
    if (user) {
      setIsFav(initialFavorite);
    } else if (slug) {
      // Check local storage for guests
      const localFavs = JSON.parse(localStorage.getItem("local_favorites") || "[]");
      setIsFav(localFavs.includes(slug));
    }
  }, [initialFavorite, user, slug]);

  // Offer Countdown Effect
  useEffect(() => {
    if (!offerExpiresAt || offerPrice <= 0) {
      setTimeLeft("");
      return;
    }

    const calculateTimeLeft = () => {
      const expiryDate = new Date(offerExpiresAt);
      const now = new Date();
      const difference = expiryDate.getTime() - now.getTime();

      if (difference <= 0) {
        return "Expired";
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m ${seconds}s`;
      }
    };

    // Initial update
    const initial = calculateTimeLeft();
    setTimeLeft(initial);

    // If already expired, no need for interval
    if (initial === "Expired") return;

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining === "Expired") {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [offerExpiresAt, offerPrice]);

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

    if (user) {
      setLoading(true);
      try {
        const response = await toggleFavorite(slug);
        setIsFav(response.status); // backend returns { status: true/false } for added/removed
        toast.success(response.message);
        // Trigger instant header update
        window.dispatchEvent(new CustomEvent('favoritesUpdated'));
        if (onFavoriteToggle) onFavoriteToggle();
      } catch (error: any) {
        toast.error(error.message || "Failed to update favorite");
      } finally {
        setLoading(false);
      }
    } else {
      // Anonymous user: Show themed login message
      toast.error("Login Required", {
        description: "Please log in to add items to your favorites",
        className: "toast-auth-required",
        action: {
          label: "Login",
          onClick: () => (window.location.href = "/login"),
        },
      });
    }
  };

  const handleBidClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Login Required", {
        description: "Log in please to place bid",
        className: "toast-auth-required",
        action: {
          label: "Login",
          onClick: () => (window.location.href = "/login"),
        },
      });
    } else {
      // Navigate to product detail page where bidding happens
      window.location.href = productUrl;
    }
  };

  const handleProductClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      e.stopPropagation();
      toast.error("Login Required", {
        description: "Please log in to view product details",
        className: "toast-auth-required",
        action: {
          label: "Login",
          onClick: () => (window.location.href = "/login"),
        },
      });
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-xl border-muted/60">
      <div className="relative aspect-square overflow-hidden bg-muted/30">
        {/* Fallback image handling could be improved, but assuming image is valid URL for now */}
        {allImages.length > 0 ? (
          <Link href={productUrl} className="block w-full h-full" onClick={handleProductClick}>
            <div className="relative w-full h-full">
              {allImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === currentIdx ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                >
                  <Image
                    src={img}
                    alt={`${title} - view ${idx + 1}`}
                    fill
                    className="object-contain p-1"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ))}

              {/* Carousel Navigation */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/20"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/20"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Pagination Dots */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1 px-2 py-1 rounded-full bg-black/10 backdrop-blur-sm">
                    {allImages.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-300 ${i === currentIdx ? "w-3 bg-white" : "w-1 bg-white/50"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </Link>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 bg-muted/20">
            <ImageIcon className="h-12 w-12 mb-1" />
            <span className="text-[10px] font-medium uppercase tracking-widest">No Preview</span>
          </div>
        )}
        {user && isBuyerMode && !showEdit && (
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
        {showEdit && (
          <>
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 left-2 z-10 h-7 w-7 rounded-full shadow-sm bg-white/80 text-primary hover:bg-white hover:scale-110 transition-all duration-300"
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <Link href={`/products/${slug}/edit`}>
                <Pencil className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2 z-10 h-7 w-7 rounded-full shadow-sm bg-white/80 text-red-500 hover:bg-white hover:text-red-600 hover:scale-110 transition-all duration-300"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDeleteConfirmOpen(true);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-2 right-2 z-10 h-7 w-7 rounded-full shadow-sm bg-white/80 text-primary hover:bg-white hover:scale-110 transition-all duration-300"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsPreviewOpen(true);
              }}
              title="Preview as Buyer"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
        {offerPrice > 0 && timeLeft !== "Expired" && (
          <Badge className="absolute bottom-2 left-2 bg-red-500 hover:bg-red-600 text-white backdrop-blur-sm px-2 py-0.5 text-[10px] h-5 font-bold tracking-wide z-10 rounded-full border-none flex items-center gap-1 shadow-sm">
            <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
            OFFER {timeLeft ? <span>• {timeLeft}</span> : (offerDuration && <span>• {offerDuration}{offerUnit}</span>)}
          </Badge>
        )}
      </div>
      <CardContent className="p-3">
        <Link href={productUrl} className="block mb-1.5" onClick={handleProductClick}>
          <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors text-foreground/90">{title}</h3>
        </Link>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-2">
          {offerPrice > 0 && timeLeft !== "Expired" ? (
            <>
              <span className="text-base font-bold text-red-500 tracking-tight">Rs. {offerPrice.toLocaleString()}</span>
              <span className="text-[11px] text-muted-foreground/60 line-through decoration-muted-foreground/40">Rs. {price.toLocaleString()}</span>
            </>
          ) : (
            <span className="text-base font-bold text-primary tracking-tight">Rs. {price.toLocaleString()}</span>
          )}
          {isBiddable && isBuyerMode && !showEdit && (
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-[10px] px-2 rounded-full bg-transparent hover: border-brown text-black transition-colors"
              onClick={handleBidClick}
            >
              Bid Now
            </Button>
          )}

          {showEdit && (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[10px] px-2 rounded-lg border-green-500/20 text-green-600 hover:bg-green-500/5 font-bold uppercase tracking-wider"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMarkSoldOpen(true);
                }}
              >
                Sold
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
          <MapPin className="h-3 w-3 shrink-0 opacity-70" />
          <span className="truncate max-w-[60%]">{location}</span>
          <span className="ml-auto text-[10px] whitespace-nowrap opacity-60">{timePosted}</span>
        </div>
      </CardContent>
      {id && (
        <MarkAsSoldModal
          isOpen={isMarkSoldOpen}
          onClose={() => setIsMarkSoldOpen(false)}
          productId={id.toString()}
          productTitle={title}
          productPrice={price}
          onSuccess={() => {
            // Ideally trigger a refresh of the parent list
            window.location.reload();
          }}
        />
      )}

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="items-center text-center">
            <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertTriangle className="h-7 w-7 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-bold">Move to Recycle Bin?</DialogTitle>
            <DialogDescription className="text-sm">
              This product will be removed from the listings and stored in your **Recycle Bin** for 30 days before permanent deletion.
              <br /><br />
              All bidders will be notified. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="ghost" onClick={() => setIsDeleteConfirmOpen(false)} className="rounded-xl">Cancel</Button>
            <Button
              variant="destructive"
              className="rounded-xl gap-2"
              disabled={isDeleting}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDeleting(true);
                try {
                  await moveToRecycleBin(id!.toString());
                  toast.success("Product moved to recycle bin");
                  window.location.reload();
                } catch (error: any) {
                  toast.error(error.message || "Failed to delete product");
                } finally {
                  setIsDeleting(false);
                  setIsDeleteConfirmOpen(false);
                }
              }}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Move to Bin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {slug && (
        <ProductPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          slug={slug}
        />
      )}
    </Card>
  );
};

export default ProductCard;
