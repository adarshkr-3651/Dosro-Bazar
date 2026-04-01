"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    isLoading?: boolean;
}

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    isLoading = false
}: DeleteConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 px-6">
            <div 
                className="relative w-full max-w-md bg-background border shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Close Icon */}
                <div className="absolute top-4 right-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={onClose} 
                        className="h-8 w-8 rounded-full hover:bg-muted"
                        disabled={isLoading}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="p-6 pt-8">
                    {/* Warning Icon */}
                    <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                        <AlertTriangle className="h-7 w-7 text-destructive" />
                    </div>

                    {/* Content */}
                    <div className="text-center space-y-2 mb-8">
                        <h3 className="text-xl font-bold tracking-tight">{title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed px-2">
                            {description}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button 
                            variant="outline" 
                            onClick={onClose}
                            className="w-full rounded-xl h-11 font-medium transition-all hover:bg-muted"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={onConfirm}
                            className="w-full rounded-xl h-11 font-medium shadow-sm transition-all shadow-destructive/20 active:scale-[0.98]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Chat"
                            )}
                        </Button>
                    </div>
                </div>

                {/* Subtle footer accent */}
                <div className="h-1.5 w-full bg-destructive/5" />
            </div>
        </div>
    );
}
