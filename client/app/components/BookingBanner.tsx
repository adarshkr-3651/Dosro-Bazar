"use client";

import { useState, useEffect } from "react";
import { getMyBookings } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { X, Wallet, Phone, Mail, User } from "lucide-react";
import Image from "next/image";
import { resolvePhotoUrl } from "@/app/lib/image-utils";

interface Booking {
    _id: string;
    buyer: {
        username: string;
        phone?: string;
        email?: string;
        photo?: string;
    };
    item: {
        title: string;
        images?: string[];
        price: number;
        slug: string;
    };
    amount: number;
    createdAt: string;
}

export default function BookingBanner() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [dismissed, setDismissed] = useState<string[]>([]);

    useEffect(() => {
        if (!user) return;
        const fetchBookings = async () => {
            try {
                const res = await getMyBookings();
                if (res.success && res.data?.length > 0) {
                    setBookings(res.data);
                    
                    // Auto-dismiss after 5 seconds
                    res.data.forEach((booking: Booking) => {
                        setTimeout(() => {
                            setDismissed(prev => [...prev, booking._id]);
                        }, 5000);
                    });
                }
            } catch {
                // silently fail
            }
        };
        fetchBookings();
    }, [user]);

    const visibleBookings = bookings.filter(b => !dismissed.includes(b._id));
    if (visibleBookings.length === 0) return null;

    return (
        <div className="space-y-3 mb-6">
            {visibleBookings.map((booking) => (
                <div
                    key={booking._id}
                    className="relative overflow-hidden rounded-2xl border border-green-500/20 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-teal-500/5 p-4 md:p-5 shadow-sm"
                >
                    <button
                        onClick={() => setDismissed(prev => [...prev, booking._id])}
                        className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted text-muted-foreground transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Product image */}
                        <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0 border shadow-sm">
                            <Image
                                src={resolvePhotoUrl(booking.item.images?.[0] || "/placeholder.jpg")}
                                alt={booking.item.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-[10px] font-bold uppercase tracking-widest">
                                    <Wallet className="w-3 h-3" />
                                    Product Booked
                                </span>
                            </div>
                            <p className="text-sm font-semibold text-foreground">
                                Your product <span className="text-primary">"{booking.item.title}"</span> has been booked by{" "}
                                <span className="text-primary">{booking.buyer.username}</span>
                            </p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1 font-bold text-green-600">
                                    <Wallet className="w-3 h-3" />
                                    Rs. {booking.amount.toLocaleString()} paid to Dosro Bazar
                                </span>
                                {booking.buyer.phone && (
                                    <span className="flex items-center gap-1">
                                        <Phone className="w-3 h-3" />
                                        {booking.buyer.phone}
                                    </span>
                                )}
                                {booking.buyer.email && (
                                    <span className="flex items-center gap-1">
                                        <Mail className="w-3 h-3" />
                                        {booking.buyer.email}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
