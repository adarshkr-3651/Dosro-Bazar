'use client';
import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export type MessageVariant = 'error' | 'warning' | 'info' | 'success';

interface ErrorMessageProps {
    error?: string;
    message?: string;
    variant?: MessageVariant;
    autoDismiss?: boolean;
    dismissAfter?: number; // in milliseconds
    onDismiss?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
    error,
    message,
    variant = 'error',
    autoDismiss = false,
    dismissAfter = 5000,
    onDismiss
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    const displayMessage = error || message;

    useEffect(() => {
        // Trigger entrance animation
        setIsAnimating(true);

        // Auto dismiss if enabled
        if (autoDismiss && displayMessage) {
            const timer = setTimeout(() => {
                handleDismiss();
            }, dismissAfter);

            return () => clearTimeout(timer);
        }
    }, [displayMessage, autoDismiss, dismissAfter]);

    const handleDismiss = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setIsVisible(false);
            onDismiss?.();
        }, 300); // Match animation duration
    };

    if (!displayMessage || !isVisible) return null;

    // Variant configurations
    const variantConfig = {
        error: {
            icon: XCircle,
            bgColor: 'bg-gradient-to-r from-red-50 to-red-100/80',
            borderColor: 'border-red-300',
            textColor: 'text-red-800',
            iconColor: 'text-red-600',
            glowColor: 'shadow-red-200/50',
        },
        warning: {
            icon: AlertCircle,
            bgColor: 'bg-gradient-to-r from-amber-50 to-amber-100/80',
            borderColor: 'border-amber-300',
            textColor: 'text-amber-800',
            iconColor: 'text-amber-600',
            glowColor: 'shadow-amber-200/50',
        },
        info: {
            icon: Info,
            bgColor: 'bg-gradient-to-r from-blue-50 to-blue-100/80',
            borderColor: 'border-blue-300',
            textColor: 'text-blue-800',
            iconColor: 'text-blue-600',
            glowColor: 'shadow-blue-200/50',
        },
        success: {
            icon: CheckCircle,
            bgColor: 'bg-gradient-to-r from-green-50 to-green-100/80',
            borderColor: 'border-green-300',
            textColor: 'text-green-800',
            iconColor: 'text-green-600',
            glowColor: 'shadow-green-200/50',
        },
    };

    const config = variantConfig[variant];
    const Icon = config.icon;

    return (
        <div
            className={`
                relative overflow-hidden rounded-xl border backdrop-blur-sm
                ${config.bgColor} ${config.borderColor} ${config.glowColor}
                shadow-lg transition-all duration-300 ease-out
                ${isAnimating ? 'animate-slideInDown opacity-100' : 'opacity-0 -translate-y-2'}
            `}
            role="alert"
        >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

            <div className="relative flex items-start gap-3 p-4">
                {/* Icon */}
                <div className={`flex-shrink-0 ${config.iconColor} animate-fadeIn`}>
                    <Icon size={20} strokeWidth={2.5} />
                </div>

                {/* Message */}
                <div className={`flex-1 text-sm font-medium ${config.textColor} leading-relaxed`}>
                    {displayMessage}
                </div>

                {/* Dismiss button */}
                <button
                    onClick={handleDismiss}
                    className={`
                        flex-shrink-0 ${config.iconColor} hover:opacity-70 
                        transition-opacity duration-200 focus:outline-none
                        focus:ring-2 focus:ring-offset-1 rounded-full
                        ${config.borderColor.replace('border-', 'focus:ring-')}
                    `}
                    aria-label="Dismiss message"
                >
                    <X size={16} strokeWidth={2.5} />
                </button>
            </div>

            {/* Progress bar for auto-dismiss */}
            {autoDismiss && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 overflow-hidden">
                    <div
                        className={`h-full ${config.iconColor.replace('text-', 'bg-')} animate-shrinkWidth`}
                        style={{ animationDuration: `${dismissAfter}ms` }}
                    />
                </div>
            )}
        </div>
    );
};

export default ErrorMessage;

// Add these custom animations to your global CSS or tailwind.config.js
// @keyframes slideInDown {
//   from {
//     opacity: 0;
//     transform: translateY(-1rem);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }
// @keyframes shimmer {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// }
// @keyframes shrinkWidth {
//   from { width: 100%; }
//   to { width: 0%; }
// }
