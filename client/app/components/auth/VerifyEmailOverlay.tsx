"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { useAuth } from "../../context/AuthContext";
import { resendVerificationCode } from "@/app/lib/api";
import { Loader2, Mail, ShieldCheck, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { toast } from "sonner";

interface VerifyEmailOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
    onSuccess?: () => void;
}

export default function VerifyEmailOverlay({ isOpen, onClose, email, onSuccess }: VerifyEmailOverlayProps) {
    const { verify } = useAuth();
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length !== 6) {
            toast.error("Please enter a 6-digit code");
            return;
        }

        setLoading(true);
        try {
            const result = await verify(email, code);
            if (result.success) {
                toast.success("Email verified successfully!");
                onSuccess?.();
                onClose();
            } else {
                toast.error(result.error || "Verification failed");
            }
        } catch (err: any) {
            toast.error(err.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        
        setResending(true);
        try {
            const response = await resendVerificationCode(email);
            if (response.success) {
                toast.success("New code sent to your email");
                setTimer(60); // 60 seconds cooldown
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to resend code");
        } finally {
            setResending(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden bg-card border-none shadow-2xl">
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8">
                    <div className="mx-auto w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                        <Mail className="h-8 w-8 text-primary" />
                    </div>
                    
                    <DialogHeader className="text-center p-0">
                        <DialogTitle className="text-2xl font-black tracking-tight">Verify Your Email</DialogTitle>
                        <DialogDescription className="text-muted-foreground mt-2">
                            We've sent a 6-digit verification code to <br />
                            <span className="font-bold text-foreground">{email}</span>
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8 pt-4">
                    <form onSubmit={handleVerify} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <Input
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="h-16 text-center text-3xl font-black tracking-[12px] bg-muted/50 border-2 focus:border-primary transition-all rounded-xl"
                                    placeholder="000000"
                                    autoFocus
                                />
                            </div>
                            
                            <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
                                <AlertCircle className="h-3 w-3" />
                                Check your spam folder if you don't see the email
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Button 
                                type="submit" 
                                disabled={loading || code.length !== 6} 
                                className="w-full h-12 rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify & Continue"
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                disabled={resending || timer > 0}
                                onClick={handleResend}
                                className="w-full h-10 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                            >
                                {resending ? (
                                    <Loader2 className="h-3 w-3 animate-spin mr-2" />
                                ) : (
                                    <RefreshCw className={`h-3 w-3 mr-2 ${timer > 0 ? '' : 'animate-pulse'}`} />
                                )}
                                {timer > 0 ? `Resend code in ${timer}s` : "Didn't receive a code? Resend"}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
