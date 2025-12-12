"use client";
import React, { JSX, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '../lib/api';
import ErrorMessage from '../components/shared/ErrorMessage';
import Link from 'next/link';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage(): JSX.Element {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [passwordWarning, setPasswordWarning] = useState<string | null>(null);

    useEffect(() => {
        const resetToken = searchParams.get('resetPasswordToken');
        if (!resetToken) {
            setError('Invalid or missing reset token. Please request a new password reset link.');
        } else {
            setToken(resetToken);
        }
    }, [searchParams]);

    // Password validation
    const validatePassword = (password: string) => {
        if (password && password.length < 6) {
            setPasswordWarning('Password must be at least 6 characters long');
        } else {
            setPasswordWarning(null);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewPassword(value);
        validatePassword(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!newPassword || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (passwordWarning) {
            setError('Please fix the errors before submitting');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!token) {
            setError('Invalid reset token. Please request a new password reset link.');
            return;
        }

        setLoading(true);
        try {
            const result = await resetPassword(token, newPassword);
            if (result.success) {
                setSuccess(true);
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                setError(result.message || 'Failed to reset password');
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    // Password strength indicator
    const getPasswordStrength = (password: string) => {
        if (!password) return { strength: 0, label: '', color: '' };
        if (password.length < 6) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
        if (password.length < 10) return { strength: 2, label: 'Fair', color: 'bg-yellow-500' };
        if (password.length < 14) return { strength: 3, label: 'Good', color: 'bg-blue-500' };
        return { strength: 4, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(newPassword);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
            <div className="w-full max-w-md">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-2xl shadow-lg font-[system-ui]"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                            <Lock className="text-purple-600" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
                        <p className="text-gray-600 text-sm">
                            Enter your new password below
                        </p>
                    </div>

                    {!success ? (
                        <>
                            {/* New Password Field */}
                            <div className="flex flex-col mb-4">
                                <label className="text-gray-800 font-semibold mb-2" htmlFor="newPassword">
                                    New Password
                                </label>
                                <div className={`flex items-center border rounded-lg h-12 px-3 transition ${passwordWarning
                                        ? 'border-amber-400 focus-within:border-amber-500'
                                        : 'border-gray-200 focus-within:border-purple-500'
                                    }`}>
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        value={newPassword}
                                        onChange={handlePasswordChange}
                                        onBlur={() => validatePassword(newPassword)}
                                        placeholder="Enter new password"
                                        className="w-full border-none outline-none bg-transparent text-gray-700 placeholder-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                {/* Password Strength Indicator */}
                                {newPassword && (
                                    <div className="mt-2">
                                        <div className="flex gap-1 mb-1">
                                            {[1, 2, 3, 4].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded ${level <= passwordStrength.strength
                                                            ? passwordStrength.color
                                                            : 'bg-gray-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-600">
                                            Password strength: <span className="font-semibold">{passwordStrength.label}</span>
                                        </p>
                                    </div>
                                )}

                                {passwordWarning && (
                                    <div className="mt-2">
                                        <ErrorMessage variant="warning" message={passwordWarning} />
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="flex flex-col mb-6">
                                <label className="text-gray-800 font-semibold mb-2" htmlFor="confirmPassword">
                                    Confirm Password
                                </label>
                                <div className="flex items-center border border-gray-200 rounded-lg h-12 px-3 focus-within:border-purple-500 transition">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        className="w-full border-none outline-none bg-transparent text-gray-700 placeholder-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {confirmPassword && newPassword !== confirmPassword && (
                                    <div className="mt-2">
                                        <ErrorMessage variant="warning" message="Passwords do not match" />
                                    </div>
                                )}
                            </div>

                            {error && <ErrorMessage error={error} />}

                            {/* Submit Button */}
                            <button
                                disabled={loading || !token}
                                type="submit"
                                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Resetting Password...' : 'Reset Password'}
                            </button>
                        </>
                    ) : (
                        /* Success Message */
                        <div className="text-center py-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <CheckCircle className="text-green-600" size={40} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
                            <p className="text-gray-600 mb-6">
                                Your password has been successfully reset. You can now log in with your new password.
                            </p>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-green-800">
                                    Redirecting to login page in 3 seconds...
                                </p>
                            </div>
                            <Link
                                href="/login"
                                className="inline-block w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition text-center"
                            >
                                Go to Login Now
                            </Link>
                        </div>
                    )}

                    {/* Additional Help */}
                    {!success && (
                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm">
                                Remember your password?{' '}
                                <Link href="/login" className="text-purple-600 font-medium hover:underline">
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
