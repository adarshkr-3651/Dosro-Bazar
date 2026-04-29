"use client";

import { useState, useEffect } from "react";
import { 
  Wallet, Calendar, Layout, 
  ExternalLink, Activity, Loader2,
  Package, User, DollarSign, Clock, CheckCircle2, AlertCircle, Phone, Mail
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { getAdvanceBookingsAction } from "@/app/lib/admin-actions";

export default function AdvanceBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getAdvanceBookingsAction();
      if (res.success) {
        setBookings(res.data || []);
      } else {
        toast.error(res.error || "Failed to fetch bookings");
      }
    } catch (error) {
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
            Advance Payments
          </h1>
          <p className="text-slate-500 text-lg flex items-center gap-2 font-medium">
            <Wallet className="w-4 h-4 text-emerald-500" />
            Manage and track product booking deposits
          </p>
        </div>
        
        <div className="flex items-center gap-3">
            <Card className="bg-emerald-50 border-emerald-100 shadow-none">
                <CardContent className="py-3 px-4 flex items-center gap-3">
                    <div className="p-2 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20">
                        <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Total Booking Revenue</p>
                        <p className="text-xl font-black text-emerald-900">Rs. {totalRevenue.toLocaleString()}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>

      {/* Grid Layout */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse bg-slate-50/50 border-slate-100">
              <div className="h-48 bg-slate-200 rounded-t-xl" />
              <CardHeader className="space-y-2">
                <div className="h-4 w-1/2 bg-slate-200 rounded" />
                <div className="h-3 w-3/4 bg-slate-200 rounded" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm">
              <Wallet className="w-12 h-12 text-slate-300" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900">No advance bookings found</h3>
              <p className="text-slate-500">Payments will appear here once buyers book products.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <Card 
              key={booking._id} 
              className="group overflow-hidden border-slate-200 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 rounded-2xl bg-white"
            >
              {/* Product Preview */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={booking.item?.images?.[0] || "/placeholder.png"}
                  alt={booking.item?.title || "Product"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
                
                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className={`px-3 py-1 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5 border backdrop-blur-sm ${
                    booking.status === 'confirmed' ? 'bg-emerald-500 border-emerald-400/30' : 
                    booking.status === 'pending' ? 'bg-amber-500 border-amber-400/30' : 'bg-rose-500 border-rose-400/30'
                  }`}>
                    {booking.status === 'confirmed' && <CheckCircle2 className="w-3 h-3" />}
                    {booking.status === 'pending' && <Clock className="w-3 h-3" />}
                    {booking.status === 'failed' && <AlertCircle className="w-3 h-3" />}
                    {booking.status}
                  </div>
                  <div className="px-3 py-1 bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg border border-white/30 backdrop-blur-md">
                    {booking.paymentMethod}
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-xs font-bold uppercase tracking-widest opacity-70">Transaction ID</p>
                    <p className="text-white font-mono text-sm truncate">{booking.transactionId}</p>
                </div>
              </div>

              <CardHeader className="space-y-4 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {booking.item?.title || "Deleted Product"}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-emerald-600 font-black text-lg mt-1">
                      <p>Rs. {booking.amount.toLocaleString()}</p>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Deposit Paid</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-emerald-50/50 group-hover:border-emerald-100 transition-colors">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                B
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Buyer</p>
                                <p className="text-xs font-black text-slate-700">{booking.buyer?.username || "Unknown"}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {booking.buyer?.phone && <Phone className="w-3 h-3 text-slate-400 hover:text-emerald-500 cursor-pointer" />}
                            {booking.buyer?.email && <Mail className="w-3 h-3 text-slate-400 hover:text-emerald-500 cursor-pointer" />}
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-emerald-50/50 group-hover:border-emerald-100 transition-colors">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                S
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Seller</p>
                                <p className="text-xs font-black text-slate-700">{booking.seller?.username || "Unknown"}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {booking.seller?.phone && <Phone className="w-3 h-3 text-slate-400 hover:text-emerald-500 cursor-pointer" />}
                            {booking.seller?.email && <Mail className="w-3 h-3 text-slate-400 hover:text-emerald-500 cursor-pointer" />}
                        </div>
                    </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 pb-6 space-y-4">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>

                <Button 
                    variant="outline" 
                    className="w-full rounded-xl border-slate-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 font-bold text-xs transition-all duration-300"
                    onClick={() => window.open(`/products/${booking.item?.slug}`, '_blank')}
                >
                    <ExternalLink className="w-3 h-3 mr-2" /> View Product Listing
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
