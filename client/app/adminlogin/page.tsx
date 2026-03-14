"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "../lib/admin-actions";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Lock, User, ShieldCheck } from "lucide-react";
import ErrorMessage from "../components/shared/ErrorMessage";

export default function AdminLoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const result = await loginAdmin(formData);

        if (result.success) {
            router.push("/admin");
        } else {
            setError(result.error || "Login failed");
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                    <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl">
                        <ShieldCheck className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mt-4">Admin Access</h1>
                    <p className="text-zinc-400">Secure gateway for Dosro Bazar Backend</p>
                </div>

                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl text-white">Identity Verification</CardTitle>
                        <CardDescription className="text-zinc-500">
                            Enter authorized credentials to proceed
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-zinc-300">Username</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <Input
                                        id="username"
                                        name="username"
                                        placeholder="admin_id"
                                        required
                                        className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-600 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-zinc-300">Secret Key</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-600 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            {error && <ErrorMessage error={error} />}

                            <Button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all duration-200"
                                disabled={loading}
                            >
                                {loading ? "Authenticating..." : "Establish Secure Session"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-zinc-600">
                    Authorized personnel only. All access attempts are monitored and logged.
                    <br />© 2025 Dosro Bazar Admin Network
                </p>
            </div>
        </div>
    );
}
