"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Megaphone, Plus, Clock, StopCircle, History,
    Trash2, Upload, Building2, Calendar, Target,
    CheckCircle2, AlertCircle, Loader2, Image as ImageIcon,
    Edit2, X
} from "lucide-react";
import { createAdAction, getAllAdsAction, updateAdStatusAction, deleteAdAction, editAdAction } from "@/app/lib/ad-actions";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import Image from "next/image";

export default function AdvertisementPage() {
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [formExpiry, setFormExpiry] = useState<string>("");

    // Edit States & Toast
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedAdForEdit, setSelectedAdForEdit] = useState<any>(null);
    const [editFormLoading, setEditFormLoading] = useState(false);
    const [editPreview, setEditPreview] = useState<string | null>(null);
    const [editFormExpiry, setEditFormExpiry] = useState<string>("");

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchAds = useCallback(async () => {
        setLoading(true);
        const result = await getAllAdsAction();
        if (result.success) {
            setAds(result.ads);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchAds();
    }, [fetchAds]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData(e.currentTarget);
        const result = await createAdAction(formData);

        if (result.success) {
            setSuccess("Advertisement provisioned successfully");
            setPreview(null);
            setFormExpiry("");
            e.currentTarget.reset();
            fetchAds();
        } else {
            setError(result.error || "Failed to create advertisement");
        }
        setFormLoading(false);
    };

    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEditFormLoading(true);

        const formData = new FormData(e.currentTarget);
        
        // Discard the image payload if the user didn't actually select a new creative
        const imageFile = formData.get("image") as File;
        if (imageFile && imageFile.size === 0) {
            formData.delete("image");
        }

        const result = await editAdAction(selectedAdForEdit._id, formData);

        if (result.success) {
            showToast("Advertisement updated successfully", "success");
            fetchAds();
        } else {
            showToast(result.error || "Failed to update advertisement", "error");
        }
        
        setEditFormLoading(false);
        setEditModalOpen(false); // Make sure the modal securely drops regardless of response state
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        const result = await updateAdStatusAction(id, status);
        if (result.success) {
            showToast(`Ad status successfully changed to ${status}`, "success");
            fetchAds();
        } else {
            showToast(result.error || "Failed to change ad status", "error");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to remove this advertisement?")) {
            const result = await deleteAdAction(id);
            if (result.success) {
                showToast("Advertisement purged entirely", "success");
                fetchAds();
            } else {
                showToast("Failed to delete advertisement", "error");
            }
        }
    };

    const openEditModal = (ad: any) => {
        setSelectedAdForEdit(ad);
        setEditPreview(ad.imageUrl);
        // Format ISO string to datetime-local format (YYYY-MM-DDThh:mm)
        const d = new Date(ad.expiryDate);
        const tzOffset = d.getTimezoneOffset() * 60000; // offset in milliseconds
        const localISOTime = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 16);
        setEditFormExpiry(localISOTime);
        setEditModalOpen(true);
    };

    const calculateTimeRemaining = (expiryDate: string) => {
        const now = new Date();
        const expiry = new Date(expiryDate);
        const diff = expiry.getTime() - now.getTime();

        if (diff <= 0) return "Expired";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) return `${days}d ${hours}h remaining`;
        return `${hours}h remaining`;
    };

    const activeAds = ads.filter(ad => ad.status === 'running');
    const inactiveAds = ads.filter(ad => ad.status !== 'running');

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 -mt-6 md:-mt-8 relative">

            {/* Floating Notification */}
            {toast && (
                <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-top-10
                    ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                    {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-bold text-sm tracking-widest uppercase">{toast.message}</span>
                </div>
            )}

            {/* Edit Modal */}
            {editModalOpen && selectedAdForEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-zinc-950 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-emerald-500/20 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                        <div className="p-8 space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-extrabold text-white flex items-center gap-2"><Edit2 className="w-5 h-5 text-emerald-500" /> Modify Advertisement</h3>
                                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1">Update Live Node Parameters</p>
                                </div>
                                <button 
                                    onClick={() => setEditModalOpen(false)}
                                    className="p-2 rounded-full hover:bg-zinc-900 transition-colors"
                                >
                                    <X className="w-5 h-5 text-zinc-500" />
                                </button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Creative Asset <span className="text-zinc-600">(Optional)</span></Label>
                                    <div className="relative h-40 rounded-3xl border-2 border-dashed border-emerald-500/50 bg-emerald-500/5 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center group">
                                        <input
                                            type="file"
                                            name="image"
                                            onChange={handleEditImageChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                        {editPreview ? (
                                            <Image src={editPreview} alt="Preview" fill className="object-cover transition-transform group-hover:scale-105 duration-700 opacity-50 group-hover:opacity-100" />
                                        ) : null}
                                        <div className="absolute z-20 p-4 rounded-2xl bg-zinc-900 border border-emerald-500/30 text-emerald-500 shadow-2xl">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="editCompanyName" className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Corporate Identity</Label>
                                        <Input id="editCompanyName" name="companyName" defaultValue={selectedAdForEdit.companyName} required className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 rounded-xl h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="editCompanyEmail" className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Company Contact Email</Label>
                                        <Input id="editCompanyEmail" name="companyEmail" type="email" defaultValue={selectedAdForEdit.companyEmail} required className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 rounded-xl h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="editPlan" className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Service tier</Label>
                                        <select
                                            name="plan"
                                            id="editPlan"
                                            defaultValue={selectedAdForEdit.plan}
                                            className="w-full h-12 px-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50 appearance-none"
                                        >
                                            <option value="Basic">Basic</option>
                                            <option value="Standard">Standard</option>
                                            <option value="Premium">Premium</option>
                                            <option value="Elite">Elite</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="editPlacement" className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Placement</Label>
                                        <select
                                            name="placement"
                                            id="editPlacement"
                                            defaultValue={selectedAdForEdit.placement}
                                            className="w-full h-12 px-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50 appearance-none"
                                        >
                                            <option value="main_banner">Hero Banner</option>
                                            <option value="sidebar">Sidebar (Enquiry)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="editExpiryDate" className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Expiry protocol</Label>
                                    </div>
                                    <Input
                                        id="editExpiryDate"
                                        name="expiryDate"
                                        type="datetime-local"
                                        required
                                        value={editFormExpiry}
                                        onChange={(e) => setEditFormExpiry(e.target.value)}
                                        className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 rounded-xl h-12 text-zinc-300 cursor-pointer"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={editFormLoading}
                                    className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-emerald-900/20 disabled:opacity-50"
                                >
                                    {editFormLoading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Syncing modifications...
                                        </span>
                                    ) : "Save Changes"}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Provisioning Form */}
                <div className="xl:col-span-1">
                    <div className="sticky top-0">
                        <div className="p-1 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/20 via-zinc-800 to-zinc-900/40">
                            <div className="bg-zinc-950 rounded-[2.4rem] p-8 border border-zinc-800/50 space-y-8">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Plus className="w-5 h-5 text-emerald-500" />
                                        Provision Ad
                                    </h2>
                                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">New Deployment Node</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Image Upload Area */}
                                    <div className="space-y-3">
                                        <Label className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Creative Asset</Label>
                                        <div
                                            className={`relative h-48 rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-3 group
                                                ${preview ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-900/40'}`}
                                        >
                                            <input
                                                type="file"
                                                name="image"
                                                onChange={handleImageChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                required
                                            />
                                            {preview ? (
                                                <Image src={preview} alt="Preview" fill className="object-cover transition-transform group-hover:scale-105 duration-700" />
                                            ) : (
                                                <>
                                                    <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 group-hover:text-emerald-500 group-hover:border-emerald-500/30 transition-all">
                                                        <Upload className="w-6 h-6" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-zinc-400 text-sm font-bold">Standard Banner</p>
                                                        <p className="text-zinc-600 text-[10px] uppercase font-bold mt-1">PNG, JPG up to 5MB</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="companyName" className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Corporate Identity</Label>
                                                <div className="relative">
                                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                                    <Input id="companyName" name="companyName" required className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 rounded-xl h-12" placeholder="Company Name" />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="companyEmail" className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Company Contact Email</Label>
                                                <div className="relative">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 flex items-center justify-center">@</div>
                                                    <Input id="companyEmail" name="companyEmail" type="email" required className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 rounded-xl h-12" placeholder="marketing@company.com" />
                                                </div>
                                            </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="plan" className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Service tier</Label>
                                                <div className="relative">
                                                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                                    <select
                                                        name="plan"
                                                        id="plan"
                                                        className="w-full h-12 pl-10 pr-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50 appearance-none"
                                                    >
                                                        <option value="Basic">Basic</option>
                                                        <option value="Standard">Standard</option>
                                                        <option value="Premium">Premium</option>
                                                        <option value="Elite">Elite</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="placement" className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Placement</Label>
                                                <select
                                                    name="placement"
                                                    id="placement"
                                                    className="w-full h-12 px-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50 appearance-none"
                                                >
                                                    <option value="main_banner">Hero Banner</option>
                                                    <option value="sidebar">Sidebar (Enquiry)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="expiryDate" className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Expiry protocol</Label>
                                                {formExpiry && (
                                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter animate-in fade-in slide-in-from-right-2">
                                                        Duration: {calculateTimeRemaining(formExpiry)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                                                <Input
                                                    id="expiryDate"
                                                    name="expiryDate"
                                                    type="datetime-local"
                                                    required
                                                    value={formExpiry}
                                                    onChange={(e) => setFormExpiry(e.target.value)}
                                                    onClick={(e) => e.currentTarget.showPicker()}
                                                    className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 rounded-xl h-12 text-zinc-300 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    </div>

                                    {error && (
                                        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-500 text-xs font-bold animate-in fade-in slide-in-from-top-2">
                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                            {error}
                                        </div>
                                    )}

                                    {success && (
                                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-500 text-xs font-bold animate-in fade-in slide-in-from-top-2">
                                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                            {success}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={formLoading}
                                        className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-emerald-900/20 disabled:opacity-50"
                                    >
                                        {formLoading ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Syncing creative to Cloudinary...
                                            </span>
                                        ) : "Deploy Campaign"}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ads Display */}
                <div className="xl:col-span-2 space-y-12">
                    {/* Active Campaign */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-500/10">
                                    <Clock className="w-5 h-5 text-emerald-500" />
                                </div>
                                Active Transmissions
                            </h3>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">
                                Live {activeAds.length}
                            </span>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2].map(i => (
                                    <div key={i} className="h-64 rounded-[2.5rem] bg-zinc-900/50 animate-pulse border border-zinc-800" />
                                ))}
                            </div>
                        ) : activeAds.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {activeAds.map((ad) => (
                                    <div key={ad._id} className="group relative rounded-[2.5rem] bg-zinc-900/40 border border-zinc-800 overflow-hidden hover:border-emerald-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/5">
                                        <div className="aspect-[16/9] relative border-b border-zinc-800 overflow-hidden">
                                            <Image src={ad.imageUrl} alt={ad.companyName} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute top-4 right-4 flex gap-2">
                                                <div className="px-3 py-1.5 rounded-full bg-zinc-950/80 backdrop-blur-md border border-white/10 text-[10px] font-black text-white uppercase tracking-tighter">
                                                    {ad.plan} Tier
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <div>
                                                <h4 className="text-white font-bold text-lg">{ad.companyName}</h4>
                                                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">Placement: {ad.placement.replace('_', ' ')}</p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="text-emerald-500 text-xs font-bold flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                                    {calculateTimeRemaining(ad.expiryDate)}
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(ad)}
                                                        className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-500 hover:border-emerald-500/50 hover:text-emerald-500 transition-all flex items-center gap-2 group/btn2"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                        <span className="text-[10px] font-black uppercase opacity-0 group-hover/btn2:opacity-100 transition-all w-0 group-hover/btn2:w-auto">Edit Ad</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(ad._id, 'stopped')}
                                                        className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-500 hover:border-rose-500/50 hover:text-rose-500 transition-all flex items-center gap-2 group/btn"
                                                    >
                                                        <StopCircle className="w-4 h-4" />
                                                        <span className="text-[10px] font-black uppercase opacity-0 group-hover/btn:opacity-100 transition-all w-0 group-hover/btn:w-auto">Stop Ad</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-20 rounded-[3rem] border-2 border-dashed border-zinc-800 bg-zinc-900/10 flex flex-col items-center justify-center text-center gap-4">
                                <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 text-zinc-700">
                                    <Megaphone className="w-10 h-10" />
                                </div>
                                <div>
                                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No active nodes detected</p>
                                    <p className="text-zinc-700 text-sm mt-1">Provision a new creative using the dispatch panel.</p>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Ad History */}
                    <section className="space-y-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-zinc-900">
                                <History className="w-5 h-5 text-zinc-500" />
                            </div>
                            Archive & Intelligence
                        </h3>

                        <div className="bg-zinc-950/50 rounded-[2.5rem] border border-zinc-900 overflow-hidden divide-y divide-zinc-900">
                            {inactiveAds.length > 0 ? (
                                inactiveAds.map((ad) => (
                                    <div key={ad._id} className="flex items-center gap-5 p-6 hover:bg-zinc-900/30 transition-all">
                                        <div className="relative w-20 h-12 rounded-xl overflow-hidden grayscale opacity-50 flex-shrink-0">
                                            <Image src={ad.imageUrl} alt={ad.companyName} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-4">
                                                <h5 className="text-zinc-300 font-bold text-sm truncate">{ad.companyName}</h5>
                                                <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border
                                                    ${ad.status === 'expired' ? 'bg-amber-500/5 border-amber-500/20 text-amber-500' : 'bg-rose-500/5 border-rose-500/20 text-rose-500'}`}>
                                                    {ad.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">Plan: {ad.plan}</span>
                                                <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">Expired: {new Date(ad.expiryDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleStatusUpdate(ad._id, 'running')}
                                                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-emerald-500 hover:border-emerald-500/30 transition-all"
                                                title="Restart Transmission"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(ad._id)}
                                                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-rose-500 hover:border-rose-500/30 transition-all"
                                                title="Purge Node"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center">
                                    <p className="text-zinc-700 text-xs font-bold uppercase tracking-widest italic">Vault Empty</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
