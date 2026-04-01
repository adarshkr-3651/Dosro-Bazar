"use client";

import { useState, useEffect } from "react";
import { 
    Search, Filter, Receipt, Calendar, ExternalLink, 
    ArrowUpDown, MoreHorizontal, Download, Eye,
    Building2, Mail, CreditCard, BadgePercent
} from "lucide-react";
import { getAdBookings } from "../../../lib/admin-actions";
import Image from "next/image";

export default function AdInvoicesPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

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
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all shadow-sm">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm">
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
                <button className="px-8 py-4 bg-white text-emerald-600 font-black rounded-2xl flex items-center gap-2 hover:bg-emerald-50 active:scale-95 transition-all shadow-sm text-sm uppercase tracking-widest">
                    <Download className="w-5 h-5" />
                    Export ALL DATA (CSV)
                </button>
            </div>
        </div>
    );
}
