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
import { User, Mail, Camera, Loader2, Moon, Sun, Phone, MapPin, Lock } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Switch } from "@/app/components/ui/switch";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { FileText, ShieldCheck, AlertCircle } from "lucide-react";

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
    const { user, checkAuthStatus } = useAuth();
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
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhoto(file);
            setPreviewUrl(URL.createObjectURL(file));
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

            await updateProfile(data);
            await checkAuthStatus(); // Refresh user data
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
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
                                            className="object-cover"
                                            unoptimized={previewUrl.startsWith('http')}
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
                                        {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                                        <span className="text-sm font-medium">Dark Mode</span>
                                    </div>
                                    <Switch
                                        checked={mounted && theme === "dark"}
                                        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                                    />
                                </div>
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
                                            <div className="relative">
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
                                                    placeholder="+1234567890"
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
                                                <div className="flex flex-col gap-2">
                                                    <Input
                                                        id="idProof"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleIdProofChange}
                                                        className="cursor-pointer"
                                                    />
                                                    {idProofPreviewUrl && (
                                                        <div className="relative mt-2 h-40 w-full rounded-md overflow-hidden bg-muted border">
                                                            <Image
                                                                src={idProofPreviewUrl}
                                                                alt="ID Proof preview"
                                                                fill
                                                                className="object-contain"
                                                                unoptimized={idProofPreviewUrl.startsWith('http')}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {user.verificationStatus === 'unverified' && !user.idProof && (
                                            <div className="mt-4 flex items-start gap-2 p-3 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800/50 text-xs">
                                                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                <p>To become a seller and start listing items, you must provide a valid identification proof (Citizenship, PAN, or Driving License).</p>
                                            </div>
                                        )}

                                        {user.verificationStatus === 'pending' && (
                                            <div className="mt-4 flex items-center gap-2 p-3 rounded-md bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800/50 text-xs">
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

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Textarea
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="pl-10 min-h-[100px]"
                                                placeholder="Your address"
                                            />
                                        </div>
                                    </div>

                                    {message && (
                                        <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                                            }`}>
                                            {message.text}
                                        </div>
                                    )}

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={loading} className="min-w-[120px]">
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
                                </form>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Security</CardTitle>
                                <CardDescription>Manage your password and security questions.</CardDescription>
                            </CardHeader>
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
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
