"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getMyInvoices } from "../lib/api";
import { Loader2, Receipt, Search, Filter, ArrowUpRight, ArrowDownLeft, Calendar, User, Package } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import Image from "next/image";
import { toast } from "sonner";
import { Card, CardContent } from "@/app/components/ui/card";
import { useAuth } from "../context/AuthContext";
import { resolvePhotoUrl } from "../lib/image-utils";
import Link from "next/link";
import { InvoiceModal } from "../components/InvoiceModal";

interface Invoice {
    _id: string;
    invoiceId: string;
    buyer: { _id: string; username: string; photo: string };
    seller: { _id: string; username: string; photo: string };
    item: { _id: string; title: string; images: string[]; price: number; slug: string };
    amount: number;
    createdAt: string;
}

export default function InvoicesPage() {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await getMyInvoices();
                setInvoices(res.data);
            } catch (error) {
                toast.error("Failed to fetch invoices");
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    const filteredInvoices = invoices.filter(inv => 
        inv.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.buyer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.seller.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <Receipt className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black italic tracking-tight">My Invoices</h1>
                            <p className="text-muted-foreground text-sm">Keep track of your transaction history.</p>
                        </div>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search invoices..." 
                            className="pl-9 rounded-xl border-muted-foreground/20" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : filteredInvoices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-3xl bg-muted/20">
                        <Receipt className="h-16 w-16 text-muted-foreground/20 mb-4" />
                        <h2 className="text-xl font-bold">No invoices found</h2>
                        <p className="text-muted-foreground text-sm max-w-xs">Your transaction history will appear here once you buy or sell items.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredInvoices.map((inv) => {
                            const isSeller = inv.seller._id === user?._id;
                            return (
                                <Card key={inv._id} className="overflow-hidden border-muted/60 hover:shadow-md transition-all group rounded-2xl">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row">
                                            <div className="flex-1 p-4 md:p-6 flex gap-4 items-center">
                                                <div className={`p-3 rounded-2xl shrink-0 ${isSeller ? 'bg-green-100 text-green-600 dark:bg-green-950/30' : 'bg-blue-100 text-blue-600 dark:bg-blue-950/30'}`}>
                                                    {isSeller ? <ArrowUpRight className="h-6 w-6" /> : <ArrowDownLeft className="h-6 w-6" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{inv.invoiceId}</span>
                                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${isSeller ? 'bg-green-500/10 text-green-600' : 'bg-blue-500/10 text-blue-600'}`}>
                                                            {isSeller ? 'Earnings' : 'Purchase'}
                                                        </span>
                                                    </div>
                                                    <Link href={`/products/${inv.item.slug}`} className="font-bold text-lg hover:text-primary transition-colors line-clamp-1 block">
                                                        {inv.item.title}
                                                    </Link>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            <Calendar className="h-3 w-3" />
                                                            {new Date(inv.createdAt).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            <User className="h-3 w-3" />
                                                            {isSeller ? `To: ${inv.buyer.username}` : `From: ${inv.seller.username}`}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-muted/30 md:w-64 p-4 md:p-6 flex flex-row md:flex-col items-center justify-between md:justify-center border-t md:border-t-0 md:border-l border-muted/60">
                                                <div className="text-right md:text-center md:mb-4">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Amount</p>
                                                    <p className="text-2xl font-black text-primary">Rs. {inv.amount.toLocaleString()}</p>
                                                </div>
                                                <Button 
                                                    size="sm" 
                                                    className="rounded-xl w-auto md:w-full gap-2 text-xs font-bold" 
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedInvoiceId(inv._id);
                                                        setIsModalOpen(true);
                                                    }}
                                                >
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {selectedInvoiceId && (
                    <InvoiceModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)} 
                        invoiceId={selectedInvoiceId} 
                    />
                )}
            </main>
            <Footer />
        </div>
    );
}
