"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getRecycleBin, restoreProduct, permanentDeleteProduct } from "../lib/api";
import { Loader2, Trash2, RotateCcw, AlertTriangle, Package } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { Card, CardContent } from "@/app/components/ui/card";
import { resolvePhotoUrl } from "../lib/image-utils";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";


interface Product {
    _id: string;
    title: string;
    price: number;
    images: string[];
    deletedAt: string;
}

export default function RecycleBinPage() {
    const [items, setItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);


    const fetchBin = async () => {
        try {
            const res = await getRecycleBin();
            setItems(res.data);
        } catch (error) {
            toast.error("Failed to fetch recycle bin");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBin();
    }, []);

    const handleRestore = async (id: string) => {
        setActionLoading(id);
        try {
            await restoreProduct(id);
            toast.success("Product restored successfully");
            fetchBin();
        } catch (error) {
            toast.error("Failed to restore product");
        } finally {
            setActionLoading(null);
        }
    };

    const handlePermanentDelete = (id: string) => {
        setSelectedItemId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmPermanentDelete = async () => {
        if (!selectedItemId) return;
        
        setActionLoading(selectedItemId);
        try {
            await permanentDeleteProduct(selectedItemId);
            toast.success("Product permanently deleted");
            setIsDeleteModalOpen(false);
            fetchBin();
        } catch (error) {
            toast.error("Failed to delete product");
        } finally {
            setActionLoading(null);
            setSelectedItemId(null);
        }
    };


    const getDaysRemaining = (deletedAt: string) => {
        const delDate = new Date(deletedAt);
        const expiryDate = new Date(delDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        const now = new Date();
        const diff = expiryDate.getTime() - now.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-red-100 dark:bg-red-950/30 rounded-2xl text-red-600">
                        <Trash2 className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black italic tracking-tight">Recycle Bin</h1>
                        <p className="text-muted-foreground text-sm">Items here will be permanently deleted after 30 days.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-3xl bg-muted/20">
                        <Package className="h-16 w-16 text-muted-foreground/20 mb-4" />
                        <h2 className="text-xl font-bold">Your bin is empty</h2>
                        <p className="text-muted-foreground text-sm max-w-xs">Items you delete will appear here for 30 days before being permanently removed.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <Card key={item._id} className="overflow-hidden border-red-100 dark:border-red-950/50 hover:shadow-lg transition-all group">
                                <CardContent className="p-0">
                                    <div className="flex h-40">
                                        <div className="w-1/3 relative bg-muted">
                                            {item.images && item.images[0] ? (
                                                <Image 
                                                    src={resolvePhotoUrl(item.images[0])}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover grayscale group-hover:grayscale-0 transition-all"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <Trash2 className="h-8 w-8 text-muted-foreground/30" />
                                                </div>
                                            )}
                                            <div className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-[10px] font-black rounded-full shadow-lg">
                                                {getDaysRemaining(item.deletedAt)} DAYS LEFT
                                            </div>
                                        </div>
                                        <div className="w-2/3 p-4 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-bold text-lg line-clamp-1">{item.title}</h3>
                                                <p className="text-primary font-black text-sm">Rs. {item.price.toLocaleString()}</p>
                                                <p className="text-[10px] text-muted-foreground mt-1">Deleted on {new Date(item.deletedAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    className="flex-1 gap-1 rounded-xl h-8 text-[11px]"
                                                    onClick={() => handleRestore(item._id)}
                                                    disabled={actionLoading === item._id}
                                                >
                                                    {actionLoading === item._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
                                                    Restore
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="ghost" 
                                                    className="flex-1 gap-1 rounded-xl h-8 text-[11px] text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handlePermanentDelete(item._id)}
                                                    disabled={actionLoading === item._id}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
            <Footer />

            <DeleteConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedItemId(null);
                }}
                onConfirm={confirmPermanentDelete}
                title="Permanent Deletion"
                description="Are you sure? This action is permanent and cannot be undone."
                confirmText="Delete Permanently"
                isLoading={actionLoading !== null && selectedItemId === actionLoading}
            />
        </div>

    );
}
