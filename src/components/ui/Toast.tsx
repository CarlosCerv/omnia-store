"use client";

import { useEffect, useState, createContext, useContext, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "warning";

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextValue {
    toast: (message: string, type?: ToastType) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const ICONS: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle size={16} className="text-green-600 shrink-0" />,
    error: <XCircle size={16} className="text-red-600 shrink-0" />,
    warning: <AlertCircle size={16} className="text-amber-600 shrink-0" />,
};

const BORDERS: Record<ToastType, string> = {
    success: "border-l-4 border-l-green-600",
    error: "border-l-4 border-l-red-600",
    warning: "border-l-4 border-l-amber-500",
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = "success") => {
        const id = Math.random().toString(36).slice(2);
        setToasts((prev) => [...prev, { id, type, message }]);
        // Auto-dismiss after 4s
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

    const ctx: ToastContextValue = {
        toast: addToast,
        success: (m) => addToast(m, "success"),
        error: (m) => addToast(m, "error"),
        warning: (m) => addToast(m, "warning"),
    };

    return (
        <ToastContext.Provider value={ctx}>
            {children}
            {/* ─── Toast Viewport ─── */}
            <div
                aria-live="polite"
                className="fixed bottom-6 right-6 z-[500] flex flex-col gap-3 pointer-events-none"
            >
                <AnimatePresence>
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={`pointer-events-auto flex items-start gap-3 bg-white px-5 py-4 shadow-xl min-w-[280px] max-w-[380px] ${BORDERS[t.type]}`}
                        >
                            {ICONS[t.type]}
                            <p className="text-sm font-medium text-neutral-800 leading-snug flex-1">
                                {t.message}
                            </p>
                            <button
                                onClick={() => dismiss(t.id)}
                                className="text-neutral-400 hover:text-neutral-700 transition-colors shrink-0 -mt-0.5"
                                aria-label="Cerrar"
                            >
                                <X size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}
