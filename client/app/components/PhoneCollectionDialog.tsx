"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Phone, Loader2, AlertCircle } from "lucide-react";

interface PhoneCollectionDialogProps {
    onSubmit: (phone: string) => Promise<void>;
    userData: {
        username: string;
        email: string;
        photo?: string;
    };
}

export default function PhoneCollectionDialog({ onSubmit, userData }: PhoneCollectionDialogProps) {
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const validatePhone = (value: string) => {
        // Must be exactly 10 digits
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value)) {
            return "Phone number must be exactly 10 digits";
        }
        return "";
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
        if (value.length <= 10) {
            setPhone(value);
            if (value.length > 0) {
                setError(validatePhone(value));
            } else {
                setError("");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validatePhone(phone);
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError("");

        try {
            await onSubmit(phone);
        } catch (err: any) {
            setError(err.message || "Failed to complete registration");
            setLoading(false);
        }
    };

    const isValid = phone.length === 10 && !error;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Complete Your Registration</CardTitle>
                    <CardDescription>
                        Welcome, {userData.username}! Please provide your phone number to complete your account setup.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    className="pl-10"
                                    placeholder="1234567890"
                                    maxLength={10}
                                    autoFocus
                                    disabled={loading}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Enter 10-digit phone number (without country code)
                            </p>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-md text-sm bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={!isValid || loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Completing Registration...
                                </>
                            ) : (
                                "Complete Registration"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
