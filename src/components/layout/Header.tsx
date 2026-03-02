"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartProvider";
import { PROMOTIONS } from "@/lib/promotions";

export default function Header() {
    const { data: session } = useSession();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { openCart, cartCount } = useCart();

    const promoBar = PROMOTIONS.find(p => p.type === 'bar' && p.active);
    // Altura fija del promo bar — debe coincidir con h-10 (40px)
    const PROMO_HEIGHT = promoBar ? 40 : 0;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* ─── Barra Promocional: altura fija h-10 = 40px ─── */}
            {promoBar && (
                <div className="fixed top-0 inset-x-0 z-[110] h-10 flex items-center justify-center bg-nordic-accent text-white">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-black px-4 text-center line-clamp-1">
                        {promoBar.title}
                    </p>
                </div>
            )}

            {/* ─── Header: top calculado con inline style para ser exacto en todos los viewports ─── */}
            <header
                style={{ top: `${PROMO_HEIGHT}px` }}
                className={`fixed inset-x-0 z-[100] h-16 flex items-center transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md border-b border-nordic-border" : "bg-transparent"
                    }`}
            >
                <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between relative">

                    {/* Nav Izquierda — solo desktop */}
                    <nav className="hidden md:flex items-center gap-12 font-medium text-[11px] uppercase tracking-[0.2em] text-nordic-muted">
                        <Link href="/productos" className="hover:text-nordic-accent transition-colors">Catálogo</Link>
                        <Link href="#about" className="hover:text-nordic-accent transition-colors">Estudio</Link>
                    </nav>

                    {/* Logo centrado */}
                    <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                        <span className="font-bold text-2xl tracking-[-0.05em] text-nordic-accent">OMNIA</span>
                    </Link>

                    {/* Acciones Derecha */}
                    <div className="flex items-center gap-5 text-nordic-muted ml-auto">
                        <button className="hidden sm:block hover:text-nordic-accent transition-colors" aria-label="Buscar">
                            <Search size={18} strokeWidth={1.5} />
                        </button>

                        {session ? (
                            <Link href="/dashboard" className="hidden sm:flex items-center gap-2 hover:text-nordic-accent transition-colors" aria-label="Mi Cuenta">
                                <User size={18} strokeWidth={1.5} />
                                <span className="text-[10px] uppercase tracking-widest font-black hidden lg:inline">Cuenta</span>
                            </Link>
                        ) : (
                            <button onClick={() => signIn()} className="hidden sm:flex items-center gap-2 hover:text-nordic-accent transition-colors" aria-label="Iniciar Sesión">
                                <User size={18} strokeWidth={1.5} />
                                <span className="text-[10px] uppercase tracking-widest font-black hidden lg:inline">Sign In</span>
                            </button>
                        )}

                        <button onClick={openCart} className="flex items-center gap-2 group hover:text-nordic-accent transition-colors" aria-label="Carrito">
                            <div className="relative">
                                <ShoppingBag size={20} strokeWidth={1.5} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-nordic-accent rounded-full" />
                                )}
                            </div>
                            <span className="font-medium text-[11px] tracking-widest hidden sm:inline">({cartCount})</span>
                        </button>

                        {/* Menú hamburguesa — solo mobile */}
                        <button
                            className="md:hidden hover:text-nordic-accent transition-colors"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Abrir menú"
                        >
                            <Menu size={22} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </header>

            {/* ─── Menú Móvil Fullscreen ─── */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[200] bg-nordic-bg p-8 flex flex-col">
                    <button className="self-end mb-16" onClick={() => setMobileMenuOpen(false)} aria-label="Cerrar menú">
                        <X size={32} strokeWidth={1} />
                    </button>
                    <nav className="flex flex-col gap-8">
                        <Link href="/productos" onClick={() => setMobileMenuOpen(false)} className="font-bold text-5xl tracking-tight">
                            Catálogo
                        </Link>
                        <Link href="#about" onClick={() => setMobileMenuOpen(false)} className="font-bold text-5xl tracking-tight">
                            Estudio
                        </Link>
                        {session ? (
                            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="font-bold text-5xl tracking-tight text-nordic-muted">
                                Mi Cuenta
                            </Link>
                        ) : (
                            <button
                                onClick={() => { setMobileMenuOpen(false); signIn(); }}
                                className="font-bold text-5xl tracking-tight text-nordic-muted text-left"
                            >
                                Acceder
                            </button>
                        )}
                    </nav>
                </div>
            )}
        </>
    );
}
