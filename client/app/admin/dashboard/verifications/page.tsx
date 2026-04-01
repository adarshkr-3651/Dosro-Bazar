"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  CheckCircle2, XCircle, Clock, Search, 
  User, Mail, Calendar, Shield, ExternalLink,
  Loader2, AlertCircle, Eye, Trash2, Filter,
  FileText, ArrowUpRight
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { toast } from "sonner";
import { getVerificationsAction, updateVerificationAction } from "@/app/lib/admin-data-actions";

export default function VerificationsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchVerifications = useCallback(async () => {
    setLoading(true);
    try {
      // Mapping 'all' to empty string for the API
      const statusParam = statusFilter === "all" ? "" : statusFilter;
      const res = await getVerificationsAction(1, statusParam);
      
      if (res.success) {
        setUsers(res.data || []);
      } else {
        toast.error(res.error || "Failed to fetch verifications");
      }
    } catch (error) {
      toast.error("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  const handleUpdateStatus = async (userId: string, status: string) => {
    try {
      const res = await updateVerificationAction(userId, status);
      if (res.success) {
        toast.success(`User verification ${status} successfully`);
        setUsers(prev => prev.map(user => 
          user._id === userId ? { ...user, verificationStatus: status } : user
        ));
      } else {
        toast.error(res.error || "Update failed");
      }
    } catch (error) {
      toast.error("Network error occurred");
    }
  };

  const filteredUsers = users.filter(user => {
    const searchTerm = search.toLowerCase();
    return (
      user.username?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm) ||
      user.phone?.includes(searchTerm)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1 rounded-full font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-none px-3 py-1 rounded-full font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5"><XCircle className="w-3 h-3" /> Rejected</Badge>;
      default:
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-3 py-1 rounded-full font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5"><Clock className="w-3 h-3" /> Pending</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              User <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Verifications</span>
            </h1>
          </div>
          <p className="text-slate-500 text-lg font-medium">Verify seller identities and maintain platform trust</p>
        </div>

        <div className="flex items-center gap-3">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 pr-4 h-14 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none w-72 shadow-sm"
                />
            </div>
            <div className="h-14 bg-white border border-slate-200 rounded-2xl p-1.5 flex gap-1 shadow-sm">
                {['all', 'pending', 'approved', 'rejected'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setStatusFilter(tab)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                            statusFilter === tab 
                            ? 'bg-slate-900 text-white shadow-md' 
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-dashed border-slate-200 shadow-sm">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin" />
            <Shield className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-6 text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Fetching Request Data...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-dashed border-slate-200 text-center px-8 shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 ring-8 ring-slate-50/50">
            <FileText className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-slate-900 text-2xl font-bold mb-3">No verification requests</h3>
          <p className="text-slate-500 max-w-sm font-medium">All clear! No pending identity verifications match your current criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user._id} className="bg-white border-slate-100 hover:border-blue-200 transition-all shadow-sm hover:shadow-xl rounded-[2rem] overflow-hidden group border">
              <div className="p-6 md:p-8 space-y-6">
                {/* Top Section: Profile info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform duration-500">
                      <User className="w-8 h-8 text-slate-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-xl text-slate-900 uppercase tracking-tight">{user.username}</h3>
                            {getStatusBadge(user.verificationStatus)}
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                                <Mail className="w-3.5 h-3.5 text-blue-500" /> {user.email}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-2 font-bold italic">
                                <Calendar className="w-3.5 h-3.5" /> Registered: {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Document Preview Section */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 group/img shadow-inner">
                    {user.idProof ? (
                        <>
                            <img 
                                src={user.idProof} 
                                alt="ID Proof" 
                                className="w-full h-full object-cover opacity-90 group-hover/img:scale-110 group-hover/img:opacity-100 transition-all duration-700 cursor-pointer"
                                onClick={() => setSelectedImage(user.idProof)}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <Button 
                                    variant="secondary" 
                                    size="sm"
                                    className="rounded-full font-bold uppercase tracking-tighter text-[10px] h-8 px-4"
                                    onClick={() => setSelectedImage(user.idProof)}
                                >
                                    <Eye className="w-3.5 h-3.5 mr-1.5" /> Full View
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-3">
                            <AlertCircle className="w-10 h-10 text-slate-700" />
                            <p className="font-bold uppercase tracking-widest text-[10px]">No ID Proof Found</p>
                        </div>
                    )}
                </div>

                {/* Actions Section */}
                <div className="flex items-center gap-3 pt-2">
                    {user.verificationStatus !== 'approved' && (
                        <Button 
                            onClick={() => handleUpdateStatus(user._id, 'approved')}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black h-12 rounded-2xl text-[10px] uppercase tracking-[0.15em] shadow-lg shadow-emerald-100 transition-all hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Approve Identity
                        </Button>
                    )}
                    {user.verificationStatus !== 'rejected' && (
                        <Button 
                            variant="outline"
                            onClick={() => handleUpdateStatus(user._id, 'rejected')}
                            className="flex-1 border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 font-black h-12 rounded-2xl text-[10px] uppercase tracking-[0.15em] transition-all hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Reject Proof
                        </Button>
                    )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
            className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300"
            onClick={() => setSelectedImage(null)}
        >
            <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center gap-6">
                <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors flex items-center gap-2 font-bold uppercase tracking-widest text-xs"
                >
                    Close <XCircle className="w-6 h-6" />
                </button>
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/20">
                    <img 
                        src={selectedImage} 
                        alt="Enlarged ID Proof" 
                        className="w-full h-auto object-contain max-h-[80vh]"
                    />
                </div>
                <div className="flex gap-4">
                    <a 
                        href={selectedImage} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="h-12 px-8 bg-white text-slate-900 rounded-2xl flex items-center gap-2 font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Open In New Tab <ArrowUpRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
