"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Upload, Image as ImageIcon, MapPin, FileText, X, Tag, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card } from "@/app/components/ui/card";
import { Switch } from "@/app/components/ui/switch";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { getEditItemData, updateItem } from "@/app/lib/api";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams<{ slug: string }>(); // Use useParams hook
    const { user, isBuyerMode } = useAuth();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        price: "",
        location: "",
        category: "",
        condition: "",
        isBiddable: false,
        image: null as File | null,
    });

    const categories = [
        "Electronics",
        "Fashion",
        "Home & Garden",
        "Sports",
        "Collectibles",
        "Vehicles",
        "Other"
    ];

    const conditions = [
        "New",
        "Like New",
        "Good",
        "Fair",
        "Poor"
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getEditItemData(params.slug);
                if (response.success && response.data) {
                    const item = response.data;
                    setFormData({
                        title: item.title || "",
                        content: item.content || "",
                        price: item.price || "",
                        location: item.location || "",
                        category: item.category || "",
                        condition: item.condition || "",
                        isBiddable: item.isBiddable || false,
                        image: null
                    });
                    if (item.image) {
                        // Assuming item.image is a full URL or relative path handled by Image component
                        // If it's a Cloudinary URL, it's fine.
                        // We store it to show preview, but if user doesn't change it, we send original.
                        setOriginalImage(item.image);
                        setImagePreview(item.image.startsWith('http') ? item.image : `/${item.image}`);
                    }
                }
            } catch (error: any) {
                toast.error("Error", {
                    description: error.message || "Failed to load item data"
                });
                router.push("/");
            } finally {
                setLoading(false);
            }
        };

        if (params.slug) {
            fetchData();
        }
    }, [params.slug, router]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData({ ...formData, image: null });
        setImagePreview(null);
        // Note: Removing image entirely might need backend support to delete image or set to default
        // For now, we assume user must replace it or keep original.
        // If they remove preview of new image, revert to original if available??
        // Actually, let's just clear it.
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.content || !formData.price || !formData.location || !formData.category || !formData.condition) {
            toast.error("Missing Fields", {
                description: "Please fill in all required fields"
            });
            return;
        }

        setSubmitting(true);

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("content", formData.content);
            data.append("price", formData.price);
            data.append("location", formData.location);
            data.append("category", formData.category);
            data.append("condition", formData.condition);
            data.append("isBiddable", String(formData.isBiddable));

            // We need to send previousImage path so backend can delete it if we update
            // Backend expects 'previousImage' in body
            if (originalImage) {
                data.append("previousImage", originalImage);
            }

            if (formData.image) {
                data.append("image", formData.image);
            } else {
                // If no new image, we might need to send the old image path as 'image' 
                // OR backend handles it if 'image' file is missing but we want to keep it?
                // Checking backend controller:
                // if (!req.file) { item.image = image } else { delete old, use new }
                // So we need to append 'image' text field with old url if we are not changing it?
                // The controller says: const { image } = req.body; ... item.image = image
                // So yes, pass original image string if no file.
                if (originalImage) {
                    data.append("image", originalImage);
                }
            }

            await updateItem(params.slug, data);

            toast.success("Success!", {
                description: "Item updated successfully"
            });

            // Redirect to home (Seller Mode) or Product Detail
            setTimeout(() => {
                router.push("/");
            }, 1000);
        } catch (error: any) {
            toast.error("Update Failed", {
                description: error.message || "Failed to update item. Please try again."
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/20">
            <Header />

            <main className="flex-1 w-full px-4 py-8">
                <div className="w-full">
                    <div className="mb-6 container mx-auto">
                        <Button variant="ghost" size="sm" asChild className="gap-2">
                            <Link href="/">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Listings
                            </Link>
                        </Button>
                    </div>

                    <Card className="p-8 shadow-xl border-2 w-full max-w-6xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold">Edit Item</h1>
                            <p className="text-muted-foreground">Update your listing details</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column: Basic Info */}
                                <div className="space-y-6">
                                    {/* Title Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-base font-semibold flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-primary" />
                                            Item Title *
                                        </Label>
                                        <Input
                                            id="title"
                                            placeholder="e.g., iPhone 14 Pro - Excellent Condition"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="text-base"
                                            required
                                        />
                                    </div>

                                    {/* Price & Location Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="price" className="text-base font-semibold flex items-center gap-2">
                                                <span className="text-primary font-bold">Rs.</span>
                                                Price *
                                            </Label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-2.5 text-muted-foreground font-semibold">Rs.</div>
                                                <Input
                                                    id="price"
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                    className="pl-12 text-base"
                                                    required
                                                    min="0"
                                                    step="0.01"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="location" className="text-base font-semibold flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-primary" />
                                                Location *
                                            </Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                                <Input
                                                    id="location"
                                                    placeholder="City, State"
                                                    value={formData.location}
                                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                    className="pl-10 text-base"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Category & Condition Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="category" className="text-base font-semibold flex items-center gap-2">
                                                <Tag className="h-4 w-4 text-primary" />
                                                Category *
                                            </Label>
                                            <select
                                                id="category"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                required
                                            >
                                                <option value="" disabled>Select a category</option>
                                                {categories.map((cat) => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="condition" className="text-base font-semibold flex items-center gap-2">
                                                <AlertCircle className="h-4 w-4 text-primary" />
                                                Condition *
                                            </Label>
                                            <select
                                                id="condition"
                                                value={formData.condition}
                                                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                required
                                            >
                                                <option value="" disabled>Select condition</option>
                                                {conditions.map((cond) => (
                                                    <option key={cond} value={cond}>{cond}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Description Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="content" className="text-base font-semibold flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-primary" />
                                            Description *
                                        </Label>
                                        <textarea
                                            id="content"
                                            placeholder="Describe your item in detail... (features, reason for selling, etc.)"
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            className="w-full min-h-[150px] px-3 py-2 text-base rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Right Column: Image and Settings */}
                                <div className="space-y-6">
                                    {/* Image Upload */}
                                    <div className="space-y-2">
                                        <Label className="text-base font-semibold flex items-center gap-2">
                                            <ImageIcon className="h-4 w-4 text-primary" />
                                            Item Photo
                                        </Label>

                                        {!imagePreview ? (
                                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/5 h-[300px] flex flex-col items-center justify-center">
                                                <input
                                                    type="file"
                                                    id="image"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                                <label htmlFor="image" className="cursor-pointer">
                                                    <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                                        <ImageIcon className="h-10 w-10 text-primary" />
                                                    </div>
                                                    <p className="text-lg font-medium mb-2">Click to upload new image</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Leave empty to keep current image
                                                    </p>
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="relative rounded-xl overflow-hidden border-2 border-primary/20 h-[300px] group">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={removeImage}
                                                        className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform hover:scale-110"
                                                    >
                                                        <X className="h-6 w-6" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Biddable Switch */}
                                    <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-6 flex flex-row items-center justify-between space-x-4">
                                        <div className="space-y-1">
                                            <Label htmlFor="isBiddable" className="text-lg font-semibold flex items-center gap-2 text-foreground">
                                                Open to Bids?
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                Allow buyers to place bids on this item
                                            </p>
                                        </div>
                                        <Switch
                                            id="isBiddable"
                                            checked={formData.isBiddable}
                                            onCheckedChange={(checked) => setFormData({ ...formData, isBiddable: checked })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-6 md:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    onClick={() => router.push("/")}
                                    disabled={submitting}
                                    className="w-full md:w-auto px-8"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full md:w-auto px-8 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-5 w-5 mr-2" />
                                            Update Item
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
}
