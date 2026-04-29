"use client";

import { useState, useEffect } from "react";
import { 
  Plus, Trash2, Calendar, Layout, Mail, 
  Building2, ExternalLink, Activity, 
  AlertCircle, CheckCircle2, Loader2,
  X, Camera, Clock, Tag
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { getAllAdsAction, createAdAction, deleteAdAction, updateAdStatusAction } from "@/app/lib/ad-actions";
import DeleteConfirmationModal from "@/app/components/DeleteConfirmationModal";


export default function AdvertisementPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isFilteringEnabled, setIsFilteringEnabled] = useState(true);
  const [isSettingLoading, setIsSettingLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adToDelete, setAdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  useEffect(() => {
    fetchAds();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { getSettingsAction } = await import("@/app/lib/ad-actions");
      const res = await getSettingsAction();
      if (res.success) {
        const filterSetting = res.data.find((s: any) => s.key === "ad_image_filtering");
        if (filterSetting) setIsFilteringEnabled(filterSetting.value);
      }
    } catch (error) {
      console.error("Failed to fetch settings");
    }
  };

  const handleToggleFiltering = async () => {
    setIsSettingLoading(true);
    try {
      const { updateSettingAction } = await import("@/app/lib/ad-actions");
      const newValue = !isFilteringEnabled;
      const res = await updateSettingAction("ad_image_filtering", newValue);
      if (res.success) {
        setIsFilteringEnabled(newValue);
        toast.success(`Image filtering ${newValue ? "Enabled" : "Disabled"}`);
      } else {
        toast.error("Failed to update setting");
      }
    } catch (error) {
      toast.error("Connection error");
    } finally {
      setIsSettingLoading(false);
    }
  };

  const fetchAds = async () => {
    setLoading(true);
    try {
      const data = await getAllAdsAction("all");
      if (data.success) {
        setAds(data.ads || []);
      }
    } catch (error) {
      toast.error("Failed to fetch advertisements");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await createAdAction(formData);
      if (res.success) {
        toast.success("Advertisement created successfully!");
        setIsModalOpen(false);
        setPreviewImage(null);
        fetchAds();
      } else {
        toast.error(res.error || "Failed to create advertisement");
      }
    } catch (error) {
      toast.error("Server connection error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setAdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteAd = async () => {
    if (!adToDelete) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteAdAction(adToDelete);
      if (res.success) {
        toast.success("Ad removed successfully");
        setIsDeleteModalOpen(false);
        fetchAds();
      } else {
        toast.error(res.error || "Failed to delete");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsDeleting(false);
      setAdToDelete(null);
    }
  };


  const handleEdit = (ad: any) => {
    setSelectedAd(ad);
    setIsEditMode(true);
    setPreviewImage(ad.imageUrl);
    setIsModalOpen(true);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    // Check if the ad is expired or has a past date when trying to run it
    const ad = ads.find(a => a._id === id);
    const isPastDate = ad && new Date(ad.expiryDate) < new Date();

    if (currentStatus !== "running" && isPastDate) {
      toast.warning("Please change the expiry due date", {
        description: "Re-activating an expired ad requires a future manually-set date.",
        duration: 5000,
      });
      // Automatically open edit mode for the user
      handleEdit(ad);
      return;
    }

    const newStatus = currentStatus === "running" ? "stopped" : "running";
    try {
      const res = await updateAdStatusAction(id, newStatus);
      if (res.success) {
        toast.success(`Status updated to ${newStatus}`);
        fetchAds();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedAd(null);
    setPreviewImage(null);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const status = formData.get("status") as string;
    const expiryDate = formData.get("expiryDate") as string;

    if (isEditMode && status === "running" && expiryDate) {
      if (new Date(expiryDate) < new Date()) {
        toast.error("Invalid Expiry Date", { 
            description: "Cannot set status to 'Running' with an expired date. Please select a future date." 
        });
        return;
      }
    }

    setFormLoading(true);
    
    // Remove empty file object if no new image was selected to prevent "Empty file" error
    const imageFile = formData.get("image") as File;
    if (imageFile && imageFile.size === 0) {
      formData.delete("image");
    }
    
    try {
      let res;
      if (isEditMode && selectedAd) {
        const { editAdAction } = await import("@/app/lib/ad-actions");
        res = await editAdAction(selectedAd._id, formData);
      } else {
        res = await createAdAction(formData);
      }

      if (res.success) {
        toast.success(isEditMode ? "Advertisement updated!" : "Advertisement created!");
        closeModal();
        fetchAds();
      } else {
        toast.error(res.error || "Failed to process advertisement");
      }
    } catch (error) {
      toast.error("Server connection error");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500">
            Ad Management
          </h1>
          <p className="text-slate-500 text-lg flex items-center gap-2 font-medium">
            <Layout className="w-4 h-4 text-emerald-600" />
            Provision and monitor platform placements
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           {/* Filtering Toggle */}
           <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
             <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Moderation</span>
               <span className={`text-xs font-bold ${isFilteringEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                 {isFilteringEnabled ? 'Enabled' : 'Disabled'}
               </span>
             </div>
             <button 
                onClick={handleToggleFiltering}
                disabled={isSettingLoading}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${isFilteringEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
             >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${isFilteringEnabled ? 'translate-x-6' : ''}`}>
                  {isSettingLoading && <Loader2 className="w-3 h-3 text-slate-400 animate-spin m-0.5" />}
                </div>
             </button>
           </div>

           <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-6 rounded-2xl flex items-center gap-2 shadow-xl transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5" /> Deploy New Ad
          </Button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Ad List Section */}
        <div className="xl:col-span-2 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
              <Loader2 className="w-12 h-12 text-slate-300 animate-spin mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Ad Network...</p>
            </div>
          ) : ads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 text-center px-8">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Tag className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-slate-900 text-xl font-bold mb-2">No Active Deployments</h3>
              <p className="text-slate-500 max-w-sm mb-8">Deploy your first advertisement to see it on the platform banners.</p>
              <Button variant="outline" onClick={() => setIsModalOpen(true)} className="rounded-xl border-slate-200">
                Deploy Now
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ads.map((ad) => (
                <Card key={ad._id} className="bg-white border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group rounded-2xl">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image 
                      src={ad.imageUrl} 
                      alt={ad.companyName} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                        ad.status === 'running' 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-rose-500 text-white'
                      }`}>
                        {ad.status}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-400" /> {ad.companyName}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
                          <Mail className="w-3 h-3" /> {ad.companyEmail}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Placement</span>
                        <span className="text-xs font-black text-slate-700 uppercase flex items-center gap-2">
                          <Layout className="w-3 h-3 text-emerald-600" /> {ad.placement.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Expiry</span>
                        <span className="text-xs font-black text-slate-700 flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-blue-500" /> {new Date(ad.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleEdit(ad)}
                        variant="ghost" 
                        size="sm"
                        className="rounded-xl border-slate-200"
                      >
                         Edit
                      </Button>
                      <Button 
                        onClick={() => toggleStatus(ad._id, ad.status)}
                        variant="outline" 
                        size="sm"
                        className={`flex-1 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-colors ${
                          ad.status === 'running' 
                            ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-500 hover:text-white' 
                            : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-500 hover:text-white'
                        }`}
                      >
                        {ad.status === 'running' ? 'Stop' : 'Run'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="rounded-xl border-slate-200"
                        asChild
                      >
                         <a href={ad.imageUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                         </a>
                      </Button>
                      <Button 
                        onClick={() => handleDelete(ad._id)}
                        variant="outline" 
                        size="sm"
                        className="rounded-xl bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-3xl">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-5">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" /> Ad Network Health
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 font-medium">Total Provisioned</span>
                <span className="text-xl font-black text-slate-900">{ads.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 font-medium">Running Nodes</span>
                <span className="text-lg font-black text-emerald-600">
                  {ads.filter(a => a.status === 'running').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 font-medium">Coming Expiries</span>
                <span className="text-lg font-black text-amber-500">
                  {ads.filter(a => {
                    const days = (new Date(a.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
                    return days < 7 && days > 0;
                  }).length}
                </span>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Live Placements</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-slate-100 rounded-md text-[9px] font-black uppercase tracking-tighter text-slate-600">Main Banner (2/3)</span>
                  <span className="px-2 py-1 bg-slate-100 rounded-md text-[9px] font-black uppercase tracking-tighter text-slate-600">Sidebar (1/3)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Layout className="w-32 h-32" />
            </div>
            <CardHeader>
              <CardTitle className="text-sm font-bold opacity-60 uppercase tracking-widest">Revenue Projections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black mb-2">Rs. { (ads.filter(a => a.status === 'running').length * 99).toLocaleString() }</div>
              <p className="text-xs opacity-60 font-medium italic">Estimated daily ecosystem yield at Rs. 99/day rate</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Deployment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-lg bg-white border-slate-200 shadow-2xl relative overflow-hidden rounded-3xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <div className="space-y-1">
                <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <Activity className="w-5 h-5 text-emerald-600" /> {isEditMode ? "Revised Advertisement" : "Provision Advertisement"}
                </CardTitle>
                <CardDescription className="font-medium">
                  {isEditMode ? "Updating active placement details" : "Setup new automated ad placement"}
                </CardDescription>
              </div>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Company Name</Label>
                    <Input 
                      name="companyName" 
                      required 
                      defaultValue={selectedAd?.companyName}
                      placeholder="e.g. Acme Corp" 
                      className="h-12 rounded-xl bg-emerald-50/30 border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500/20 font-bold transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Contact Email</Label>
                    <Input 
                      name="companyEmail" 
                      type="email" 
                      required 
                      defaultValue={selectedAd?.companyEmail}
                      placeholder="ad@acme.com" 
                      className="h-12 rounded-xl bg-emerald-50/30 border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500/20 font-bold transition-all" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Placement Zone</Label>
                    <select 
                      name="placement" 
                      defaultValue={selectedAd?.placement || "main_banner"}
                      className="w-full h-12 px-3 bg-emerald-50/30 border border-emerald-100 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    >
                      <option value="main_banner">Main Banner (2/3)</option>
                      <option value="sidebar">Sidebar (1/3)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Expiry Date</Label>
                    <Input 
                      name="expiryDate" 
                      type="date" 
                      required 
                      defaultValue={selectedAd?.expiryDate ? new Date(selectedAd.expiryDate).toISOString().split('T')[0] : ""}
                      className="h-12 rounded-xl bg-emerald-50/30 border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500/20 font-bold transition-all" 
                    />
                  </div>
                </div>

                {isEditMode && (
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Reactivate Status</Label>
                    <select 
                      name="status" 
                      defaultValue={selectedAd?.status || "running"}
                      className="w-full h-12 px-3 bg-emerald-50/30 border border-emerald-100 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-black uppercase tracking-widest"
                    >
                      <option value="running">Running</option>
                      <option value="stopped">Stopped</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Ad Asset (Image)</Label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      name="image" 
                      accept="image/*" 
                      required={!isEditMode} 
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="h-32 border-2 border-dashed border-emerald-100 rounded-2xl flex flex-col items-center justify-center bg-emerald-50/20 group-hover:bg-emerald-50 transition-all">
                      {previewImage ? (
                        <div className="relative w-full h-full p-2">
                          <Image src={previewImage} alt="Preview" fill className="object-contain rounded-xl" />
                        </div>
                      ) : (
                        <>
                          <Camera className="w-8 h-8 text-emerald-300 mb-2" />
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Select Banner Graphics</span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium italic">Recommended: 1200x600 for Banner, 400x600 for Sidebar</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={closeModal}
                    className="flex-1 rounded-2xl font-bold uppercase tracking-widest text-xs h-12"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={formLoading}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs h-12 shadow-xl"
                  >
                    {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEditMode ? "Update Asset" : "Deploy Now")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAdToDelete(null);
        }}
        onConfirm={confirmDeleteAd}
        title="Remove Advertisement"
        description="Are you sure you want to remove this advertisement? This action cannot be undone."
        confirmText="Remove Ad"
        isLoading={isDeleting}
      />
    </div>

  );
}
