"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
    { label: "Ver Todo", href: "/productos" },
    { label: "Series de Archivo", href: "/productos?categoria=archivo" },
    { label: "Básicos", href: "/productos?categoria=basicos" },
    { label: "Accesorios", href: "/productos?categoria=accesorios" },
];

export default function NavigationDropdown() {
    const [open, setOpen] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setOpen(false), 120);
    };

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Trigger */}
            <button
                className={`flex items-center gap-1 font-medium text-[11px] uppercase tracking-[0.2em] transition-colors ${open ? "text-nordic-accent" : "text-nordic-muted hover:text-nordic-accent"
                    }`}
                aria-haspopup="true"
                aria-expanded={open}
            >
                Comprar
                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-block leading-none text-[8px]"
                >
                    ▼
                </motion.span>
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        // Posicionado relativo al header — left-0 y top-full del trigger
                        className="fixed left-0 right-0 z-[99] bg-white border-b border-black shadow-sm"
                        style={{ top: "calc(40px + 64px)" }} /* promo bar + header */
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className="max-w-[1400px] mx-auto px-12 py-10 grid grid-cols-1 md:grid-cols-3 gap-12">

                            {/* ─── Col 1: Categorías ─── */}
                            <div className="col-span-1">
                                <p className="text-[9px] uppercase tracking-[0.5em] font-bold text-nordic-muted mb-6">
                                    Colecciones
                                </p>
                                <ul className="space-y-2">
                                    {CATEGORIES.map((cat) => (
                                        <li key={cat.href}>
                                            <Link
                                                href={cat.href}
                                                onClick={() => setOpen(false)}
                                                className="group inline-flex items-center gap-3 text-2xl font-bold tracking-tight text-nordic-accent hover:text-black transition-colors"
                                            >
                                                <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-150 opacity-0 group-hover:opacity-100">
                                                    <ArrowRight size={14} />
                                                </span>
                                                {cat.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* ─── Col 2: Vacío / Espaciado ─── */}
                            <div className="hidden md:block" />

                            {/* ─── Col 3: Editorial Destacado ─── */}
                            <div className="flex gap-6 items-start">
                                {/* Imagen / Bloque de color */}
                                <div className="w-28 h-36 bg-[#EBEBEB] shrink-0 overflow-hidden">
                                    <img
                                        src="/images/products/signature-black-orig.png"
                                        alt="Serie v1"
                                        className="w-full h-full object-cover grayscale"
                                    />
                                </div>

                                {/* Texto editorial */}
                                <div className="flex flex-col justify-between h-36 py-1">
                                    <div>
                                        <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-nordic-muted mb-3">
                                            Ahora Disponible
                                        </p>
                                        <p className="text-base font-bold tracking-tight leading-snug text-nordic-accent max-w-[180px]">
                                            Descubre la Arquitectura Usable
                                        </p>
                                    </div>
                                    <Link
                                        href="/productos"
                                        onClick={() => setOpen(false)}
                                        className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-nordic-muted hover:text-black transition-colors"
                                    >
                                        Explorar la Campaña
                                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
