"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { getMyBookings } from "@/app/lib/api";
import { Loader2, Wallet, ExternalLink, Calendar, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";

interface BookingsOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BookingsOverlay({ isOpen, onClose }: BookingsOverlayProps) {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchBookings();
        }
    }, [isOpen]);

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getMyBookings();
            if (response.success) {
                setBookings(response.data);
            } else {
                setError(response.message || "Failed to load bookings");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-hidden flex flex-col p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="flex items-center gap-2 text-2xl text-green-600">
                        <Wallet className="h-6 w-6" />
                        Advance Bookings
                    </DialogTitle>
                    <DialogDescription>
                        Items you've secured with advance payments.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 p-6 pt-2">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-green-600 mb-4" />
                            <p className="text-muted-foreground text-sm">Fetching your secured items...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-500 mb-2">Error: {error}</p>
                            <button onClick={fetchBookings} className="text-primary text-sm hover:underline">Try again</button>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-12">
                            <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <p className="text-muted-foreground">No items booked yet.</p>
                            <Link href="/" onClick={onClose} className="text-green-600 text-sm hover:underline mt-2 inline-block">Explore products</Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <div key={booking._id} className="group relative flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border bg-card hover:border-green-200 dark:hover:border-green-900 transition-all overflow-hidden shadow-sm hover:shadow-md">
                                    {/* Status Overlay Ribbon */}
                                    <div className="absolute top-3 right-3 z-10">
                                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 dark:border-green-900 flex items-center gap-1 py-1 px-3">
                                            <ShieldCheck className="h-3 w-3" /> Secured
                                        </Badge>
                                    </div>

                                    <div className="relative h-32 sm:w-32 rounded-xl overflow-hidden shrink-0 border bg-muted">
                                        {booking.item?.images?.[0] ? (
                                            <Image 
                                                src={booking.item.images[0].startsWith('http') ? booking.item.images[0] : `${process.env.NEXT_PUBLIC_API_URL}/${booking.item.images[0]}`}
                                                alt={booking.item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-muted-foreground/30">
                                                <Wallet className="h-12 w-12" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-bold text-lg truncate mb-1">
                                                {booking.item?.title || "Item Unavailable"}
                                            </h4>
                                            
                                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-3">
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Booked Price</p>
                                                    <p className="text-sm font-bold">Rs. {booking.amount.toLocaleString()}</p>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Full Price</p>
                                                    <p className="text-sm font-medium text-muted-foreground line-through">Rs. {booking.item?.price?.toLocaleString() || "N/A"}</p>
                                                </div>
                                                <div className="space-y-0.5 col-span-2">
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Transaction ID</p>
                                                    <p className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded inline-block">{booking.transactionId}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-2 pt-2 border-t">
                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(booking.createdAt).toLocaleDateString(undefined, {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                {booking.item?.slug && (
                                                    <Link 
                                                        href={`/products/${booking.item.slug}`} 
                                                        onClick={onClose}
                                                        className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:bg-primary/5 px-2 py-1 rounded transition-colors"
                                                    >
                                                        Item Page <ExternalLink className="h-3 w-3" />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                
                <div className="p-4 bg-muted/30 border-t flex items-center gap-2 text-[11px] text-muted-foreground italic">
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                    Advance payments are secured by Dosro Bazar. Contact support if you face issues with the seller.
                </div>
            </DialogContent>
        </Dialog>
    );
}
