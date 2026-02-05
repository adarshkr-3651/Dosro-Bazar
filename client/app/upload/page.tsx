"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Image as ImageIcon, MapPin, FileText, X, Tag, AlertCircle } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card } from "@/app/components/ui/card";
import { Switch } from "@/app/components/ui/switch";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { addItem } from "@/app/lib/api";
import { toast } from "sonner";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";

export default function UploadPage() {
    const router = useRouter();
    const { isBuyerMode } = useAuth();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        price: "",
        location: "",
        category: "",
        condition: "",
        isBiddable: true,
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
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.content || !formData.price || !formData.location || !formData.category || !formData.condition) {
            toast.error("Missing Fields", {
                description: "Please fill in all required fields"
            });
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("content", formData.content);
            data.append("price", formData.price);
            data.append("location", formData.location);
            data.append("category", formData.category);
            data.append("condition", formData.condition);
            data.append("isBiddable", String(formData.isBiddable));

            if (formData.image) {
                data.append("image", formData.image);
            }

            await addItem(data);

            toast.success("Success!", {
                description: "Your item has been uploaded successfully"
            });

            // Reset form
            setFormData({
                title: "",
                content: "",
                price: "",
                location: "",
                category: "",
                condition: "",
                isBiddable: false,
                image: null
            });
            setImagePreview(null);

            // Redirect to home after a short delay
            setTimeout(() => {
                router.push("/");
            }, 1500);
        } catch (error: any) {
            toast.error("Upload Failed", {
                description: error.message || "Failed to upload item. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/20">
            <Header />

            <main className="flex-1 w-full px-4 py-8">
                {/* Full Width Container */}
                <div className="w-full">
                    {/* Header Section */}
                    <div className="mb-8 text-center">
                        {/* <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-4">
                            <Upload className="h-8 w-8 text-white" />
                        </div> */}
                        {/* <h1 className="text-4xl font-bold mb-2">Upload New Item</h1> */}
                        {/* <p className="text-muted-foreground text-lg">
                            List your item for thousands of buyers
                        </p> */}
                    </div>

                    {/* Upload Form - Full Width Card */}
                    <Card className="p-8 shadow-xl border-2 w-full">
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
                                                    <p className="text-lg font-medium mb-2">Click to upload image</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        High quality images attract more buyers
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
                                    disabled={loading}
                                    className="w-full md:w-auto px-8"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full md:w-auto px-8 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-5 w-5 mr-2" />
                                            List Item Now
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
