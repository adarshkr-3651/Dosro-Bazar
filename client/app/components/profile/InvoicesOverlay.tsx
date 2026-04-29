"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { getMyInvoices } from "@/app/lib/api";
import { Loader2, Receipt, Search, ArrowUpRight, ArrowDownLeft, Calendar, User } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent } from "@/app/components/ui/card";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import Link from "next/link";
import { InvoiceModal } from "../InvoiceModal";

interface Invoice {
    _id: string;
    invoiceId: string;
    buyer: { _id: string; username: string; photo: string };
    seller: { _id: string; username: string; photo: string };
    item: { _id: string; title: string; images: string[]; price: number; slug: string };
    amount: number;
    createdAt: string;
}

interface InvoicesOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function InvoicesOverlay({ isOpen, onClose }: InvoicesOverlayProps) {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        const fetchInvoices = async () => {
            if (!isOpen) return;
            try {
                setLoading(true);
                const res = await getMyInvoices();
                setInvoices(res.data);
            } catch (error) {
                toast.error("Failed to fetch invoices");
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, [isOpen]);

    const filteredInvoices = invoices.filter(inv => 
        inv.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.buyer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.seller.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden border-none rounded-[2rem] bg-background shadow-2xl">
                <div className="flex flex-col h-[85vh]">
                    {/* Header Section */}
                    <div className="p-8 pb-4 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/20 rounded-2xl text-primary">
                                    <Receipt className="h-6 w-6" />
                                </div>
                                <DialogHeader>
                                    <DialogTitle className="text-3xl font-black italic tracking-tight">Transaction History</DialogTitle>
                                    <DialogDescription className="text-muted-foreground text-sm">Review your past purchases and sales.</DialogDescription>
                                </DialogHeader>
                            </div>

                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search by ID or product..." 
                                    className="pl-9 rounded-2xl border-muted-foreground/20 bg-background/50 backdrop-blur-sm" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full gap-4">
                                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                <p className="text-sm font-bold text-muted-foreground animate-pulse uppercase tracking-widest">Fetching your invoices...</p>
                            </div>
                        ) : filteredInvoices.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-12 border-2 border-dashed rounded-[2rem] bg-muted/20">
                                <div className="p-6 bg-muted/30 rounded-full mb-6">
                                    <Receipt className="h-16 w-16 text-muted-foreground/40" />
                                </div>
                                <h2 className="text-2xl font-black italic">No records found</h2>
                                <p className="text-muted-foreground text-sm max-w-xs mt-2">
                                    {searchQuery ? "Try a different search term" : "Your transaction history will appear here once you buy or sell items."}
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {filteredInvoices.map((inv) => {
                                    const isSeller = inv.seller._id === user?._id;
                                    return (
                                        <Card key={inv._id} className="overflow-hidden border-muted/60 hover:shadow-xl hover:border-primary/20 transition-all group rounded-2xl">
                                            <CardContent className="p-0">
                                                <div className="flex flex-col md:flex-row">
                                                    <div className="flex-1 p-5 md:p-6 flex gap-4 items-center">
                                                        <div className={`p-4 rounded-2xl shrink-0 transition-transform group-hover:scale-110 ${isSeller ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/30'}`}>
                                                            {isSeller ? <ArrowUpRight className="h-6 w-6" /> : <ArrowDownLeft className="h-6 w-6" />}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-2 mb-1.5">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{inv.invoiceId}</span>
                                                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${isSeller ? 'bg-emerald-500/10 text-emerald-600' : 'bg-indigo-500/10 text-indigo-600'}`}>
                                                                    {isSeller ? 'Earnings' : 'Purchase'}
                                                                </span>
                                                            </div>
                                                            <h3 className="font-black text-xl italic tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                                                                {inv.item.title}
                                                            </h3>
                                                            <div className="flex items-center gap-4 mt-3">
                                                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                                    <Calendar className="h-3.5 w-3.5 text-primary/60" />
                                                                    {new Date(inv.createdAt).toLocaleDateString()}
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                                    <User className="h-3.5 w-3.5 text-primary/60" />
                                                                    {isSeller ? `To: ${inv.buyer.username}` : `From: ${inv.seller.username}`}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="bg-muted/30 md:w-72 p-5 md:p-6 flex flex-row md:flex-col items-center justify-between md:justify-center border-t md:border-t-0 md:border-l border-muted/60">
                                                        <div className="text-right md:text-center md:mb-5">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Final Amount</p>
                                                            <p className="text-3xl font-black text-primary italic">Rs. {inv.amount.toLocaleString()}</p>
                                                        </div>
                                                        <Button 
                                                            size="sm" 
                                                            className="rounded-xl w-auto md:w-full h-11 font-black uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-95 transition-all" 
                                                            onClick={() => {
                                                                setSelectedInvoiceId(inv._id);
                                                                setIsDetailOpen(true);
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
                    </div>
                    
                    {/* Footer Stats */}
                    <div className="p-6 bg-muted/30 border-t flex justify-between items-center px-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                            Total Records: <span className="text-primary">{invoices.length}</span>
                        </p>
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">
                            Transaction Security Verified by Dosro Bazar
                        </p>
                    </div>
                </div>

                {/* Detail Modal */}
                {selectedInvoiceId && (
                    <InvoiceModal 
                        isOpen={isDetailOpen} 
                        onClose={() => setIsDetailOpen(false)} 
                        invoiceId={selectedInvoiceId} 
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
