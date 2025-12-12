"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Image as ImageIcon, DollarSign, MapPin, FileText, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card } from "@/app/components/ui/card";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { addItem } from "@/app/lib/api";
import { toast } from "sonner";

export default function UploadPage() {
    const router = useRouter();
    const [isBuyerMode, setIsBuyerMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        image: null as File | null,
    });

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

        if (!formData.title || !formData.content) {
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
            if (formData.image) {
                data.append("image", formData.image);
            }

            await addItem(data);

            toast.success("Success!", {
                description: "Your item has been uploaded successfully"
            });

            // Reset form
            setFormData({ title: "", content: "", image: null });
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
            <Header isBuyerMode={isBuyerMode} onModeToggle={setIsBuyerMode} />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-4">
                            <Upload className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold mb-2">Upload New Item</h1>
                        <p className="text-muted-foreground text-lg">
                            Share your item with thousands of buyers
                        </p>
                    </div>

                    {/* Upload Form */}
                    <Card className="p-8 shadow-lg border-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
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

                            {/* Description Field */}
                            <div className="space-y-2">
                                <Label htmlFor="content" className="text-base font-semibold flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    Description *
                                </Label>
                                <textarea
                                    id="content"
                                    placeholder="Describe your item in detail... (condition, features, reason for selling, etc.)"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full min-h-[150px] px-3 py-2 text-base rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                                    required
                                />
                                <p className="text-sm text-muted-foreground">
                                    Minimum 10 characters required
                                </p>
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <Label htmlFor="image" className="text-base font-semibold flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4 text-primary" />
                                    Item Photo
                                </Label>

                                {!imagePreview ? (
                                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                                        <input
                                            type="file"
                                            id="image"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <label htmlFor="image" className="cursor-pointer">
                                            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <p className="text-base font-medium mb-1">Click to upload image</p>
                                            <p className="text-sm text-muted-foreground">
                                                PNG, JPG, WEBP up to 10MB
                                            </p>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="relative rounded-lg overflow-hidden border-2 border-primary/20">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-64 object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 p-2 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Info Box */}
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                                <p className="text-sm text-muted-foreground">
                                    <strong className="text-foreground">Note:</strong> Make sure your item details are accurate and complete.
                                    High-quality photos and detailed descriptions help sell faster!
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push("/")}
                                    className="flex-1"
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload Item
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
