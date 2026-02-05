'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { validateVerificationCode } from '../lib/validators';
import ErrorMessage from '../components/shared/ErrorMessage';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import Link from 'next/link';

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailFromUrl = searchParams.get('email');
    const { verify, resendCode } = useAuth();

    const [email, setEmail] = useState(emailFromUrl || '');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!email || !code) {
            setError('Please provide both email and verification code');
            return;
        }

        if (!validateVerificationCode(code)) {
            setError('Verification code must be 6 digits and contain only numbers');
            return;
        }

        setLoading(true);
        try {
            const result = await verify(email, code);
            if (result.success) {
                setSuccessMessage('Email verified successfully! Redirecting...');
                setTimeout(() => {
                    router.push('/');
                }, 1500);
            } else {
                setError(result.error || 'Verification failed');
            }
        } catch (err: any) {
            setError(err?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            setError('Please enter your email to resend code');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const result = await resendCode(email);
            if (result.success) {
                setSuccessMessage('A new verification code has been sent to your email.');
            } else {
                setError(result.error || 'Failed to resend code');
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to resend code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Verify Email</CardTitle>
                <CardDescription className="text-center">
                    Enter the 6-digit code sent to your email
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Email Address
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="code" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Verification Code
                        </label>
                        <Input
                            id="code"
                            type="text"
                            placeholder="123456"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                            className="text-center text-2xl tracking-widest"
                            maxLength={6}
                            required
                        />
                    </div>

                    {successMessage && <ErrorMessage variant="success" message={successMessage} />}
                    {error && <ErrorMessage error={error} />}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </Button>

                    <div className="text-center text-sm">
                        <p className="text-muted-foreground mb-2">
                            Didn't receive the code?
                        </p>
                        <Button
                            type="button"
                            variant="link"
                            className="p-0 h-auto font-normal"
                            onClick={handleResend}
                            disabled={loading}
                        >
                            Resend Verification Code
                        </Button>
                    </div>

                    <div className="text-center text-sm mt-4">
                        <Link href="/login" className="text-primary hover:underline">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/20 to-background">
            <Suspense fallback={<div>Loading...</div>}>
                <VerifyEmailContent />
            </Suspense>
        </div>
    );
}
