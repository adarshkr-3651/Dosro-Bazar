"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin, isAdminAuthenticated } from "../lib/admin-actions";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Lock, User, ShieldCheck, Github, Globe } from "lucide-react";
import ErrorMessage from "../components/shared/ErrorMessage";

export default function AdminLoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const authenticated = await isAdminAuthenticated();
            if (authenticated) {
                router.push("/admin/dashboard");
            }
        };
        checkAuth();
    }, [router]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const result = await loginAdmin(formData);

        if (result.success) {
            router.push("/admin/dashboard");
        } else {
            setError(result.error || "Login failed");
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6 selection:bg-emerald-500/30 overflow-hidden relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="w-full max-w-md space-y-10 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative p-5 bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl">
                            <ShieldCheck className="w-12 h-12 text-emerald-500 transition-transform group-hover:scale-110 duration-500" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tighter text-white mt-4">
                            DOSRO <span className="text-emerald-500">BAZAR</span>
                        </h1>
                        <p className="text-zinc-500 font-medium uppercase tracking-[0.2em] text-[10px]">Administrative Access Node</p>
                    </div>
                </div>

                <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border-t-zinc-700/50">
                    <CardHeader className="space-y-2 pb-8">
                        <CardTitle className="text-xl text-white font-bold">Secure Authentication</CardTitle>
                        <CardDescription className="text-zinc-500 text-sm leading-relaxed">
                            Personnel only. Please establish a secure session using authorized credentials.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2.5">
                                <Label htmlFor="username" className="text-zinc-400 text-xs font-bold uppercase tracking-wider ml-1">Identity Identifier</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="w-4 h-4 text-zinc-600 transition-colors group-focus-within:text-emerald-500" />
                                    </div>
                                    <Input
                                        id="username"
                                        name="username"
                                        placeholder="Enter your UID"
                                        required
                                        className="pl-12 py-6 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-700 focus:ring-0 focus:border-emerald-500/50 rounded-2xl transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="password" className="text-zinc-400 text-xs font-bold uppercase tracking-wider ml-1">Cryptographic Key</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-4 h-4 text-zinc-600 transition-colors group-focus-within:text-emerald-500" />
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="pl-12 py-6 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-700 focus:ring-0 focus:border-emerald-500/50 rounded-2xl transition-all"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="animate-in slide-in-from-top-2 duration-300">
                                    <ErrorMessage error={error} />
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full py-7 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest transition-all duration-300 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-3">
                                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        DECRYPTING...
                                    </span>
                                ) : "Establish Connection"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-4 text-zinc-700">
                        <div className="h-px w-8 bg-zinc-900" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Network Integrity Active</span>
                        <div className="h-px w-8 bg-zinc-900" />
                    </div>
                    
                    <p className="text-center text-[10px] text-zinc-600 font-medium leading-relaxed max-w-[280px]">
                        Authorized access only. Session activity is monitored, logged, and audited in compliance with internal security directives.
                    </p>
                    
                    <div className="flex items-center gap-6 text-zinc-500">
                        <Globe className="w-4 h-4 hover:text-emerald-500 transition-colors cursor-pointer" />
                        <Github className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
                    </div>
                </div>
            </div>
        </div>
    );
}
