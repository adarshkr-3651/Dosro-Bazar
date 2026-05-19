"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { getSellerReviews } from "@/app/lib/api";
import { Loader2, Star, Search, MessageSquare, Calendar, UserCircle } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent } from "@/app/components/ui/card";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import Image from "next/image";
import { Badge } from "@/app/components/ui/badge";

interface Review {
    _id: string;
    buyer: { _id: string; username: string; photo: string };
    item: { _id: string; title: string };
    rating: number;
    comment: string;
    createdAt: string;
}

interface ReviewsOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

const resolvePhotoUrl = (photoPath?: string | null) => {
    if (!photoPath) return null;
    if (photoPath.startsWith("http://") || photoPath.startsWith("https://")) return photoPath;
    const cleanedPath = photoPath.replace(/^public\//, "").replace(/^\/+/, "");
    return `${API_BASE_URL}/${cleanedPath.includes("/") ? cleanedPath : `userPhotos/${cleanedPath}`}`;
};

export default function ReviewsOverlay({ isOpen, onClose }: ReviewsOverlayProps) {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchReviews = async () => {
            if (!isOpen || !user?._id) return;
            try {
                setLoading(true);
                const res = await getSellerReviews(user._id);
                if (res.success) {
                    setReviews(res.data);
                }
            } catch (error) {
                toast.error("Failed to fetch reviews");
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [isOpen, user?._id]);

    const filteredReviews = reviews.filter(rev => 
        rev.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.item?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.buyer?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden border-none rounded-[2rem] bg-background shadow-2xl">
                <div className="flex flex-col h-[85vh]">
                    {/* Header Section */}
                    <div className="p-8 pb-4 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-b">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-600">
                                    <Star className="h-6 w-6 fill-current" />
                                </div>
                                <DialogHeader>
                                    <DialogTitle className="text-3xl font-black italic tracking-tight">Seller Reviews</DialogTitle>
                                    <DialogDescription className="text-muted-foreground text-sm">Feedback from your customers.</DialogDescription>
                                </DialogHeader>
                            </div>

                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search reviews..." 
                                    className="pl-9 rounded-2xl border-muted-foreground/20 bg-background/50 backdrop-blur-sm" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full gap-4">
                                <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
                                <p className="text-sm font-bold text-muted-foreground animate-pulse uppercase tracking-widest">Loading your feedback...</p>
                            </div>
                        ) : filteredReviews.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-12 border-2 border-dashed rounded-[2rem] bg-muted/20">
                                <div className="p-6 bg-muted/30 rounded-full mb-6">
                                    <MessageSquare className="h-16 w-16 text-muted-foreground/40" />
                                </div>
                                <h2 className="text-2xl font-black italic">No reviews found</h2>
                                <p className="text-muted-foreground text-sm max-w-xs mt-2">
                                    {searchQuery ? "Try a different search term" : "You haven't received any reviews yet. Complete sales to get feedback!"}
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {filteredReviews.map((rev) => (
                                    <Card key={rev._id} className="overflow-hidden border-muted/60 hover:shadow-xl hover:border-amber-500/20 transition-all group rounded-2xl">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col md:flex-row">
                                                <div className="flex-1 p-5 md:p-6 flex gap-4 items-start">
                                                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-muted border shrink-0">
                                                        {rev.buyer?.photo ? (
                                                            <Image 
                                                                src={resolvePhotoUrl(rev.buyer.photo) || ""} 
                                                                alt={rev.buyer.username} 
                                                                fill 
                                                                className="object-cover" 
                                                                unoptimized={rev.buyer.photo.startsWith('http')}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <UserCircle className="w-8 h-8 text-muted-foreground/40" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <span className="text-sm font-bold">{rev.buyer?.username || "Anonymous"}</span>
                                                            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1 h-5 text-[10px] font-black">
                                                                <Star className="w-2.5 h-2.5 fill-current" />
                                                                {rev.rating.toFixed(1)}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-foreground/80 leading-relaxed italic mb-3">
                                                            &quot;{rev.comment || "No comment provided."}&quot;
                                                        </p>
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                                <Calendar className="h-3.5 w-3.5 text-amber-500/60" />
                                                                {new Date(rev.createdAt).toLocaleDateString()}
                                                            </div>
                                                            {rev.item && (
                                                                <div className="text-[10px] font-bold uppercase tracking-widest text-primary/40 truncate">
                                                                    Item: {rev.item.title}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Footer Stats */}
                    <div className="p-6 bg-muted/30 border-t flex justify-between items-center px-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                            Total Reviews: <span className="text-amber-500">{reviews.length}</span>
                        </p>
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">
                            Verified Reviews Only
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
