"use client";

import { motion } from "framer-motion";
import { useCart } from "@/context/CartProvider";
import { formatPrice } from "@/lib/products";

// Umbral de envío gratis en MXN
const FREE_SHIPPING_THRESHOLD = 3500;

interface FreeShippingProgressBarProps {
    /** Si se muestra sin artículos en el carrito, muestra el mensaje introductorio */
    showEmptyState?: boolean;
}

export default function FreeShippingProgressBar({ showEmptyState = true }: FreeShippingProgressBarProps) {
    const { cartTotal, items } = useCart();

    // Progreso: 0-100, clampeado para no exceder el 100%
    const progress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
    const amountLeft = Math.max(FREE_SHIPPING_THRESHOLD - cartTotal, 0);
    const isUnlocked = cartTotal >= FREE_SHIPPING_THRESHOLD;

    // No mostrar nada si el carrito está vacío y showEmptyState=false
    if (items.length === 0 && !showEmptyState) return null;

    return (
        <div className="w-full text-center space-y-2">
            {/* ─── Texto dinámico ─── */}
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                {items.length === 0 ? (
                    // Carrito vacío: mensaje introductorio
                    `Envío Gratis en pedidos superiores a ${formatPrice(FREE_SHIPPING_THRESHOLD)} MXN`
                ) : isUnlocked ? (
                    // Umbral superado
                    "¡Envío prioritario gratuito desbloqueado! 🎁"
                ) : (
                    // En progreso: cuánto falta
                    <>Estás a solo <span className="text-black">{formatPrice(amountLeft)} MXN</span> de desbloquear envío prioritario gratuito</>
                )}
            </p>

            {/* ─── Barra de progreso delgada ─── */}
            <div className="h-[2px] w-full bg-nordic-border overflow-hidden">
                <motion.div
                    className={`h-full ${isUnlocked ? "bg-black" : "bg-black"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                />
            </div>
        </div>
    );
}
