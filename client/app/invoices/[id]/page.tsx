"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getInvoiceDetail } from "../../lib/api";
import { Loader2, Receipt, ArrowLeft, Calendar, User, Package, MapPin, Phone, Mail, ChevronRight, Printer, Download, ShieldCheck, MessageSquare } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import Image from "next/image";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { useAuth } from "../../context/AuthContext";
import { resolvePhotoUrl } from "../../lib/image-utils";
import Link from "next/link";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";

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

export default function InvoiceDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const router = useRouter();
    const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const invoiceRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!invoiceRef.current || !invoice) return;
        
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(invoiceRef.current, {
                scale: 2,
                useCORS: true,
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
            toast.error("Failed to generate PDF");
        } finally {
            setIsDownloading(false);
        }
    };

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getInvoiceDetail(id as string);
                setInvoice(res.data);
            } catch (error: any) {
                toast.error(error.message || "Failed to load invoice details");
                router.push("/invoices");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchDetail();
    }, [id, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <div className="flex-1 flex justify-center items-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!invoice) return null;

    const isSeller = invoice.seller._id === user?._id;

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mb-6 gap-2 text-muted-foreground hover:text-primary rounded-xl"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Invoices
                </Button>

                <div className="max-w-4xl mx-auto" ref={invoiceRef}>
                    <Card className="border-none shadow-2xl overflow-hidden rounded-[2rem]">
                        <CardHeader className="bg-primary text-primary-foreground p-8 md:p-12">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-lg">
                                            <Receipt className="h-6 w-6" />
                                        </div>
                                        <span className="text-sm font-black uppercase tracking-[0.3em] opacity-80">Official Invoice</span>
                                    </div>
                                    <h1 className="text-4xl font-black tracking-tighter">{invoice.invoiceId}</h1>
                                    <div className="flex items-center gap-4 text-sm opacity-90 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(invoice.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <ShieldCheck className="h-4 w-4" />
                                            Verified Transaction
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold uppercase tracking-widest opacity-70 mb-1">Final Amount</div>
                                    <div className="text-5xl font-black tabular-nums">Rs. {invoice.amount.toLocaleString()}</div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-8 md:p-12 space-y-12">
                            {/* Transaction Participants */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                        <span className="w-4 h-px bg-muted-foreground/30" />
                                        Seller Information
                                    </h3>
                                    <div className="flex items-center gap-4 p-4 rounded-3xl bg-muted/30 border border-muted/60">
                                        <div className="relative h-14 w-14 rounded-2xl overflow-hidden border-2 border-background">
                                            <Image 
                                                src={resolvePhotoUrl(invoice.seller.photo) || "/placeholder.jpg"} 
                                                alt={invoice.seller.username} 
                                                fill 
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-black text-lg">{invoice.seller.username}</p>
                                            <div className="flex flex-col gap-1 mt-1">
                                                <a href={`tel:${invoice.seller.phone}`} className="text-xs text-muted-foreground flex items-center gap-1.5 hover:text-primary transition-colors">
                                                    <Phone className="h-3 w-3" /> {invoice.seller.phone}
                                                </a>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                    <Mail className="h-3 w-3" /> {invoice.seller.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                        <span className="w-4 h-px bg-muted-foreground/30" />
                                        Buyer Information
                                    </h3>
                                    <div className="flex items-center gap-4 p-4 rounded-3xl bg-muted/30 border border-muted/60">
                                        <div className="relative h-14 w-14 rounded-2xl overflow-hidden border-2 border-background">
                                            <Image 
                                                src={resolvePhotoUrl(invoice.buyer.photo) || "/placeholder.jpg"} 
                                                alt={invoice.buyer.username} 
                                                fill 
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-black text-lg">{invoice.buyer.username}</p>
                                            <div className="flex flex-col gap-1 mt-1">
                                                <a href={`tel:${invoice.buyer.phone}`} className="text-xs text-muted-foreground flex items-center gap-1.5 hover:text-primary transition-colors">
                                                    <Phone className="h-3 w-3" /> {invoice.buyer.phone}
                                                </a>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                    <Mail className="h-3 w-3" /> {invoice.buyer.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="space-y-6 pt-6 border-t">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                    <span className="w-4 h-px bg-muted-foreground/30" />
                                    Transaction Item
                                </h3>
                                <Link href={`/products/${invoice.item.slug}`} className="block group">
                                    <div className="flex flex-col md:flex-row gap-6 p-6 rounded-[2rem] bg-background border-2 border-muted/40 group-hover:border-primary/20 group-hover:shadow-xl transition-all">
                                        <div className="relative h-40 md:w-40 rounded-2xl overflow-hidden shrink-0">
                                            <Image 
                                                src={resolvePhotoUrl(invoice.item.images?.[0]) || "/placeholder.jpg"} 
                                                alt={invoice.item.title} 
                                                fill 
                                                className="object-cover transition-transform group-hover:scale-110 duration-700"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-2">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge variant="secondary" className="rounded-full text-[10px] font-bold uppercase px-3">{invoice.item.category}</Badge>
                                                    <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" /> {invoice.item.location}
                                                    </span>
                                                </div>
                                                <h2 className="text-2xl font-black italic tracking-tight mb-2 group-hover:text-primary transition-colors">{invoice.item.title}</h2>
                                                <p className="text-muted-foreground text-sm line-clamp-2">This transaction is successfully completed and verified by Dosro Bazar.</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-primary font-black text-xl">
                                                Rs. {invoice.item.price.toLocaleString()}
                                                <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 pt-8 border-t justify-center md:justify-start">
                                <Button className="gap-2 rounded-2xl px-8 h-12 font-bold" onClick={() => window.print()}>
                                    <Printer className="h-4 w-4" />
                                    Print Invoice
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="gap-2 rounded-2xl px-8 h-12 font-bold"
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                >
                                    {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                    {isDownloading ? "Generating..." : "Download PDF"}
                                </Button>
                                <Button variant="ghost" className="gap-2 rounded-2xl px-8 h-12 font-bold text-muted-foreground" asChild>
                                    <Link href="/messages">
                                        <MessageSquare className="h-4 w-4" />
                                        Open Chat
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>

                        <div className="bg-muted/30 p-6 text-center border-t border-muted/60">
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Dosro Bazar Transaction Security • Invoice ID: {invoice._id}</p>
                        </div>
                    </Card>
                </div>
            </main>
            <Footer />
            
            <style jsx global>{`
                @media print {
                    header, footer, button, .no-print {
                        display: none !important;
                    }
                    .container {
                        max-width: 100% !important;
                        padding: 0 !important;
                    }
                    .card {
                        box-shadow: none !important;
                        border: 1px solid #eee !important;
                    }
                }
            `}</style>
        </div>
    );
}
