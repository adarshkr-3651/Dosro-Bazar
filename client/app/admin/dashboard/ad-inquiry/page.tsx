"use client";

import { useState, useEffect } from "react";
import { 
  Mail, Phone, Calendar, User, 
  MessageSquare, Trash2, CheckCircle2, 
  Clock, AlertCircle, Loader2, ArrowRight,
  ExternalLink, Search, Filter, Tag
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { toast } from "sonner";
import { getAdminAdInquiriesAction, updateAdInquiryStatusAction, deleteAdInquiryAction } from "@/app/lib/ad-actions";

export default function AdInquiryPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await getAdminAdInquiriesAction();
      if (res.success) {
        setInquiries(res.data || []);
      } else {
        toast.error("Failed to fetch inquiries");
      }
    } catch (error) {
      toast.error("An error occurred while fetching inquiries");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await updateAdInquiryStatusAction(id, newStatus);
      if (res.success) {
        toast.success(`Inquiry marked as ${newStatus}`);
        setInquiries(prev => prev.map(inq => inq._id === id ? { ...inq, status: newStatus } : inq));
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this inquiry?")) return;
    
    try {
      const res = await deleteAdInquiryAction(id);
      if (res.success) {
        toast.success("Inquiry deleted successfully");
        setInquiries(prev => prev.filter(inq => inq._id !== id));
      } else {
        toast.error(res.error || "Failed to delete");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = 
      inq.name.toLowerCase().includes(search.toLowerCase()) || 
      inq.email.toLowerCase().includes(search.toLowerCase()) ||
      inq.message.toLowerCase().includes(search.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && inq.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'contacted': return <ArrowRight className="w-4 h-4 text-blue-500" />;
      case 'closed': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500">
            Ad Inquiries
          </h1>
          <p className="text-slate-500 text-lg flex items-center gap-2 font-medium">
            <Mail className="w-4 h-4 text-blue-600" />
            Listen to potential advertisers and leads
          </p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search leads..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 h-12 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none w-64 shadow-sm"
                />
            </div>
            <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="h-12 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm cursor-pointer"
            >
                <option value="all">All States</option>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
            </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
          <Loader2 className="w-12 h-12 text-blue-300 animate-spin mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Leads...</p>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 text-center px-8">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <MessageSquare className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-slate-900 text-xl font-bold mb-2">Silence is golden</h3>
          <p className="text-slate-500 max-w-sm mb-4">No inquiries found matching your current filters or search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredInquiries.map((inquiry) => (
            <Card key={inquiry._id} className="bg-white border-slate-100 hover:border-blue-200 transition-all shadow-sm hover:shadow-md rounded-3xl overflow-hidden group">
                <div className="flex flex-col md:flex-row">
                    {/* Status vertical bar */}
                    <div className={`w-1.5 ${
                        inquiry.status === 'pending' ? 'bg-amber-500' :
                        inquiry.status === 'contacted' ? 'bg-blue-500' : 'bg-emerald-500'
                    }`} />
                    
                    <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-4 flex-1">
                            {/* Top Info */}
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                                    <User className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{inquiry.name}</h3>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                                            <Mail className="w-3.5 h-3.5 text-blue-500" /> {inquiry.email}
                                        </span>
                                        <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                                            <Phone className="w-3.5 h-3.5 text-emerald-500" /> {inquiry.phone}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Message Context */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                        inquiry.type === 'general' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                                    }`}>
                                        {inquiry.type === 'general' ? 'Ad Placement' : 'Product Lead'}
                                    </span>
                                    {inquiry.adId && (
                                        <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                                            <Tag className="w-3 h-3" /> {inquiry.adId.companyName}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                                    "{inquiry.message}"
                                </p>
                            </div>
                        </div>

                        <div className="md:w-64 flex flex-col justify-between items-end border-l border-slate-100 pl-6 gap-4">
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-2 mb-2">
                                    {getStatusIcon(inquiry.status)}
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-900">{inquiry.status}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {new Date(inquiry.createdAt).toLocaleString()}
                                </span>
                            </div>

                            <div className="flex gap-2 w-full">
                                {inquiry.status === 'pending' && (
                                    <Button 
                                        onClick={() => handleStatusUpdate(inquiry._id, 'contacted')}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 rounded-xl text-[10px] uppercase tracking-widest"
                                    >
                                        Mark Contacted
                                    </Button>
                                )}
                                {inquiry.status === 'contacted' && (
                                    <Button 
                                        onClick={() => handleStatusUpdate(inquiry._id, 'closed')}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 rounded-xl text-[10px] uppercase tracking-widest"
                                    >
                                        Close Case
                                    </Button>
                                )}
                                <Button 
                                    onClick={() => handleDelete(inquiry._id)}
                                    variant="outline"
                                    className="w-10 h-10 rounded-xl border-slate-200 p-0 text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
