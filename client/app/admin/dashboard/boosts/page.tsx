"use client";

import { useState, useEffect } from "react";
import { 
  Zap, Trash2, Calendar, Layout, 
  ExternalLink, Activity, Loader2,
  Package, User, DollarSign, Clock
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { getAllBoostsAction, deleteBoostAction } from "@/app/lib/ad-actions";
import DeleteConfirmationModal from "@/app/components/DeleteConfirmationModal";


export default function BoostManagementPage() {
  const [boosts, setBoosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedBoostId, setSelectedBoostId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);


  useEffect(() => {
    fetchBoosts();
  }, []);

  const fetchBoosts = async () => {
    setLoading(true);
    try {
      const res = await getAllBoostsAction();
      if (res.success) {
        setBoosts(res.data || []);
      } else {
        toast.error("Failed to fetch boosted products");
      }
    } catch (error) {
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBoost = (id: string) => {
    setSelectedBoostId(id);
    setIsCancelModalOpen(true);
  };

  const confirmCancelBoost = async () => {
    if (!selectedBoostId) return;

    setIsCancelling(true);
    try {
      const res = await deleteBoostAction(selectedBoostId);
      if (res.success) {
        toast.success("Boost cancelled successfully");
        setIsCancelModalOpen(false);
        fetchBoosts();
      } else {
        toast.error(res.error || "Failed to cancel boost");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsCancelling(false);
      setSelectedBoostId(null);
    }
  };


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            Boost Management
          </h1>
          <p className="text-slate-500 text-lg flex items-center gap-2 font-medium">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            Monitor and control premium product visibility
          </p>
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
      ) : boosts.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm">
              <Package className="w-12 h-12 text-slate-300" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900">No boosted products found</h3>
              <p className="text-slate-500">Active boosts will appear here once purchased by sellers.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boosts.map((boost) => (
            <Card 
              key={boost._id} 
              className="group overflow-hidden border-slate-200 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 rounded-2xl bg-white"
            >
              {/* Product Preview */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={boost.item?.images?.[0] || "/placeholder.png"}
                  alt={boost.item?.title || "Product"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
                
                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5 border border-indigo-400/30 backdrop-blur-sm">
                    <Zap className="w-3 h-3 fill-white" />
                    {boost.plan} Plan
                  </div>
                  <div className={`px-3 py-1 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5 border backdrop-blur-sm ${
                    boost.paymentStatus === 'completed' ? 'bg-emerald-500 border-emerald-400/30' : 'bg-amber-500 border-amber-400/30'
                  }`}>
                    {boost.paymentStatus}
                  </div>
                </div>
              </div>

              <CardHeader className="space-y-4 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {boost.item?.title || "Deleted Product"}
                    </CardTitle>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                      <User className="w-3 h-3" />
                      <span>{boost.user?.username || "Unknown Seller"}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> Amount
                    </span>
                    <p className="text-sm font-black text-slate-700">Rs. {boost.totalAmount}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Method
                    </span>
                    <p className="text-sm font-black text-slate-700 uppercase">{boost.paymentMethod}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <span>Boosted on {new Date(boost.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs"
                    onClick={() => window.open(`/products/${boost.item?.slug}`, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-2" /> View
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border-none shadow-none font-bold text-xs"
                    onClick={() => handleCancelBoost(boost._id)}
                  >
                    <Trash2 className="w-3 h-3 mr-2" /> Cancel Boost
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DeleteConfirmationModal 
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setSelectedBoostId(null);
        }}
        onConfirm={confirmCancelBoost}
        title="Cancel Product Boost"
        description="Are you sure you want to cancel this boost? The item will lose its boosted status immediately."
        confirmText="Cancel Boost"
        isLoading={isCancelling}
      />
    </div>

  );
}
