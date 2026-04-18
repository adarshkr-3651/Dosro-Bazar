"use client";

import { useState, useEffect } from "react";
import { 
    Search, Filter, Receipt, Calendar, ExternalLink, 
    ArrowUpDown, MoreHorizontal, Download, Eye, X,
    Building2, Mail, CreditCard, BadgePercent, Printer
} from "lucide-react";
import { getAdBookings } from "../../../lib/admin-actions";
import Image from "next/image";

export default function AdInvoicesPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            const data = await getAdBookings();
            setBookings(data);
            setLoading(false);
        };
        fetchBookings();
    }, []);

    const filteredBookings = bookings.filter(b => 
        b.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.transactionUuid.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExportCSV = () => {
        if (bookings.length === 0) return;
        const headers = ["Transaction ID", "Company Name", "Email", "Plan", "Base Amount", "Tax Amount", "Total (NPR)", "Payment Method", "Date", "Status"];
        const csvContent = bookings.map(b => 
            `"${b.transactionUuid}","${b.companyName}","${b.companyEmail}","${b.plan}",${b.amount || 0},${b.taxAmount || 0},${b.totalAmount},"${b.paymentMethod}","${new Date(b.createdAt).toLocaleDateString()}","${b.paymentStatus}"`
        );
        const csvString = [headers.join(","), ...csvContent].join("\n");
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Ad_Invoices_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadReceipt = (booking: any) => {
        const receiptText = `=========================================
                DOSRO BAZAR
           ADVERTISEMENT RECEIPT
=========================================
Transaction ID : ${booking.transactionUuid}
Date           : ${new Date(booking.createdAt).toLocaleString()}
Status         : ${booking.paymentStatus.toUpperCase()}

COMPANY DETAILS
-----------------------------------------
Name           : ${booking.companyName}
Email          : ${booking.companyEmail}

ADVERTISEMENT PLAN
-----------------------------------------
Plan           : ${booking.plan}
Placement      : ${booking.placement}
Valid Until    : ${new Date(booking.expiryDate).toLocaleDateString()}

BILLING
-----------------------------------------
Base Amount    : Rs. ${(booking.totalAmount - (booking.taxAmount || 0)).toLocaleString()}
VAT (13%)      : Rs. ${(booking.taxAmount || 0).toLocaleString()}
-----------------------------------------
TOTAL PAID     : Rs. ${booking.totalAmount.toLocaleString()}
Payment Method : ${booking.paymentMethod.toUpperCase()}

Thank you for choosing Dosro Bazar!
=========================================`;
        const blob = new Blob([receiptText], { type: "text/plain;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Receipt_${booking.transactionUuid}.txt`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleViewInvoice = (booking: any) => {
        setSelectedInvoice(booking);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <CreditCard className="w-8 h-8 text-emerald-500" />
                        Ad Invoices
                    </h1>
                    <p className="text-slate-500 font-medium">Manage and track all advertising revenue and billing history.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
                        <BadgePercent className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-black text-emerald-700 uppercase tracking-tighter">
                            Total Rev: Rs. {bookings.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search by company or transaction ID..."
                        className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium text-slate-900 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="h-14 px-6 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                    <Filter className="w-5 h-5 text-slate-400" />
                    Latest First
                </button>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Advertisement</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Buyer (Company)</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Plan Details</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Billing (NPR)</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Date & Status</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="p-6"><div className="h-12 bg-slate-100 rounded-xl" /></td>
                                    </tr>
                                ))
                            ) : filteredBookings.length > 0 ? (
                                filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-6">
                                            <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                                                <Image 
                                                    src={booking.imageUrl} 
                                                    alt="Ad Banner" 
                                                    fill 
                                                    className="object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-1">
                                                <p className="text-sm font-black text-slate-900 line-clamp-1">{booking.companyName}</p>
                                                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold uppercase tracking-tighter">
                                                    <Mail className="w-3 h-3" /> {booking.companyEmail}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                    booking.plan === 'Premium' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                    booking.plan === 'Standard' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    'bg-slate-100 text-slate-600 border-slate-200'
                                                }`}>
                                                    {booking.plan}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-black text-slate-900">Rs. {booking.totalAmount.toLocaleString()}</p>
                                                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-tighter">Inc. 13% VAT</p>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                    {new Date(booking.createdAt).toLocaleDateString()}
                                                </div>
                                                <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-black uppercase tracking-widest">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    Paid via {booking.paymentMethod}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleViewInvoice(booking)} className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all shadow-sm" title="View Invoice">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDownloadReceipt(booking)} className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm" title="Download Receipt (.txt)">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-20 text-center">
                                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-slate-50 mb-6">
                                            <Receipt className="w-10 h-10 text-slate-300" />
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900">No invoices found</h3>
                                        <p className="text-slate-400 font-medium">Try adjusting your search filters.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-emerald-500 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-500/20">
                <div className="space-y-1 text-center md:text-left">
                    <h3 className="text-xl font-black tracking-tight">Need Export Support?</h3>
                    <p className="text-emerald-50/80 font-medium text-sm">Download your complete financial records for tax purposes.</p>
                </div>
                <button onClick={handleExportCSV} className="px-8 py-4 bg-white text-emerald-600 font-black rounded-2xl flex items-center gap-2 hover:bg-emerald-50 active:scale-95 transition-all shadow-sm text-sm uppercase tracking-widest">
                    <Download className="w-5 h-5" />
                    Export ALL DATA (CSV)
                </button>
            </div>

            {/* Invoice Viewer Modal */}
            {isModalOpen && selectedInvoice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="w-full max-w-2xl bg-white border-slate-200 shadow-2xl relative overflow-hidden rounded-3xl">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500" />
                        
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-emerald-50 flex items-center justify-center rounded-2xl border border-emerald-100">
                                    <Receipt className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900">Tax Invoice</h2>
                                    <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                        ID: <span className="font-bold text-slate-700">{selectedInvoice.transactionUuid}</span>
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 grid grid-cols-2 gap-8 bg-slate-50/50">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Billed To</p>
                                    <p className="text-base font-bold text-slate-900">{selectedInvoice.companyName}</p>
                                    <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-1"><Mail className="w-3.5 h-3.5" />{selectedInvoice.companyEmail}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Issue Date</p>
                                    <p className="text-sm font-bold text-slate-700">{new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="space-y-4 text-right">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Amount (NPR)</p>
                                    <p className="text-3xl font-black text-emerald-600">Rs. {selectedInvoice.totalAmount.toLocaleString()}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Payment Method</p>
                                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-black uppercase tracking-widest text-slate-700 shadow-sm">
                                        {selectedInvoice.paymentMethod}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b-2 border-slate-100">
                                        <th className="pb-4 text-xs font-black uppercase tracking-widest text-slate-400">Description</th>
                                        <th className="pb-4 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="py-4">
                                            <p className="font-bold text-slate-900">Advertisement - {selectedInvoice.plan} Plan</p>
                                            <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> Valid until {new Date(selectedInvoice.expiryDate).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="py-4 text-center font-bold text-slate-700">Rs. {(selectedInvoice.totalAmount - (selectedInvoice.taxAmount || 0)).toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-4 text-right pr-4 text-sm font-black text-slate-400 uppercase tracking-widest">VAT (13%)</td>
                                        <td className="py-4 text-center font-bold text-slate-700">Rs. {(selectedInvoice.taxAmount || 0).toLocaleString()}</td>
                                    </tr>
                                    <tr className="bg-emerald-50/50">
                                        <td className="py-4 text-right pr-4 text-sm font-black text-emerald-700 uppercase tracking-widest">Total</td>
                                        <td className="py-4 text-center text-lg font-black text-emerald-600">Rs. {selectedInvoice.totalAmount.toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="mt-8 flex justify-end gap-3">
                                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-xs border border-slate-200 hover:bg-slate-50 transition-colors">
                                    Close
                                </button>
                                <button onClick={() => handleDownloadReceipt(selectedInvoice)} className="px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-xl">
                                    <Printer className="w-4 h-4" /> Download Receipt
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
