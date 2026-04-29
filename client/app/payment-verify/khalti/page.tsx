"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, ShieldCheck, XCircle } from "lucide-react";
import { verifyKhaltiPaymentAction } from "@/app/lib/ad-actions";
import { toast } from "sonner";

function KhaltiVerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");

    useEffect(() => {
        const verify = async () => {
            const pidx = searchParams.get("pidx");
            const amountStr = searchParams.get("amount");
            const purchase_order_id = searchParams.get("purchase_order_id");

            if (!pidx || !amountStr || !purchase_order_id) {
                setStatus("failed");
                toast.error("Invalid payment parameters.");
                setTimeout(() => router.push("/?payment_failed=true"), 2000);
                return;
            }

            try {
                const res = await verifyKhaltiPaymentAction(pidx, parseInt(amountStr), purchase_order_id);
                if (res.success) {
                    setStatus("success");
                    toast.success(res.message || "Payment Successful!");
                    setTimeout(() => router.push(`/?payment_success=true&type=ad&item=${purchase_order_id}&amount=${amountStr}&flagged=${res.flagged || false}`), 2000);
                } else {
                    setStatus("failed");
                    toast.error(res.error || "Payment verification failed");
                    setTimeout(() => router.push("/?payment_failed=true"), 2000);
                }
            } catch (error) {
                setStatus("failed");
                toast.error("Failed to verify Khalti payment with server.");
                setTimeout(() => router.push("/?payment_failed=true"), 2000);
            }
        };

        // Strict effect to prevent multiple triggers in React 18 if already set
        if (status === "verifying") {
            verify();
        }
    }, [searchParams, router, status]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center animate-in zoom-in-95 duration-500">
                {status === "verifying" && (
                    <>
                        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600">
                            <Loader2 className="w-10 h-10 animate-spin" />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 mb-2">Verifying Payment</h2>
                        <p className="text-sm font-medium text-slate-500">Communicating with Khalti gateway...</p>
                    </>
                )}
                {status === "success" && (
                    <>
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 mb-2">Payment Secured</h2>
                        <p className="text-sm font-medium text-slate-500">Returning you to the application...</p>
                    </>
                )}
                {status === "failed" && (
                    <>
                        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
                            <XCircle className="w-10 h-10" />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 mb-2">Verification Failed</h2>
                        <p className="text-sm font-medium text-slate-500">Transaction could not be verified.</p>
                    </>
                )}
            </div>
        </div>
    );
}

export default function KhaltiVerifyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-10 h-10 text-purple-600 animate-spin"/></div>}>
            <KhaltiVerifyContent />
        </Suspense>
    );
}
