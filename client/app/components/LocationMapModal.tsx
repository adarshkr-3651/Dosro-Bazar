"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { MapPin, Navigation, Loader2, X, Locate } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";

interface LocationMapModalProps {
    isOpen: boolean;
    onClose: () => void;
    destination: string;
    title: string;
}

export function LocationMapModal({ isOpen, onClose, destination, title }: LocationMapModalProps) {
    const [userLocation, setUserLocation] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [mapUrl, setMapUrl] = useState<string>("");

    useEffect(() => {
        if (isOpen) {
            updateMapUrl();
        }
    }, [isOpen, destination]);

    const updateMapUrl = (origin: string | null = null) => {
        const encodedDest = encodeURIComponent(destination);
        if (origin) {
            const encodedOrigin = encodeURIComponent(origin);
            setMapUrl(`https://maps.google.com/maps?saddr=${encodedOrigin}&daddr=${encodedDest}&output=embed`);
        } else {
            setMapUrl(`https://maps.google.com/maps?q=${encodedDest}&output=embed`);
        }
    };

    const handleGetDirections = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const origin = `${position.coords.latitude},${position.coords.longitude}`;
                setUserLocation(origin);
                updateMapUrl(origin);
                setLoading(false);
                toast.success("Route calculated from your current location!");
            },
            (error) => {
                setLoading(false);
                console.error("Geolocation error:", error);
                toast.error("Could not get your location. Showing item location instead.");
                updateMapUrl();
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden border-none rounded-3xl h-[80vh] flex flex-col bg-background">
                <DialogHeader className="p-6 border-b flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold tracking-tight">{title}</DialogTitle>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{destination}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 pr-8">
                        <Button 
                            onClick={handleGetDirections} 
                            disabled={loading}
                            variant="secondary"
                            className="h-9 gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl bg-primary/5 text-primary hover:bg-primary/10 border-none"
                        >
                            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Navigation className="h-3 w-3" />}
                            Get Directions
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 relative bg-muted/20">
                    {mapUrl ? (
                        <iframe
                            title="Location Map"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{ border: 0 }}
                            src={mapUrl}
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}
                </div>
                
                <div className="p-4 bg-muted/5 border-t text-center">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest italic">
                        Click "Get Directions" to see the path from your current location
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
