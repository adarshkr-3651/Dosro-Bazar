"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, Image as ImageIcon, MapPin, FileText, X, Tag, AlertCircle, Eye, Loader2, Crosshair, Sparkles, Clock, CreditCard } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card } from "@/app/components/ui/card";
import { Switch } from "@/app/components/ui/switch";
import { Badge } from "@/app/components/ui/badge";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { addItem, generateItemDescription } from "@/app/lib/api";
import { toast } from "sonner";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import ProductCard from "@/app/components/ProductCard";

export default function UploadPage() {
    const router = useRouter();
    const { isBuyerMode, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [useProfileLocation, setUseProfileLocation] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        condition: "",
        price: "",
        content: "",
        location: "",
        images: [] as File[],
        isBiddable: true,
        minBid: "",
        expiry: "",
        offerPrice: "",
        offerDuration: "",
        offerUnit: "h",
        paymentMethods: [] as string[],
        deliveryAvailable: false,
        expiryUnit: "d",
        expiryDuration: "",
    });

    // Load data from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem("uploadFormData");
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setFormData(prev => ({
                    ...prev,
                    ...parsed,
                    images: [] // Images cannot be stored in localStorage easily
                }));
            } catch (e) {
                console.error("Failed to parse saved form data", e);
            }
        }
    }, []);

    // Save data to localStorage when formData changes
    useEffect(() => {
        const dataToSave = { ...formData };
        delete (dataToSave as any).images; // Don't save files
        localStorage.setItem("uploadFormData", JSON.stringify(dataToSave));
    }, [formData]);

    const clearForm = () => {
        setFormData({
            title: "",
            category: "",
            condition: "",
            price: "",
            content: "",
            location: "",
            images: [],
            isBiddable: true,
            minBid: "",
            expiry: "",
            offerPrice: "",
            offerDuration: "",
            offerUnit: "h",
            paymentMethods: [],
            deliveryAvailable: false,
            expiryUnit: "d",
            expiryDuration: "",
        });
        setImagePreviews([]);
        localStorage.removeItem("uploadFormData");
        toast.success("Form cleared");
    };

    const isFormEmpty = () => {
        return !formData.title && !formData.category && !formData.condition && !formData.price && !formData.content && !formData.location && formData.images.length === 0 && !formData.deliveryAvailable && formData.paymentMethods.length === 0 && !formData.offerPrice && !formData.offerDuration && !formData.expiryDuration;
    };

    const categories = [
        "Electronics", "Fashion", "Home & Garden", "Sports", "Collectibles", "Vehicles", "Other"
    ];

    const conditions = [
        "New", "Like New", "Good", "Fair", "Poor"
    ];

    const getWordCount = (text: string) => {
        return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    };

    const handleProfileLocationFill = (checked: boolean) => {
        if (checked) {
            if (user?.address) {
                setFormData(prev => ({ ...prev, location: user.address }));
                setUseProfileLocation(true);
                toast.success("Location filled from profile");
            } else {
                toast.error("Profile location not found", {
                    description: "Please add an address to your profile first."
                });
                setUseProfileLocation(false);
            }
        } else {
            setFormData(prev => ({ ...prev, location: "" }));
            setUseProfileLocation(false);
        }
    };

    const handleLocationFetch = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported");
            return;
        }

        toast.loading("Fetching specific location...", { id: "geo" });
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
                    const data = await res.json();
                    const addr = data.address;

                    // Build a more specific address string
                    const parts = [];
                    // Very specific landmarks
                    if (addr.hospital) parts.push(addr.hospital);
                    if (addr.amenity && addr.amenity !== addr.hospital) parts.push(addr.amenity);
                    if (addr.building) parts.push(addr.building);
                    if (addr.landmark) parts.push(addr.landmark);

                    // Street/Road
                    if (addr.road) parts.push(addr.road);

                    // Locality/Suburb
                    if (addr.suburb) parts.push(addr.suburb);
                    else if (addr.neighbourhood) parts.push(addr.neighbourhood);
                    else if (addr.hamlet) parts.push(addr.hamlet);
                    else if (addr.village) parts.push(addr.village);

                    // City/District
                    if (addr.city) parts.push(addr.city);
                    else if (addr.town) parts.push(addr.town);

                    if (addr.district) parts.push(addr.district);
                    else if (addr.county) parts.push(addr.county);

                    // State
                    if (addr.state) parts.push(addr.state);

                    // Join with commas
                    const locationString = parts.length > 0 ? parts.join(", ") : "Unknown Location";

                    setFormData(prev => ({ ...prev, location: locationString }));
                    toast.success("Location updated", { id: "geo" });
                } catch (error) {
                    setFormData(prev => ({ ...prev, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
                    toast.error("Detailed address not found, coordinates used", { id: "geo" });
                }
            },
            (error) => {
                toast.error("Failed to get location", { id: "geo" });
            }
        );
    };

    const handleGenerateDescription = async () => {
        if (!formData.title) return;

        setLoading(true);
        toast.loading("Generating description with Gemini AI...", { id: "gen" });

        try {
            const result = await generateItemDescription(
                formData.title,
                formData.category,
                formData.condition,
                formData.price
            );

            if (result.success) {
                setFormData(prev => ({ ...prev, content: result.data }));
                toast.success("AI description generated!", { id: "gen" });

                // Auto-adjust textarea height
                setTimeout(() => {
                    const textarea = document.getElementById("content") as HTMLTextAreaElement;
                    if (textarea) {
                        textarea.style.height = "auto";
                        textarea.style.height = `${textarea.scrollHeight}px`;
                    }
                }, 100);
            } else {
                toast.error("Failed to generate description", { id: "gen" });
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to generate description", { id: "gen" });
        } finally {
            setLoading(false);
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        setFormData({ ...formData, price: value });
    };

    const handleMinBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        const listedPrice = parseFloat(formData.price) || 0;
        const maxAllowedBid = listedPrice * 0.85;

        if (parseFloat(value) > maxAllowedBid) {
            toast.error("Starting Bid Too High", {
                description: `Please place a minimum starting bid of 85% or less of the current product price (Max: रु ${Math.floor(maxAllowedBid).toLocaleString()})`
            });
            return;
        }
        setFormData({ ...formData, minBid: value });
    };

    const togglePaymentMethod = (method: string) => {
        setFormData(prev => ({
            ...prev,
            paymentMethods: prev.paymentMethods.includes(method)
                ? prev.paymentMethods.filter(m => m !== method)
                : [...prev.paymentMethods, method]
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement> | FileList) => {
        const files = 'target' in e ? e.target.files : e;
        if (files) {
            const newFiles = Array.from(files);
            setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));

            newFiles.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleImageChange(files);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        const newPreviews = [...imagePreviews];
        newPreviews.splice(index, 1);

        setFormData({ ...formData, images: newImages });
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (getWordCount(formData.content) > 999) {
            toast.error("Description too long", { description: "Maximum 999 words allowed" });
            return;
        }

        if (formData.images.length === 0) {
            toast.error("Image Required", { description: "Please upload at least one image" });
            return;
        }

        if (!formData.title || !formData.content || !formData.price || !formData.location) {
            toast.error("Missing Fields", { description: "Please fill in all required fields" });
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("content", formData.content);
            data.append("price", formData.price);
            data.append("location", formData.location);
            if (formData.category) data.append("category", formData.category);
            if (formData.condition) data.append("condition", formData.condition);
            data.append("isBiddable", String(formData.isBiddable));
            if (formData.isBiddable && formData.minBid) {
                data.append("bidPrice", formData.minBid);
            }
            if (formData.expiry) data.append("expiry", formData.expiry);
            if (formData.offerPrice) data.append("offerPrice", formData.offerPrice);
            if (formData.offerDuration) {
                data.append("offerDuration", formData.offerDuration);
                data.append("offerUnit", formData.offerUnit);
            }
            if (formData.expiry === "Custom" && formData.expiryDuration) {
                data.append("expiryDuration", formData.expiryDuration);
                data.append("expiryUnit", formData.expiryUnit);
            }
            if (formData.paymentMethods.length > 0) {
                data.append("paymentMethods", JSON.stringify(formData.paymentMethods));
            }

            data.append("deliveryAvailable", String(formData.deliveryAvailable));

            formData.images.forEach(image => {
                data.append("images", image);
            });

            await addItem(data);
            toast.success("Success!", { description: "Your item has been uploaded successfully" });

            setFormData({
                title: "",
                category: "",
                condition: "",
                price: "",
                content: "",
                location: "",
                images: [],
                isBiddable: true,
                minBid: "",
                expiry: "",
                offerPrice: "",
                offerDuration: "",
                offerUnit: "h",
                paymentMethods: [],
                deliveryAvailable: false,
                expiryUnit: "d",
                expiryDuration: "",
            });
            setImagePreviews([]);
            localStorage.removeItem("uploadFormData"); // Clear localStorage on successful submit
            setTimeout(() => router.push("/"), 1500);
        } catch (error: any) {
            toast.error("Upload Failed", { description: error.message || "Failed to upload item." });
        } finally {
            setLoading(false);
        }
    };

    const isPriceSet = Number(formData.price) > 0;

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 ">
                <div className="container mx-auto px-4 py-2">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Left Column - Form (Expanded) */}
                        <div className="w-full md:flex-1 space-y-2">
                            <Card className="p-6 md:p-8 shadow-sm border">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Title and List Button Row */}
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                            <Label htmlFor="title" className="text-sm font-semibold">Item Title <span className="text-red-500">*</span></Label>
                                            <Input
                                                id="title"
                                                placeholder="What are you selling?"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 mt-6">
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="h-10 bg-primary hover:bg-primary/90 px-8"
                                            >
                                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publish"}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Price Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="price" className="text-sm font-semibold">Price (Rs.) <span className="text-red-500">*</span></Label>
                                            <div className="relative">
                                                <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="price"
                                                    placeholder="0"
                                                    value={formData.price}
                                                    onChange={handlePriceChange}
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        {/* Location with Geolocation Icon */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="location" className="text-sm font-semibold">Location <span className="text-red-500">*</span></Label>
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-secondary/5 border border-secondary/10">
                                                    <input
                                                        type="checkbox"
                                                        id="useProfileLocation"
                                                        checked={useProfileLocation}
                                                        onChange={(e) => handleProfileLocationFill(e.target.checked)}
                                                        className="w-3 h-3 rounded border-secondary/30 text-secondary focus:ring-secondary/20 cursor-pointer"
                                                    />
                                                    <label htmlFor="useProfileLocation" className="text-[10px] font-medium text-secondary cursor-pointer select-none">
                                                        Fill from Profile
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="relative group">
                                                <button
                                                    type="button"
                                                    onClick={handleLocationFetch}
                                                    className="absolute left-3 top-2.5 text-muted-foreground hover:text-secondary transition-colors z-10"
                                                    title="Get current location"
                                                >
                                                    <MapPin className="h-4 w-4" />
                                                </button>
                                                <Input
                                                    id="location" placeholder="City, Location"
                                                    value={formData.location}
                                                    onChange={(e) => {
                                                        setFormData({ ...formData, location: e.target.value });
                                                        if (useProfileLocation) setUseProfileLocation(false);
                                                    }}
                                                    className="pl-10" required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Auto-expanding Description */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label htmlFor="content" className="text-sm font-semibold">Description <span className="text-red-500">*</span></Label>
                                            <span className={`text-[10px] ${getWordCount(formData.content) > 999 ? 'text-red-500' : 'text-muted-foreground'}`}>
                                                {getWordCount(formData.content)} / 999 words
                                            </span>
                                        </div>
                                        <div className="relative group/desc">
                                            <textarea
                                                id="content"
                                                placeholder="Fill Item Title to Generate Description"
                                                value={formData.content}
                                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                                onInput={(e) => {
                                                    const target = e.target as HTMLTextAreaElement;
                                                    target.style.height = "auto";
                                                    target.style.height = `${target.scrollHeight}px`;
                                                }}
                                                className="w-full min-h-[70px] px-3 py-3 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all overflow-hidden"
                                                required
                                            />
                                            <div className="absolute right-2 top-2 flex items-center gap-2">
                                                {formData.content.length > 0 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setFormData({ ...formData, content: "" })}
                                                        className="h-7 text-[10px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                    >
                                                        Clear
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="absolute right-2 bottom-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleGenerateDescription}
                                                    disabled={!formData.title || loading}
                                                    className={`h-7 gap-2 bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary transition-all duration-300 ${!formData.title ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}
                                                >
                                                    <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Generate</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 50/50 Horizontal Split: Images vs Classification */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                        {/* Left 50%: Image Upload */}
                                        <div className="space-y-3">
                                            <Label className="text-sm font-semibold">Image Upload <span className="text-red-500">*</span></Label>
                                            <div
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                                className={`grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 p-2 rounded-lg border-2 transition-all duration-300 ${isDragging ? 'border-primary border-solid bg-primary/5 scale-[1.01]' : 'border-transparent'}`}
                                            >
                                                {imagePreviews.map((preview, index) => (
                                                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border bg-muted group/img">
                                                        <Image src={preview} alt="Upload" fill className="object-cover" />
                                                        <button
                                                            type="button" onClick={() => removeImage(index)}
                                                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 border border-white/10 hover:bg-black transition-colors"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <label className={`flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-md cursor-pointer transition-all duration-300 ${isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/20 hover:bg-muted/50 hover:border-muted-foreground/40'}`}>
                                                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                                                    <div className="flex flex-col items-center gap-1">
                                                        <Upload className={`h-5 w-5 ${isDragging ? 'text-primary' : 'text-muted-foreground/60'}`} />
                                                        <span className="text-[10px] font-bold text-muted-foreground/40 text-center px-1">
                                                            {isDragging ? 'DROP' : 'ADD'}
                                                        </span>
                                                    </div>
                                                </label>
                                            </div>

                                        </div>

                                        {/* Right 50%: Category & Condition */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="category" className="text-sm font-semibold opacity-70">Category (Optional)</Label>
                                                <select
                                                    id="category" value={formData.category}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
                                                >
                                                    <option value="">Select category</option>
                                                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="condition" className="text-sm font-semibold opacity-70">Condition (Optional)</Label>
                                                <select
                                                    id="condition" value={formData.condition}
                                                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
                                                >
                                                    <option value="">Select condition</option>
                                                    {conditions.map((cond) => <option key={cond} value={cond}>{cond}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bidding and Extras */}
                                    <div className="space-y-4 pt-4 border-t">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                            <div className="flex items-center justify-between p-3 border rounded-md bg-muted/20">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="isBiddable" className="text-sm font-medium">Allow Bidding</Label>
                                                    <p className="text-[10px] text-muted-foreground">Let users offer prices.</p>
                                                </div>
                                                <Switch
                                                    id="isBiddable" checked={formData.isBiddable}
                                                    onCheckedChange={(checked) => setFormData({ ...formData, isBiddable: checked })}
                                                />
                                            </div>

                                            {/* Conditional Bid Field - Horizontal with Toggle */}
                                            {formData.isBiddable && (
                                                <div className={`space-y-2 ${isPriceSet ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                                                    <Label htmlFor="minBid" className="text-xs font-semibold">Min. Starting Bid (Rs.)</Label>
                                                    <div className="relative">
                                                        <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            id="minBid" type="number"
                                                            placeholder={isPriceSet ? "Initial bid" : "Set price first"}
                                                            value={formData.minBid}
                                                            onChange={handleMinBidChange}
                                                            className="pl-10 h-10"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Expiry Selection */}
                                            <div className="space-y-2">
                                                <Label htmlFor="expiry" className="text-sm font-semibold flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-primary" /> Listing Expiry
                                                </Label>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex gap-1">
                                                        {["3d", "7d", "30d", "Never", "Custom"].map((opt) => (
                                                            <Button
                                                                key={opt} type="button" variant={formData.expiry === opt ? "default" : "outline"}
                                                                size="sm" onClick={() => setFormData({ ...formData, expiry: opt })}
                                                                className="flex-1 text-[9px] h-7 px-1 uppercase font-bold"
                                                            >
                                                                {opt}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                    {formData.expiry === "Custom" && (
                                                        <div className="flex gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                                            <Input
                                                                type="number" placeholder="Time"
                                                                value={formData.expiryDuration}
                                                                onChange={(e) => setFormData({ ...formData, expiryDuration: e.target.value })}
                                                                className="h-8 text-[11px] flex-1"
                                                            />
                                                            <select
                                                                value={formData.expiryUnit}
                                                                onChange={(e) => setFormData({ ...formData, expiryUnit: e.target.value })}
                                                                className="h-8 text-[11px] rounded-md border border-input bg-background px-2"
                                                            >
                                                                <option value="h">Hrs</option>
                                                                <option value="d">Days</option>
                                                                <option value="m">Mo</option>
                                                            </select>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Limited Time Offer Price */}
                                            <div className="space-y-2">
                                                <Label htmlFor="offerPrice" className="text-sm font-semibold flex items-center gap-2">
                                                    <Tag className="h-4 w-4 text-primary" /> Limited Time Offer
                                                </Label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Input
                                                        id="offerPrice" type="number" placeholder="Offer Price"
                                                        value={formData.offerPrice}
                                                        onChange={(e) => setFormData({ ...formData, offerPrice: e.target.value })}
                                                        className="h-8 text-[11px]"
                                                    />
                                                    <div className="flex gap-1">
                                                        <Input
                                                            type="number" placeholder="Time"
                                                            value={formData.offerDuration}
                                                            onChange={(e) => setFormData({ ...formData, offerDuration: e.target.value })}
                                                            className="h-8 text-[11px] flex-1"
                                                        />
                                                        <select
                                                            value={formData.offerUnit}
                                                            onChange={(e) => setFormData({ ...formData, offerUnit: e.target.value })}
                                                            className="h-8 text-[10px] rounded-md border border-input bg-background px-1"
                                                        >
                                                            <option value="h">Hrs</option>
                                                            <option value="d">Days</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Payment Methods */}
                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold flex items-center gap-2">
                                                    <CreditCard className="h-4 w-4 text-primary" /> Accepted Payment Methods
                                                </Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {["eSewa", "Khalti", "Cash", "Cash on Delivery", "Bank Transfer"].map((method) => (
                                                        <Badge
                                                            key={method}
                                                            onClick={() => togglePaymentMethod(method)}
                                                            variant={formData.paymentMethods.includes(method) ? "default" : "outline"}
                                                            className="cursor-pointer py-1.5 px-3 select-none hover:bg-primary/10 transition-colors"
                                                        >
                                                            {method}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Delivery Toggle */}
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between p-3 border rounded-md bg-muted/20 h-[50px]">
                                                    <div className="space-y-0.5">
                                                        <span className="text-sm font-medium">Delivery Available</span>
                                                        <p className="text-[10px] text-muted-foreground line-clamp-1">Can you ship this item?</p>
                                                    </div>
                                                    <Switch
                                                        checked={formData.deliveryAvailable}
                                                        onCheckedChange={(checked) => setFormData({ ...formData, deliveryAvailable: checked })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </form>
                            </Card>
                        </div>

                        {/* Right Section: Live Preview (Sticky) */}
                        <div className="w-full lg:w-[350px] md:sticky md:top-24 h-fit">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Eye className="h-5 w-5 text-primary" />
                                        Preview
                                    </h2>
                                    <Badge variant="secondary" className="font-bold text-[10px] bg-secondary text-secondary-foreground uppercase tracking-widest px-3 border-none">Buyer View</Badge>
                                </div>

                                <div className="max-w-sm mx-auto w-full">
                                    <ProductCard
                                        title={formData.title || "Item Title"}
                                        price={Number(formData.price) || 0}
                                        images={imagePreviews}
                                        location={formData.location || "Location"}
                                        timePosted="Just now"
                                        isBiddable={formData.isBiddable}
                                        showEdit={false}
                                        offerPrice={Number(formData.offerPrice) || 0}
                                        offerDuration={formData.offerDuration}
                                        offerUnit={formData.offerUnit}
                                    />
                                </div>

                                <Card className="p-4 bg-muted/30 border-dashed space-y-4">
                                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                                        This is exactly how your item will appear to buyers. Detailed locations build more trust.
                                    </p>
                                    {!isFormEmpty() && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={clearForm}
                                            className="w-full h-8 text-[10px] text-red-500 font-bold uppercase tracking-widest border-dashed hover:bg-destructive/5 hover:text-destructive hover:border-destructive transition-all"
                                        >
                                            Clear Form
                                        </Button>
                                    )}
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
