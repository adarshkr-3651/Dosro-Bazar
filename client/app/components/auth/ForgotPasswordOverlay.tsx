"use client";

import React, { useState } from 'react';
import { forgotPassword, verifyResetOTP, resetPassword } from "@/app/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Mail, ShieldCheck, Lock, CheckCircle, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import ErrorMessage from '../shared/ErrorMessage';
import { toast } from "sonner";

type Step = 'REQUEST_OTP' | 'VERIFY_OTP' | 'RESET_PASSWORD' | 'SUCCESS';

interface ForgotPasswordOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ForgotPasswordOverlay({ isOpen, onClose }: ForgotPasswordOverlayProps) {
    const [step, setStep] = useState<Step>('REQUEST_OTP');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEmailRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!email) return setError('Please enter your email address');

        setLoading(true);
        try {
            const result = await forgotPassword(email);
            if (result.success) {
                setStep('VERIFY_OTP');
                toast.success("Reset code sent!");
            } else {
                setError(result.message || 'Failed to send reset email');
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!otp || otp.length !== 6) return setError('Please enter the 6-digit code');

        setLoading(true);
        try {
            const result = await verifyResetOTP(email, otp);
            if (result.success) {
                setStep('RESET_PASSWORD');
            } else {
                setError(result.message || 'Verification failed');
            }
        } catch (err: any) {
            setError(err?.message || 'Verification failed. The code may be incorrect or expired.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!newPassword || !confirmPassword) return setError('Please fill in all fields');
        if (newPassword !== confirmPassword) return setError('Passwords do not match');
        if (newPassword.length < 6) return setError('Password must be at least 6 characters');

        setLoading(true);
        try {
            const result = await resetPassword(email, otp, newPassword);
            if (result.success) {
                setStep('SUCCESS');
                toast.success("Password reset successfully!");
            } else {
                setError(result.message || 'Failed to reset password');
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetAndClose = () => {
        setStep('REQUEST_OTP');
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setError(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={resetAndClose}>
            <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden bg-card border-none shadow-2xl">
                {/* Header Section */}
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8">
                    <div className="mx-auto w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                        {step === 'REQUEST_OTP' && <Mail className="h-8 w-8 text-primary" />}
                        {step === 'VERIFY_OTP' && <ShieldCheck className="h-8 w-8 text-primary" />}
                        {step === 'RESET_PASSWORD' && <Lock className="h-8 w-8 text-primary" />}
                        {step === 'SUCCESS' && <CheckCircle className="h-8 w-8 text-green-600" />}
                    </div>
                    
                    <DialogHeader className="text-center p-0">
                        <DialogTitle className="text-2xl font-black tracking-tight">
                            {step === 'REQUEST_OTP' && "Forgot Password?"}
                            {step === 'VERIFY_OTP' && "Verify Identity"}
                            {step === 'RESET_PASSWORD' && "New Password"}
                            {step === 'SUCCESS' && "All Set!"}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground mt-2">
                            {step === 'REQUEST_OTP' && "Enter your email to receive a recovery code."}
                            {step === 'VERIFY_OTP' && `We've sent a 6-digit code to ${email}`}
                            {step === 'RESET_PASSWORD' && "Create a strong password to protect your account."}
                            {step === 'SUCCESS' && "Your password has been restored successfully."}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Form Section */}
                <div className="p-8 pt-4">
                    {step === 'REQUEST_OTP' && (
                        <form onSubmit={handleEmailRequest} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    placeholder="yourname@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-xl"
                                    required
                                />
                            </div>
                            {error && <ErrorMessage error={error} />}
                            <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Code"}
                            </Button>
                        </form>
                    )}

                    {step === 'VERIFY_OTP' && (
                        <form onSubmit={handleVerifyOTP} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    maxLength={6}
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    className="h-14 text-center text-2xl font-black tracking-[8px] bg-muted/50 border-none rounded-xl"
                                    required
                                />
                            </div>
                            {error && <ErrorMessage error={error} />}
                            <div className="flex flex-col gap-2">
                                <Button type="submit" disabled={loading || otp.length !== 6} className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Continue"}
                                </Button>
                                <Button type="button" variant="ghost" onClick={() => setStep('REQUEST_OTP')} className="text-xs text-muted-foreground">
                                    <ArrowLeft className="h-3 w-3 mr-1" /> Back / Change Email
                                </Button>
                            </div>
                        </form>
                    )}

                    {step === 'RESET_PASSWORD' && (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="space-y-4">
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="h-12 pr-10 bg-muted/50 border-none rounded-xl"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm New Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="h-12 pr-10 bg-muted/50 border-none rounded-xl"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            {error && <ErrorMessage error={error} />}
                            <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Password"}
                            </Button>
                        </form>
                    )}

                    {step === 'SUCCESS' && (
                        <div className="space-y-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Your account is secure again. You can now close this and log in.
                            </p>
                            <Button onClick={resetAndClose} className="w-full h-12 rounded-xl font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200/50">
                                Back to Login
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
