"use client";

import Link from "next/link";
import "./../globals.css";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    LogOut,
    ChevronRight,
    ArrowUpRight,
    Megaphone,
    ShoppingBag,
    Users,
    Settings
} from "lucide-react";
import { signOut, SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/ui/Toast";

const navItems = [
    { name: "Resumen", href: "/dashboard", icon: LayoutDashboard },
    { name: "Productos", href: "/dashboard/productos", icon: Package },
    { name: "Promociones", href: "/dashboard/promociones", icon: Megaphone },
    { name: "Pedidos", href: "/dashboard/pedidos", icon: ShoppingBag },
    { name: "Clientes", href: "/dashboard/clientes", icon: Users },
    { name: "Configuración", href: "/dashboard/configuracion", icon: Settings },
];

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <html lang="es">
            <body className="antialiased bg-nordic-bg text-nordic-text font-sans">
                <SessionProvider>
                    <ToastProvider>
                        <div className="flex min-h-screen">
                            {/* Sidebar: Ultra-minimal Nordic Style */}
                            <aside className="w-80 border-r border-nordic-border flex flex-col fixed inset-y-0 z-50 bg-white">
                                <div className="px-12 py-16">
                                    <Link href="/" className="block">
                                        <h1 className="font-bold text-3xl tracking-tighter">
                                            OMNIA<span className="text-[11px] uppercase tracking-[0.5em] text-nordic-muted pl-3 font-medium">Hub</span>
                                        </h1>
                                    </Link>
                                </div>

                                <nav className="flex-1 px-8 space-y-2 overflow-y-auto pb-10 custom-scrollbar">
                                    <p className="px-4 text-[10px] uppercase tracking-[0.4em] text-nordic-muted mb-6 font-bold">Operaciones</p>
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`flex items-center justify-between px-6 py-4 rounded-xl transition-all duration-300 group ${isActive
                                                    ? "bg-nordic-accent text-white shadow-xl shadow-black/10"
                                                    : "text-nordic-muted hover:bg-nordic-bg hover:text-nordic-accent"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-5">
                                                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                                    <span className="font-bold text-[13px] tracking-tight">{item.name}</span>
                                                </div>
                                                {isActive ? <ChevronRight size={16} /> : <div className="w-4 h-4 rounded-full border border-nordic-border group-hover:bg-nordic-accent transition-all" />}
                                            </Link>
                                        );
                                    })}
                                </nav>

                                <div className="p-10 border-t border-nordic-border space-y-4">
                                    <Link
                                        href="/"
                                        className="flex items-center justify-between px-6 py-4 bg-nordic-bg rounded-xl text-nordic-muted hover:text-nordic-accent transition-all font-bold text-[11px] uppercase tracking-widest"
                                    >
                                        <span>Tienda en Vivo</span>
                                        <ArrowUpRight size={14} />
                                    </Link>
                                    <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center gap-4 px-6 py-4 text-nordic-muted hover:text-red-500 transition-all font-bold text-[11px] uppercase tracking-widest">
                                        <LogOut size={18} />
                                        <span>Cerrar Sesión</span>
                                    </button>
                                </div>
                            </aside>

                            {/* Main: Breathable Content Area */}
                            <main className="flex-1 ml-80 p-24">
                                <div className="max-w-6xl mx-auto">
                                    {children}
                                </div>
                            </main>
                        </div>
                    </ToastProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
