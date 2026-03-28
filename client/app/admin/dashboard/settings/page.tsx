"use client";

import { useState } from "react";
import { Settings, ShieldCheck, Bell, Globe, Database, Lock, Save, CheckCircle2, AlertCircle, ChevronRight, Loader2, Eye, EyeOff } from "lucide-react";
import { createAdmin } from "@/app/lib/admin-actions";

const SECTIONS = ["General", "Security", "New Admin", "System"] as const;
type Section = typeof SECTIONS[number];

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState<Section>("General");
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [adminLoading, setAdminLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleCreateAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAdminLoading(true);
        const fd = new FormData(e.currentTarget);
        const payload = {
            username: fd.get("username") as string,
            password: fd.get("password") as string,
            role: fd.get("role") as string,
            secretKey: fd.get("secretKey") as string,
        };
        const res = await createAdmin(payload);
        setAdminLoading(false);
        if (res.success) {
            showToast("New admin account created successfully", "success");
            (e.target as HTMLFormElement).reset();
        } else {
            showToast(res.error || "Failed to create admin", "error");
        }
    };

    const sectionIcons: Record<Section, React.ElementType> = {
        General: Globe,
        Security: Lock,
        "New Admin": ShieldCheck,
        System: Database,
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-top-10 ${toast.type === "success" ? "bg-emerald-500" : "bg-rose-500"} text-white`}>
                    {toast.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-bold text-sm uppercase tracking-widest">{toast.message}</span>
                </div>
            )}

            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                    <Settings className="w-10 h-10 text-emerald-500" /> Settings
                </h1>
                <p className="text-zinc-500">Manage system preferences and administrative configuration.</p>
            </div>

            <div className="grid md:grid-cols-[240px_1fr] gap-8">
                {/* Sidebar nav */}
                <div className="space-y-1">
                    {SECTIONS.map(section => {
                        const Icon = sectionIcons[section];
                        return (
                            <button
                                key={section}
                                onClick={() => setActiveSection(section)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm font-bold ${
                                    activeSection === section
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                                        : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {section}
                                <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${activeSection === section ? "opacity-100" : "opacity-0"}`} />
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 space-y-8">
                    {/* General */}
                    {activeSection === "General" && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-white font-bold text-xl">General Settings</h2>
                                <p className="text-zinc-500 text-sm mt-1">Platform-wide display and behaviour preferences.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Platform Name</label>
                                    <input defaultValue="Dosro Bazar" className="w-full h-12 px-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Support Email</label>
                                    <input defaultValue="support@dosrobazar.com" className="w-full h-12 px-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Default Language</label>
                                    <select className="w-full h-12 px-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500/50 appearance-none">
                                        <option>English (Nepal)</option>
                                        <option>Nepali</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-zinc-950/60 border border-zinc-900 rounded-2xl">
                                    <div>
                                        <p className="text-white font-bold text-sm">Maintenance Mode</p>
                                        <p className="text-zinc-500 text-xs mt-0.5">Temporarily disable access for regular users while you work.</p>
                                    </div>
                                    <div className="relative">
                                        <input type="checkbox" id="maintenance" className="sr-only peer" />
                                        <div className="w-12 h-6 bg-zinc-800 rounded-full peer-checked:bg-emerald-600 transition-all cursor-pointer" />
                                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all peer-checked:translate-x-6 shadow cursor-pointer" />
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest transition-all">
                                    <Save className="w-4 h-4" /> Save Preferences
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Security */}
                    {activeSection === "Security" && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-white font-bold text-xl">Security Configuration</h2>
                                <p className="text-zinc-500 text-sm mt-1">Authentication and access control settings.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-zinc-950/60 border border-zinc-900 rounded-2xl">
                                    <div>
                                        <p className="text-white font-bold text-sm">Require ID Verification for Sellers</p>
                                        <p className="text-zinc-500 text-xs mt-0.5">Users must submit an ID proof before listing items.</p>
                                    </div>
                                    <div className="px-3 py-1 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase rounded-lg tracking-widest">Enabled</div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-zinc-950/60 border border-zinc-900 rounded-2xl">
                                    <div>
                                        <p className="text-white font-bold text-sm">Email Verification on Signup</p>
                                        <p className="text-zinc-500 text-xs mt-0.5">New users must verify their email before accessing their profile.</p>
                                    </div>
                                    <div className="px-3 py-1 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase rounded-lg tracking-widest">Enabled</div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-zinc-950/60 border border-zinc-900 rounded-2xl">
                                    <div>
                                        <p className="text-white font-bold text-sm">RS256 JWT Rotation</p>
                                        <p className="text-zinc-500 text-xs mt-0.5">All authentication tokens use RS256 asymmetric signing.</p>
                                    </div>
                                    <div className="px-3 py-1 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase rounded-lg tracking-widest">Active</div>
                                </div>
                                <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                                    <p className="text-amber-400 text-xs font-bold uppercase tracking-widest">Note</p>
                                    <p className="text-zinc-400 text-sm mt-1">Security policies are enforced at the server level via your <code className="text-emerald-400">.env</code> configuration. Contact your backend administrator to modify core security settings.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* New Admin */}
                    {activeSection === "New Admin" && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-white font-bold text-xl">Create Administrator</h2>
                                <p className="text-zinc-500 text-sm mt-1">Provision a new admin account. Requires the platform secret key.</p>
                            </div>
                            <form onSubmit={handleCreateAdmin} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Admin Username</label>
                                    <input name="username" required placeholder="e.g. superadmin" className="w-full h-12 px-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Role</label>
                                    <select name="role" className="w-full h-12 px-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500/50 appearance-none">
                                        <option value="admin">Admin</option>
                                        <option value="moderator">Moderator</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Password</label>
                                    <div className="relative">
                                        <input name="password" type={showPass ? "text" : "password"} required placeholder="Strong password" className="w-full h-12 px-4 pr-12 bg-zinc-950 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-all" />
                                        <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
                                            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Platform Secret Key</label>
                                    <input name="secretKey" type="password" required placeholder="Superadmin password" className="w-full h-12 px-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-all" />
                                </div>
                                <button type="submit" disabled={adminLoading} className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all flex items-center justify-center gap-2">
                                    {adminLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><ShieldCheck className="w-4 h-4" /> Create Admin Account</>}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* System */}
                    {activeSection === "System" && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-white font-bold text-xl">System Information</h2>
                                <p className="text-zinc-500 text-sm mt-1">Backend infrastructure and environment details.</p>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { label: "Framework", value: "Next.js 15 (App Router)" },
                                    { label: "Backend", value: "Node.js + Express" },
                                    { label: "Database", value: "MongoDB (Mongoose)" },
                                    { label: "File Storage", value: "Cloudinary CDN" },
                                    { label: "Auth", value: "RS256 JWT (Access + Refresh Tokens)" },
                                    { label: "Email", value: "Nodemailer SMTP" },
                                    { label: "AI", value: "Google Gemini API" },
                                    { label: "Environment", value: process.env.NODE_ENV || "development" },
                                ].map(row => (
                                    <div key={row.label} className="flex items-center justify-between px-5 py-3.5 bg-zinc-950/50 border border-zinc-900 rounded-2xl">
                                        <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest text-[10px]">{row.label}</span>
                                        <span className="text-zinc-300 text-sm font-bold">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="p-5 bg-zinc-950/50 border border-zinc-900 rounded-2xl text-xs text-zinc-600 text-center font-bold tracking-widest uppercase">
                                Dosro Bazar Admin Panel · Built for Production
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
