"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { updateProfile, changePassword } from "../lib/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { User, Mail, Camera, Loader2, Moon, Sun, Phone, MapPin, Lock, Laptop, Smartphone, Monitor, X } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Switch } from "@/app/components/ui/switch";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { FileText, ShieldCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

const resolvePhotoUrl = (photoPath?: string | null) => {
    if (!photoPath) {
        return null;
    }

    if (photoPath.startsWith("http://") || photoPath.startsWith("https://")) {
        return photoPath;
    }

    const cleanedPath = photoPath
        .replace(/^public\//, "")
        .replace(/^\/+/, "");

    const finalPath = cleanedPath.includes("/")
        ? cleanedPath
        : `userPhotos/${cleanedPath}`;

    return `${API_BASE_URL}/${finalPath}`;
};

export default function ProfilePage() {
    const { user, checkAuthStatus, setUser } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        address: "",
        idProofType: "",
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [photo, setPhoto] = useState<File | null>(null);
    const [idProof, setIdProof] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [idProofPreviewUrl, setIdProofPreviewUrl] = useState<string | null>(null);
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isSecurityOpen, setIsSecurityOpen] = useState(false);
    const [language, setLanguage] = useState("English");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                idProofType: user.idProofType || "",
            });
            setPreviewUrl(resolvePhotoUrl(user.photo) || null);
            setIdProofPreviewUrl(resolvePhotoUrl(user.idProof) || null);
            // Don't force theme here - let ThemeSync handle it on initial load
            // This allows manual theme toggles to work without being overridden
        } else {
            setPreviewUrl(null);
        }
    }, [user]);

    const handleLocationFetch = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported");
            return;
        }

        toast.loading("Fetching specific location...", { id: "geo" });
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
                    const data = await res.json();
                    const addr = data.address;

                    // Build a more specific address string
                    const parts = [];
                    // Very specific landmarks
                    if (addr.hospital) parts.push(addr.hospital);
                    if (addr.amenity && addr.amenity !== addr.hospital) parts.push(addr.amenity);
                    if (addr.building) parts.push(addr.building);
                    if (addr.landmark) parts.push(addr.landmark);
                    
                    // Street/Road
                    if (addr.road) parts.push(addr.road);
                    
                    // Locality/Suburb
                    if (addr.suburb) parts.push(addr.suburb);
                    else if (addr.neighbourhood) parts.push(addr.neighbourhood);
                    else if (addr.hamlet) parts.push(addr.hamlet);
                    else if (addr.village) parts.push(addr.village);
                    
                    // City/District
                    if (addr.city) parts.push(addr.city);
                    else if (addr.town) parts.push(addr.town);
                    
                    if (addr.district) parts.push(addr.district);
                    else if (addr.county) parts.push(addr.county);
                    
                    // State
                    if (addr.state) parts.push(addr.state);

                    // Join with commas
                    const locationString = parts.length > 0 ? parts.join(", ") : "Unknown Location";

                    setFormData(prev => ({ ...prev, address: locationString }));
                    toast.success("Location updated", { id: "geo" });
                } catch (error) {
                    setFormData(prev => ({ ...prev, address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
                    toast.error("Detailed address not found, coordinates used", { id: "geo" });
                }
            },
            (error) => {
                toast.error("Failed to get location", { id: "geo" });
            }
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhoto(file);
            setPreviewUrl(URL.createObjectURL(file));
            
            // Auto-save photo immediately
            const data = new FormData();
            data.append("photo", file);
            // Append other required fields for profile update if any, 
            // but controller usually handles partial updates or we send current formData
            data.append("username", formData.username);
            data.append("email", formData.email);
            data.append("phone", formData.phone);
            data.append("address", formData.address);
            data.append("idProofType", formData.idProofType);

            try {
                setLoading(true);
                const response = await updateProfile(data);
                if (response.data) {
                    setUser(response.data);
                }
                setMessage({ type: 'success', text: 'Photo updated and saved automatically!' });
            } catch (error: any) {
                setMessage({ type: 'error', text: error.message || 'Failed to auto-save photo' });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIdProof(file);
            setIdProofPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const data = new FormData();
            data.append("username", formData.username);
            data.append("email", formData.email);
            data.append("phone", formData.phone);
            data.append("address", formData.address);
            data.append("idProofType", formData.idProofType);
            data.append("theme", theme || "system");
            if (photo) {
                data.append("photo", photo);
            }
            if (idProof) {
                data.append("idProof", idProof);
            }

            const response = await updateProfile(data);
            if (response.success) {
                if (response.data) {
                    setUser(response.data);
                } else {
                    await checkAuthStatus();
                }

                setMessage({
                    type: response.data?.verificationStatus === 'rejected' ? 'error' : 'success',
                    text: response.message || 'Profile updated successfully!'
                });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordMessage(null);

        // Validate password fields
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Please fill in all password fields' });
            setPasswordLoading(false);
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
            setPasswordLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
            setPasswordLoading(false);
            return;
        }

        try {
            await changePassword(passwordData.currentPassword, passwordData.newPassword);
            setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
            // Clear password fields
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error: any) {
            setPasswordMessage({ type: 'error', text: error.message || 'Failed to change password' });
        } finally {
            setPasswordLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Sidebar / Left Column */}
                    <div className="md:col-span-4 lg:col-span-3 space-y-6">
                        <Card>
                            <CardHeader className="text-center pb-2">
                                <div className="relative mx-auto h-32 w-32 rounded-full overflow-hidden bg-muted border-4 border-background shadow-lg mb-4">
                                    {previewUrl ? (
                                        <Image
                                            src={previewUrl}
                                            alt="Profile preview"
                                            fill
                                            className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                            unoptimized={previewUrl.startsWith('http')}
                                            onClick={() => setSelectedImage(previewUrl)}
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-secondary/10">
                                            <User className="h-16 w-16 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                <CardTitle>{formData.username || "User"}</CardTitle>
                                <CardDescription>{formData.email || "No email"}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col items-center">
                                    <div className="relative">
                                        <Input
                                            id="photo"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handlePhotoChange}
                                        />
                                        <Label htmlFor="photo" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors">
                                            <Camera className="h-4 w-4" />
                                            Change Photo
                                        </Label>
                                    </div>
                                </div>
                                <div className="pt-4 border-t space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center justify-between">
                                        <span>Role</span>
                                        <span className="capitalize font-medium text-foreground">{user?.role || "Buyer"}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Status</span>
                                        <Badge
                                            variant={user.verificationStatus === 'verified' ? 'default' : 'secondary'}
                                            className={
                                                user.verificationStatus === 'verified' ? 'bg-green-500 hover:bg-green-600' :
                                                    user.verificationStatus === 'rejected' ? 'bg-red-500 hover:bg-red-600' :
                                                        user.verificationStatus === 'pending' ? 'bg-amber-500 hover:bg-amber-600' : ''
                                            }
                                        >
                                            {user.verificationStatus === 'verified' ? 'Verified' :
                                                user.verificationStatus === 'rejected' ? 'Rejected' :
                                                    user.verificationStatus === 'pending' ? 'Pending' : 'Unverified'}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Appearance Card (Moved to Sidebar) */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Appearance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        {resolvedTheme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                                        <span className="text-sm font-medium">Dark Mode</span>
                                    </div>
                                    <Switch
                                        checked={mounted && resolvedTheme === "dark"}
                                        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Language Card (New) */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Language</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Select Language</span>
                                        <select 
                                            value={language} 
                                            onChange={(e) => setLanguage(e.target.value)}
                                            className="bg-transparent text-sm border-none focus:ring-0 cursor-pointer text-primary"
                                        >
                                            <option value="English">English</option>
                                            <option value="Nepali">Nepali</option>
                                        </select>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">Select your preferred language for the marketplace interface.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Devices Card (Moved to Sidebar) */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Recent Devices</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {user.devices && user.devices.length > 0 ? (
                                    <div className="space-y-4">
                                        {[...user.devices]
                                            .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime())
                                            .map((device, index) => {
                                                const isMobile = /mobile|android|iphone/i.test(device.userAgent);
                                                const isTablet = /ipad|tablet/i.test(device.userAgent);
                                                
                                                let DeviceIcon = Laptop;
                                                if (isMobile) DeviceIcon = Smartphone;
                                                else if (isTablet) DeviceIcon = Monitor;

                                                const userAgentSummary = device.userAgent.split(' ')[0] || "Browser";
                                                const isCurrentDevice = typeof navigator !== 'undefined' && navigator.userAgent === device.userAgent;

                                                return (
                                                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
                                                        <div className="p-2 bg-primary/10 rounded-full text-primary shrink-0">
                                                            <DeviceIcon className="h-4 w-4" />
                                                        </div>
                                                        <div className="flex-1 space-y-1 overflow-hidden">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <p className="text-sm font-medium leading-none truncate">
                                                                    {userAgentSummary}
                                                                </p>
                                                                {isCurrentDevice && (
                                                                    <Badge variant="outline" className="text-[10px] h-4 bg-green-500/10 text-green-600 border-green-200 dark:border-green-800 dark:text-green-400 px-1 py-0 cursor-default">Current</Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-muted-foreground truncate">
                                                                IP: {device.ipAddress}
                                                            </p>
                                                            <p className="text-[10px] text-muted-foreground">
                                                                {new Date(device.lastActive).toLocaleString(undefined, {
                                                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-muted-foreground">
                                        <Laptop className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                        <p className="text-sm">No recent devices.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content / Right Column */}
                    <div className="md:col-span-8 lg:col-span-9 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Profile Information</CardTitle>
                                <CardDescription>Update your personal details and contact information.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="username">Full Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="username"
                                                    name="username"
                                                    value={formData.username}
                                                    onChange={handleChange}
                                                    className="pl-10"
                                                    placeholder="Your full name"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="pl-10"
                                                        placeholder="your.email@example.com"
                                                    />
                                                </div>
                                                {formData.email && user.verificationStatus !== 'verified' && (
                                                    <Button 
                                                        type="button" 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`)}
                                                        className="shrink-0"
                                                    >
                                                        Verify
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="pl-10"
                                                    placeholder="98XXXXXXXX"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <div className="flex items-center gap-2 mb-4">
                                            <ShieldCheck className="h-5 w-5 text-primary" />
                                            <h3 className="font-semibold">Seller Verification</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="idProofType">Identification Type</Label>
                                                    <select
                                                        id="idProofType"
                                                        name="idProofType"
                                                        value={formData.idProofType}
                                                        onChange={(e) => handleChange(e as any)}
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <option value="">Select ID Type</option>
                                                        <option value="Citizenship">Citizenship</option>
                                                        <option value="PAN">PAN</option>
                                                        <option value="NID">NID</option>
                                                        <option value="Driving License">Driving License</option>
                                                    </select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="idProof">ID Proof Image</Label>
                                                    <Input
                                                        id="idProof"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleIdProofChange}
                                                        className="cursor-pointer"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-center">
                                                {idProofPreviewUrl ? (
                                                    <div className="relative h-48 w-full rounded-md overflow-hidden bg-muted border">
                                                        <Image
                                                            src={idProofPreviewUrl}
                                                            alt="ID Proof preview"
                                                            fill
                                                            className="object-contain cursor-pointer hover:opacity-90 transition-opacity"
                                                            unoptimized={idProofPreviewUrl.startsWith('http')}
                                                            onClick={() => setSelectedImage(idProofPreviewUrl)}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="h-48 w-full rounded-md border border-dashed flex flex-col items-center justify-center text-muted-foreground bg-muted/30">
                                                        <FileText className="h-10 w-10 mb-2 opacity-20" />
                                                        <p className="text-sm">Preview will appear here</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {user.verificationStatus === 'unverified' && !user.idProof && (
                                            <div className="mt-4 flex items-start gap-2 p-3 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800/50 text-xs">
                                                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                <p>To become a seller and start listing items, you must provide a valid identification proof (Citizenship, PAN, or Driving License).</p>
                                            </div>
                                        )}

                                        {user.verificationStatus === 'pending' && (
                                            <div className="mt-4 flex items-center gap-2 p-3 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800/50 text-xs">
                                                <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                                                <p>{user.verificationFeedback || "Your ID is being verified. Please wait..."}</p>
                                            </div>
                                        )}

                                        {user.verificationStatus === 'verified' && (
                                            <div className="mt-4 flex items-center gap-2 p-3 rounded-md bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800/50 text-xs">
                                                <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                                                <p>{user.verificationFeedback || "Your identity is verified. You are now a registered seller!"}</p>
                                            </div>
                                        )}

                                        {user.verificationStatus === 'rejected' && (
                                            <div className="mt-4 flex items-start gap-2 p-3 rounded-md bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800/50 text-xs shadow-sm">
                                                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="font-semibold mb-1">Verification Failed</p>
                                                    <p>{user.verificationFeedback || "We could not verify your ID document. Please upload a clearer image of your official ID."}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {message && (
                                        <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                                            }`}>
                                            {message.text}
                                        </div>
                                    )}

                                    <div className="pt-6 border-t">
                                        <div className="flex flex-col md:flex-row items-end gap-4">
                                            <div className="flex-1 space-y-2 w-full">
                                                <Label htmlFor="address">Address</Label>
                                                <div className="relative group">
                                                    <button
                                                        type="button"
                                                        onClick={handleLocationFetch}
                                                        className="absolute left-3 top-3 text-muted-foreground hover:text-primary transition-colors z-10"
                                                        title="Get current location"
                                                    >
                                                        <MapPin className="h-4 w-4" />
                                                    </button>
                                                    <Textarea
                                                        id="address"
                                                        name="address"
                                                        value={formData.address}
                                                        onChange={handleChange}
                                                        className="pl-10 pr-3 min-h-[40px] h-10 py-2 resize-none"
                                                        placeholder="Your address"
                                                    />
                                                </div>
                                            </div>
                                            <Button type="submit" disabled={loading} className="min-w-[120px] shrink-0">
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    "Save Changes"
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader 
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => setIsSecurityOpen(!isSecurityOpen)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl">Security</CardTitle>
                                        <CardDescription>Manage your password and security questions.</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        {isSecurityOpen ? "Close" : "Open"}
                                    </Button>
                                </div>
                            </CardHeader>
                            {isSecurityOpen && (
                                <CardContent>
                                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="currentPassword">Current Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="currentPassword"
                                                    name="currentPassword"
                                                    type="password"
                                                    value={passwordData.currentPassword}
                                                    onChange={handlePasswordChange}
                                                    className="pl-10"
                                                    placeholder="Enter current password"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="newPassword"
                                                    name="newPassword"
                                                    type="password"
                                                    value={passwordData.newPassword}
                                                    onChange={handlePasswordChange}
                                                    className="pl-10"
                                                    placeholder="Enter new password (min 6 characters)"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    type="password"
                                                    value={passwordData.confirmPassword}
                                                    onChange={handlePasswordChange}
                                                    className="pl-10"
                                                    placeholder="Confirm new password"
                                                />
                                            </div>
                                        </div>
                                    </div>


                                    {passwordMessage && (
                                        <div className={`p-3 rounded-md text-sm ${passwordMessage.type === 'success' ? 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                                            }`}>
                                            {passwordMessage.text}
                                        </div>
                                    )}

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={passwordLoading} variant="outline" className="min-w-[140px]">
                                            {passwordLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Changing...
                                                </>
                                            ) : (
                                                "Change Password"
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                            )}
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Image Preview Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-5xl max-h-[90vh] w-full mx-4 overflow-hidden rounded-lg shadow-2xl scale-in-center">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-4 right-4 z-[110] bg-black/20 hover:bg-black/40 text-white rounded-full transition-all"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(null);
                            }}
                        >
                            <X className="h-6 w-6" />
                        </Button>
                        <div className="relative w-full h-[80vh]">
                            <Image
                                src={selectedImage}
                                alt="Large preview"
                                fill
                                className="object-contain"
                                unoptimized={selectedImage.startsWith('http')}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
