"use client";
import React, { JSX, useState } from 'react';
import { forgotPassword } from '../lib/api';
import ErrorMessage from '../components/shared/ErrorMessage';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage(): JSX.Element {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
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

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        validateEmail(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validation
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        if (emailWarning) {
            setError('Please fix the errors before submitting');
            return;
        }

        setLoading(true);
        try {
            const result = await forgotPassword(email);
            if (result.success) {
                setSuccess(true);
                setEmail(''); // Clear email field
            } else {
                setError(result.message || 'Failed to send reset email');
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-full max-w-md">
                {/* Back to Login Link */}
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
                >
                    <ArrowLeft size={18} />
                    <span>Back to Login</span>
                </Link>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-2xl shadow-lg font-[system-ui]"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <Mail className="text-blue-600" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
                        <p className="text-gray-600 text-sm">
                            No worries! Enter your email and we'll send you reset instructions.
                        </p>
                    </div>

                    {!success ? (
                        <>
                            {/* Email Field */}
                            <div className="flex flex-col mb-6">
                                <label className="text-gray-800 font-semibold mb-2" htmlFor="email">
                                    Email Address
                                </label>
                                <div className={`flex items-center border rounded-lg h-12 px-3 transition ${emailWarning
                                        ? 'border-amber-400 focus-within:border-amber-500'
                                        : 'border-gray-200 focus-within:border-blue-500'
                                    }`}>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        onBlur={() => validateEmail(email)}
                                        placeholder="Enter your email"
                                        className="w-full border-none outline-none bg-transparent text-gray-700 placeholder-gray-400"
                                    />
                                </div>
                                {emailWarning && (
                                    <div className="mt-2">
                                        <ErrorMessage variant="warning" message={emailWarning} />
                                    </div>
                                )}
                            </div>

                            {error && <ErrorMessage error={error} />}

                            {/* Submit Button */}
                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </>
                    ) : (
                        /* Success Message */
                        <div className="text-center py-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <svg
                                    className="w-8 h-8 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Check Your Email!</h2>
                            <p className="text-gray-600 mb-6">
                                We've sent password reset instructions to your email address.
                                Please check your inbox and follow the link to reset your password.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-blue-800">
                                    <strong>Didn't receive the email?</strong><br />
                                    Check your spam folder or try again in a few minutes.
                                </p>
                            </div>
                            <Link
                                href="/login"
                                className="inline-block w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition text-center"
                            >
                                Return to Login
                            </Link>
                        </div>
                    )}

                    {/* Additional Help */}
                    {!success && (
                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm">
                                Remember your password?{' '}
                                <Link href="/login" className="text-blue-600 font-medium hover:underline">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
