"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartProvider";
import { formatPrice } from "@/lib/products";

export default function SlideOutCart() {
    const { items, isOpen, closeCart, updateQuantity, removeFromCart, cartCount, cartTotal } = useCart();

    const progress = Math.min((cartTotal / 899) * 100, 100);
    const amountLeft = 899 - cartTotal;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/40 z-[90]"
                        onClick={closeCart}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                        className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-xl z-[100] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 h-16 border-b border-omnia-border">
                            <h2 className="text-sm font-semibold tracking-wide uppercase">
                                Mi Bolsa ({cartCount})
                            </h2>
                            <button onClick={closeCart} className="p-2 -mr-2 text-omnia-dark hover:text-omnia-muted transition-colors" aria-label="Close cart">
                                <X size={20} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Shipping Progress */}
                        {items.length > 0 && (
                            <div className="px-6 py-4 bg-omnia-cream border-b border-omnia-border text-center">
                                <p className="text-[11px] font-medium tracking-wide uppercase mb-2 text-omnia-dark">
                                    {amountLeft > 0
                                        ? `FALTAN $${amountLeft.toFixed(2)} PARA ENVÍO GRATIS`
                                        : "¡TIENES ENVÍO GRATIS!"}
                                </p>
                                <div className="h-1 w-full bg-omnia-border rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-omnia-dark"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-omnia-cream flex items-center justify-center mb-2">
                                        <ShoppingBag className="w-6 h-6 text-omnia-muted" strokeWidth={1} />
                                    </div>
                                    <p className="text-sm font-medium uppercase tracking-wide text-omnia-dark">Tu bolsa está vacía</p>
                                    <Link
                                        href="/productos"
                                        onClick={closeCart}
                                        className="mt-4 px-8 py-3 bg-omnia-dark text-white text-xs font-semibold tracking-wide uppercase hover:bg-opacity-90 transition-colors"
                                    >
                                        Comprar Ahora
                                    </Link>
                                </div>
                            ) : (
                                items.map(item => (
                                    <div key={`${item.slug}-${item.color}-${item.size}`} className="flex gap-4">
                                        {/* Image */}
                                        <Link href={`/productos/${item.slug}`} onClick={closeCart} className="w-24 h-32 bg-omnia-cream flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </Link>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col py-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <Link href={`/productos/${item.slug}`} onClick={closeCart}>
                                                    <h3 className="text-xs font-semibold uppercase tracking-wide text-omnia-dark hover:underline">{item.name}</h3>
                                                </Link>
                                                <button
                                                    onClick={() => removeFromCart(item.slug, item.color, item.size)}
                                                    className="p-1 -mr-1 text-omnia-muted hover:text-omnia-dark transition-colors"
                                                    aria-label={`Remove ${item.name}`}
                                                >
                                                    <X size={14} strokeWidth={1.5} />
                                                </button>
                                            </div>
                                            <p className="text-[11px] text-omnia-muted mb-2">Color: {item.color} <br />Talla: {item.size}</p>

                                            <div className="mt-auto flex justify-between items-end">
                                                {/* Quantity Control */}
                                                <div className="flex items-center border border-omnia-border rounded w-fit h-8">
                                                    <button
                                                        onClick={() => updateQuantity(item.slug, item.color, item.size, item.quantity - 1)}
                                                        className="w-8 h-full flex items-center justify-center text-omnia-dark hover:bg-omnia-cream transition-colors"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus size={12} strokeWidth={1.5} />
                                                    </button>
                                                    <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.slug, item.color, item.size, item.quantity + 1)}
                                                        className="w-8 h-full flex items-center justify-center text-omnia-dark hover:bg-omnia-cream transition-colors"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus size={12} strokeWidth={1.5} />
                                                    </button>
                                                </div>
                                                <p className="text-sm font-semibold text-omnia-dark">{formatPrice(item.price)} MXN</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-omnia-border bg-white shrink-0">
                                <div className="flex justify-between items-end mb-4">
                                    <span className="text-sm font-medium text-omnia-dark">Subtotal</span>
                                    <span className="text-lg font-semibold text-omnia-dark">{formatPrice(cartTotal)} MXN</span>
                                </div>
                                <p className="text-[11px] text-omnia-muted mb-6">
                                    Impuestos incluidos. Los gastos de envío se calculan en la pantalla de pago.
                                </p>
                                <button className="w-full h-12 bg-omnia-dark text-white text-xs font-semibold tracking-wide uppercase hover:bg-opacity-90 transition-colors flex items-center justify-center">
                                    Procesar Pago
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
