"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

export default function Toast({ message, isVisible, onClose }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <div
            className={`fixed top-24 right-4 z-[80] bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 transform ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0 pointer-events-none"
                }`}
        >
            <div className="bg-green-500 rounded-full p-1">
                <CheckCircle2 size={16} className="text-white" />
            </div>
            <div>
                <p className="font-medium text-sm">{message}</p>
            </div>
        </div>
    );
}
