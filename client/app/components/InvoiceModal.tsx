"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { getInvoiceDetail } from "@/app/lib/api";
import { Loader2, Receipt, Calendar, User, Package, MapPin, Phone, Mail, ChevronRight, Printer, Download, ShieldCheck, MessageSquare, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import Image from "next/image";
import { resolvePhotoUrl } from "@/app/lib/image-utils";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoiceId: string;
}

interface InvoiceDetail {
    _id: string;
    invoiceId: string;
    buyer: { _id: string; username: string; photo: string; email: string; phone: string };
    seller: { _id: string; username: string; photo: string; email: string; phone: string };
    item: { _id: string; title: string; images: string[]; price: number; location: string; category: string; slug: string };
    amount: number;
    createdAt: string;
    status: string;
}

export function InvoiceModal({ isOpen, onClose, invoiceId }: InvoiceModalProps) {
    const { user } = useAuth();
    const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const invoiceRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!invoiceRef.current || !invoice) return;
        
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(invoiceRef.current, {
                scale: 2, // Higher quality
                useCORS: true, // For images from Cloudinary
                logging: false,
                backgroundColor: "#ffffff"
            });
            
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4"
            });
            
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`invoice-${invoice.invoiceId}.pdf`);
        } catch (error) {
            console.error("PDF generation failed:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    useEffect(() => {
        const fetchDetail = async () => {
            if (!invoiceId) return;
            setLoading(true);
            try {
                const res = await getInvoiceDetail(invoiceId);
                setInvoice(res.data);
            } catch (error) {
                console.error("Failed to fetch invoice:", error);
            } finally {
                setLoading(false);
            }
        };
        if (isOpen) fetchDetail();
    }, [isOpen, invoiceId]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden border-none rounded-[2rem] max-h-[90vh] overflow-y-auto bg-background">
                <DialogHeader className="sr-only">
                    <DialogTitle>Invoice Detail - {invoice?.invoiceId || "Loading..."}</DialogTitle>
                </DialogHeader>
                {loading ? (
                    <div className="flex justify-center items-center h-[500px]">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : invoice ? (
                    <div className="relative" ref={invoiceRef}>
                        {/* Header Section */}
                        <div className="bg-primary text-primary-foreground p-8 md:p-10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-lg">
                                            <Receipt className="h-6 w-6" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Official Invoice</span>
                                    </div>
                                    <h1 className="text-3xl font-black tracking-tighter">{invoice.invoiceId}</h1>
                                    <div className="flex items-center gap-4 text-[11px] opacity-90 font-medium uppercase tracking-wider">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {new Date(invoice.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <ShieldCheck className="h-3.5 w-3.5" />
                                            Verified
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Final Amount</div>
                                    <div className="text-4xl font-black tabular-nums">Rs. {invoice.amount.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-8 md:p-10 space-y-10">
                            {/* Participants */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                        <span className="w-4 h-px bg-muted-foreground/30" />
                                        Seller
                                    </h3>
                                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-muted/30 border border-muted/60">
                                        <div className="relative h-12 w-12 rounded-xl overflow-hidden">
                                            <Image 
                                                src={resolvePhotoUrl(invoice.seller.photo) || "/placeholder.jpg"} 
                                                alt={invoice.seller.username} 
                                                fill 
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{invoice.seller.username}</p>
                                            <div className="flex gap-2 mt-1">
                                                <a href={`tel:${invoice.seller.phone}`} className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                                                    <Phone className="h-2.5 w-2.5" /> {invoice.seller.phone}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                        <span className="w-4 h-px bg-muted-foreground/30" />
                                        Buyer
                                    </h3>
                                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-muted/30 border border-muted/60">
                                        <div className="relative h-12 w-12 rounded-xl overflow-hidden">
                                            <Image 
                                                src={resolvePhotoUrl(invoice.buyer.photo) || "/placeholder.jpg"} 
                                                alt={invoice.buyer.username} 
                                                fill 
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{invoice.buyer.username}</p>
                                            <div className="flex gap-2 mt-1">
                                                <a href={`tel:${invoice.buyer.phone}`} className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                                                    <Phone className="h-2.5 w-2.5" /> {invoice.buyer.phone}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Item Details */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                    <span className="w-4 h-px bg-muted-foreground/30" />
                                    Purchased Item
                                </h3>
                                <Link href={`/products/${invoice.item.slug}`} className="block group">
                                    <div className="flex gap-5 p-4 rounded-3xl bg-background border border-muted/60 group-hover:border-primary/20 transition-all">
                                        <div className="relative h-24 w-24 rounded-xl overflow-hidden shrink-0">
                                            <Image 
                                                src={resolvePhotoUrl(invoice.item.images?.[0]) || "/placeholder.jpg"} 
                                                alt={invoice.item.title} 
                                                fill 
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="secondary" className="rounded-full text-[8px] font-bold uppercase px-2 py-0 h-4">{invoice.item.category}</Badge>
                                            </div>
                                            <h2 className="text-lg font-black italic tracking-tight group-hover:text-primary transition-colors line-clamp-1">{invoice.item.title}</h2>
                                            <p className="text-primary font-black text-sm mt-1">Rs. {invoice.item.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3 pt-6 border-t no-print">
                                <Button size="sm" className="rounded-xl px-6 h-10 font-bold gap-2" onClick={() => window.print()}>
                                    <Printer className="h-3.5 w-3.5" />
                                    Print
                                </Button>
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="rounded-xl px-6 h-10 font-bold gap-2"
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                >
                                    {isDownloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                                    {isDownloading ? "Generating..." : "Download"}
                                </Button>
                                <Button size="sm" variant="ghost" className="rounded-xl px-6 h-10 font-bold text-muted-foreground gap-2" asChild>
                                    <Link href="/messages">
                                        <MessageSquare className="h-3.5 w-3.5" />
                                        Open Chat
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="bg-muted/30 p-4 text-center border-t border-muted/60">
                            <p className="text-[8px] text-muted-foreground uppercase font-black tracking-widest">Transaction Security Verified by Dosro Bazar</p>
                        </div>
                    </div>
                ) : (
                    <div className="p-20 text-center">Invoice not found</div>
                )}
            </DialogContent>
        </Dialog>
    );
}
