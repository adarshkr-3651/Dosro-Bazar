"use client";
import React, { JSX, useState } from 'react';
import { forgotPassword, verifyResetOTP, resetPassword } from '../lib/api';
import ErrorMessage from '../components/shared/ErrorMessage';
import Link from 'next/link';
import { Mail, ArrowLeft, ShieldCheck, Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Step = 'REQUEST_OTP' | 'VERIFY_OTP' | 'RESET_PASSWORD' | 'SUCCESS';

export default function ForgotPasswordPage(): JSX.Element {
    const router = useRouter();
    const [step, setStep] = useState<Step>('REQUEST_OTP');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [emailWarning, setEmailWarning] = useState<string | null>(null);

    // Email validation
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            setEmailWarning('Please enter a valid email address');
        } else {
            setEmailWarning(null);
        }
    };

    const handleEmailRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!email) return setError('Please enter your email address');
        if (emailWarning) return;

        setLoading(true);
        try {
            const result = await forgotPassword(email);
            if (result.success) {
                setStep('VERIFY_OTP');
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
        if (!otp || otp.length !== 6) return setError('Please enter the 6-digit OTP');

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
                setTimeout(() => router.push('/login'), 5000);
            } else {
                setError(result.message || 'Failed to reset password');
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'REQUEST_OTP':
                return (
                    <form onSubmit={handleEmailRequest} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F5E6E0] rounded-full mb-4">
                                <Mail className="text-[#5D4037]" size={32} />
                            </div>
                            <h1 className="text-2xl font-bold text-[#2B211E] mb-2">Forgot Password?</h1>
                            <p className="text-gray-600 text-sm italic font-serif">
                                Step 1: Tell us your email to receive a recovery code.
                            </p>
                        </div>
                        <div className="flex flex-col mb-6">
                            <label className="text-[#5D4037] font-semibold mb-2" htmlFor="email">Email Address</label>
                            <div className={`flex items-center border rounded-lg h-12 px-3 transition bg-white ${emailWarning ? 'border-red-400' : 'border-[#D7CCC8] focus-within:border-[#5D4037]'}`}>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value); }}
                                    placeholder="yourname@example.com"
                                    className="w-full border-none outline-none bg-transparent text-gray-700 placeholder-stone-300"
                                />
                            </div>
                            {emailWarning && <div className="mt-2"><ErrorMessage variant="warning" message={emailWarning} /></div>}
                        </div>
                        {error && <div className="mb-4"><ErrorMessage error={error} /></div>}
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-[#5D4037] text-stone-50 py-3 rounded-lg font-medium hover:bg-[#4E342E] transition shadow-md disabled:opacity-50"
                        >
                            {loading ? 'Sending Code...' : 'Send OTP Code'}
                        </button>
                    </form>
                );

            case 'VERIFY_OTP':
                return (
                    <form onSubmit={handleVerifyOTP} className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F5E6E0] rounded-full mb-4">
                                <ShieldCheck className="text-[#5D4037]" size={32} />
                            </div>
                            <h1 className="text-2xl font-bold text-[#2B211E] mb-2">Verify Identity</h1>
                            <p className="text-gray-600 text-sm">
                                Step 2: Enter the 6-digit code sent to <span className="font-semibold text-[#5D4037]">{email}</span>
                            </p>
                        </div>
                        <div className="flex flex-col mb-6">
                            <label className="text-[#5D4037] font-semibold mb-2 text-center" htmlFor="otp">6-Digit Code</label>
                            <input
                                id="otp"
                                type="text"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                placeholder="000000"
                                className="w-full border border-[#D7CCC8] rounded-lg h-14 px-3 text-center text-2xl font-bold tracking-[0.5em] focus:border-[#5D4037] outline-none text-[#5D4037] placeholder-stone-200 shadow-inner"
                                autoFocus
                            />
                        </div>
                        {error && <div className="mb-4"><ErrorMessage error={error} /></div>}
                        <button
                            disabled={loading || otp.length !== 6}
                            type="submit"
                            className="w-full bg-[#5D4037] text-stone-50 py-3 rounded-lg font-medium hover:bg-[#4E342E] transition shadow-md disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify Code'}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setStep('REQUEST_OTP')}
                            className="w-full mt-4 text-[#5D4037] text-sm font-medium hover:underline"
                        >
                            Resend Code / Change Email
                        </button>
                    </form>
                );

            case 'RESET_PASSWORD':
                return (
                    <form onSubmit={handleResetPassword} className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F5E6E0] rounded-full mb-4">
                                <Lock className="text-[#5D4037]" size={32} />
                            </div>
                            <h1 className="text-2xl font-bold text-[#2B211E] mb-2">New Password</h1>
                            <p className="text-gray-600 text-sm">
                                Step 3: Create a strong password to protect your account.
                            </p>
                        </div>
                        
                        <div className="flex flex-col mb-4">
                            <label className="text-[#5D4037] font-semibold mb-2" htmlFor="newPassword">New Password</label>
                            <div className="flex items-center border border-[#D7CCC8] rounded-lg h-12 px-3 focus-within:border-[#5D4037] bg-white transition">
                                <input
                                    id="newPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Min 6 characters"
                                    className="w-full border-none outline-none bg-transparent"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#D7CCC8] hover:text-[#5D4037]">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col mb-6">
                            <label className="text-[#5D4037] font-semibold mb-2" htmlFor="confirmPassword">Confirm Password</label>
                            <div className="flex items-center border border-[#D7CCC8] rounded-lg h-12 px-3 focus-within:border-[#5D4037] bg-white transition">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repeat new password"
                                    className="w-full border-none outline-none bg-transparent"
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-[#D7CCC8] hover:text-[#5D4037]">
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && <div className="mb-4"><ErrorMessage error={error} /></div>}
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-[#5D4037] text-stone-50 py-3 rounded-lg font-medium hover:bg-[#4E342E] transition shadow-md disabled:opacity-50"
                        >
                            {loading ? 'Resetting...' : 'Update Password'}
                        </button>
                    </form>
                );

            case 'SUCCESS':
                return (
                    <div className="text-center py-6 animate-in zoom-in duration-500">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6">
                            <CheckCircle className="text-green-600" size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-[#2B211E] mb-4">Password Restored!</h2>
                        <p className="text-gray-600 mb-8 max-w-xs mx-auto">
                            Your account is secure again. You'll be whisked away to the login page in a few moments.
                        </p>
                        <Link
                            href="/login"
                            className="block w-full bg-[#2B211E] text-stone-50 py-3 rounded-lg font-medium hover:bg-black transition text-center shadow-lg"
                        >
                            Login Now
                        </Link>
                    </div>
                );
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#FDF9F7]">
            {/* Elegant Background Blobs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#F5E6E0] rounded-full filter blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2 overflow-hidden"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D7CCC8] rounded-full filter blur-3xl opacity-20 translate-x-1/4 translate-y-1/4 overflow-hidden"></div>

            <div className="w-full max-w-md relative px-4">
                {/* Back to Login */}
                {step !== 'SUCCESS' && (
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-[#5D4037] hover:text-[#2B211E] mb-6 transition font-medium text-sm group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Login</span>
                    </Link>
                )}

                <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_10px_40px_-15px_rgba(43,33,30,0.15)] border border-[#EFEBE9]">
                    {renderStep()}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[#8D6E63] text-xs uppercase tracking-widest font-semibold">
                        &copy; {new Date().getFullYear()} Dosro Bazar Marketplace
                    </p>
                </div>
            </div>
        </div>
    );
}
