"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartProvider";
import { formatPrice } from "@/lib/products";
import FreeShippingProgressBar from "./FreeShippingProgressBar";

export default function SlideOutCart() {
    const { items, isOpen, closeCart, updateQuantity, removeFromCart, cartCount, cartTotal } = useCart();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* ─── Backdrop ─── */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/30 z-[90]"
                        onClick={closeCart}
                    />

                    {/* ─── Drawer ─── */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                        className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white z-[150] flex flex-col shadow-2xl"
                    >
                        {/* ─── Header del Drawer ─── */}
                        <div className="flex items-center justify-between px-6 h-16 border-b border-nordic-border shrink-0">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em]">
                                Mi Bolsa {cartCount > 0 && <span className="text-nordic-muted">({cartCount})</span>}
                            </h2>
                            <button
                                onClick={closeCart}
                                className="p-2 -mr-2 text-black hover:text-nordic-muted transition-colors"
                                aria-label="Cerrar carrito"
                            >
                                <X size={20} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* ─── Barra de envío gratis (solo si hay items o showEmptyState=true) ─── */}
                        <div className="px-6 py-4 border-b border-nordic-border bg-[#FAFAFA] shrink-0">
                            <FreeShippingProgressBar showEmptyState={items.length === 0} />
                        </div>

                        {/* ─── Lista de items ─── */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-[#F5F5F0] flex items-center justify-center">
                                        <ShoppingBag className="w-6 h-6 text-nordic-muted" strokeWidth={1} />
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-[0.3em]">Tu bolsa está vacía</p>
                                    <Link
                                        href="/productos"
                                        onClick={closeCart}
                                        className="mt-4 px-8 py-3 bg-black text-white text-[10px] font-black tracking-[0.3em] uppercase hover:bg-nordic-muted transition-colors"
                                    >
                                        Explorar Archivo
                                    </Link>
                                </div>
                            ) : (
                                items.map(item => (
                                    <div key={`${item.slug}-${item.color}-${item.size}`} className="flex gap-4">
                                        {/* Imagen del item */}
                                        <Link
                                            href={`/productos/${item.slug}`}
                                            onClick={closeCart}
                                            className="w-24 h-32 bg-[#EBEBEB] shrink-0 overflow-hidden"
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </Link>

                                        {/* Detalles del item */}
                                        <div className="flex-1 flex flex-col py-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <Link href={`/productos/${item.slug}`} onClick={closeCart}>
                                                    <h3 className="text-[11px] font-black uppercase tracking-wide hover:underline">
                                                        {item.name}
                                                    </h3>
                                                </Link>
                                                <button
                                                    onClick={() => removeFromCart(item.slug, item.color, item.size)}
                                                    className="p-1 -mr-1 text-nordic-muted hover:text-black transition-colors"
                                                    aria-label={`Eliminar ${item.name}`}
                                                >
                                                    <X size={14} strokeWidth={1.5} />
                                                </button>
                                            </div>

                                            <p className="text-[10px] text-nordic-muted mb-3 leading-relaxed">
                                                {item.color} · Talla {item.size}
                                            </p>

                                            <div className="mt-auto flex justify-between items-center">
                                                {/* Control de cantidad */}
                                                <div className="flex items-center border border-nordic-border h-8">
                                                    <button
                                                        onClick={() => updateQuantity(item.slug, item.color, item.size, item.quantity - 1)}
                                                        className="w-8 h-full flex items-center justify-center hover:bg-[#F5F5F0] transition-colors"
                                                        aria-label="Disminuir cantidad"
                                                    >
                                                        <Minus size={12} strokeWidth={1.5} />
                                                    </button>
                                                    <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.slug, item.color, item.size, item.quantity + 1)}
                                                        className="w-8 h-full flex items-center justify-center hover:bg-[#F5F5F0] transition-colors"
                                                        aria-label="Aumentar cantidad"
                                                    >
                                                        <Plus size={12} strokeWidth={1.5} />
                                                    </button>
                                                </div>
                                                <p className="text-sm font-bold">{formatPrice(item.price * item.quantity)} MXN</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* ─── Footer: total + checkout ─── */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-nordic-border bg-white shrink-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="text-xs uppercase tracking-widest font-medium text-nordic-muted">Subtotal</span>
                                    <span className="text-xl font-bold">{formatPrice(cartTotal)} MXN</span>
                                </div>
                                <p className="text-[10px] text-nordic-muted mb-5">
                                    Impuestos incluidos. Envío calculado en pago.
                                </p>
                                <button className="w-full h-12 bg-black text-white text-[10px] font-black tracking-[0.4em] uppercase hover:bg-nordic-muted transition-colors flex items-center justify-center">
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
