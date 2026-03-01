"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { ShoppingBag, Search, User, Menu, X, LogOut } from "lucide-react";
import { useCart } from "@/context/CartProvider";
import { PROMOTIONS } from "@/lib/promotions";

export default function Header() {
    const { data: session } = useSession();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { openCart, cartCount } = useCart();

    const promoBar = PROMOTIONS.find(p => p.type === 'bar' && p.active);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* Barra Promocional */}
            {promoBar && (
                <div className="fixed top-0 inset-x-0 z-[110] bg-nordic-accent text-white py-3 text-center">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-black">{promoBar.title}</p>
                </div>
            )}

            <header
                className={`fixed inset-x-0 z-[100] transition-all duration-300 ${promoBar ? "top-10" : "top-0"
                    } ${isScrolled ? "bg-white/80 backdrop-blur-md border-b border-nordic-border py-4" : "bg-transparent py-10"
                    }`}
            >
                <div className="max-w-[1400px] mx-auto px-8 md:px-12 flex items-center justify-between">

                    {/* Nav - Izquierda */}
                    <nav className="hidden md:flex items-center gap-12 font-medium text-[11px] uppercase tracking-[0.2em] text-nordic-muted">
                        <Link href="/productos" className="hover:text-nordic-accent transition-colors">Catálogo</Link>
                        <Link href="#about" className="hover:text-nordic-accent transition-colors">Estudio</Link>
                    </nav>

                    {/* Logo - Centro */}
                    <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                        <h1 className="font-bold text-2xl tracking-[-0.05em] text-nordic-accent">
                            OMNIA
                        </h1>
                    </Link>

                    {/* Acciones - Derecha */}
                    <div className="flex items-center gap-8 text-nordic-muted">
                        <button className="hidden sm:block hover:text-nordic-accent transition-colors">
                            <Search size={18} strokeWidth={1.5} />
                        </button>

                        {session ? (
                            <Link href="/dashboard" className="hidden sm:flex items-center gap-2 hover:text-nordic-accent transition-colors" title="Mi Cuenta">
                                <User size={18} strokeWidth={1.5} />
                                <span className="text-[10px] uppercase tracking-widest font-black hidden lg:inline">Cuenta</span>
                            </Link>
                        ) : (
                            <button onClick={() => signIn()} className="hidden sm:flex items-center gap-2 hover:text-nordic-accent transition-colors" title="Iniciar Sesión">
                                <User size={18} strokeWidth={1.5} />
                                <span className="text-[10px] uppercase tracking-widest font-black hidden lg:inline">Sign In</span>
                            </button>
                        )}

                        <button
                            onClick={openCart}
                            className="flex items-center gap-2 group hover:text-nordic-accent transition-colors"
                        >
                            <div className="relative">
                                <ShoppingBag size={20} strokeWidth={1.5} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-nordic-accent rounded-full" />
                                )}
                            </div>
                            <span className="font-medium text-[11px] tracking-widest hidden sm:inline">({cartCount})</span>
                        </button>

                        <button
                            className="md:hidden hover:text-nordic-accent transition-colors"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu size={22} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>

                {/* Menú Móvil */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-[110] bg-nordic-bg p-12 flex flex-col">
                        <button className="self-end mb-20" onClick={() => setMobileMenuOpen(false)}>
                            <X size={32} strokeWidth={1} />
                        </button>
                        <nav className="flex flex-col gap-10">
                            <Link href="/productos" onClick={() => setMobileMenuOpen(false)} className="font-bold text-5xl tracking-tight">Catálogo</Link>
                            <Link href="#about" onClick={() => setMobileMenuOpen(false)} className="font-bold text-5xl tracking-tight">Estudio</Link>
                            {session ? (
                                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="font-bold text-5xl tracking-tight text-nordic-muted">Mi Cuenta</Link>
                            ) : (
                                <button onClick={() => { setMobileMenuOpen(false); signIn(); }} className="font-bold text-5xl tracking-tight text-nordic-muted text-left">Sign In</button>
                            )}
                        </nav>
                    </div>
                )}
            </header>
        </>
    );
}
