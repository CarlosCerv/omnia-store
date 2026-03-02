"use client";

import { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PRODUCTS, formatPrice } from "@/lib/products";
import { motion } from "framer-motion";

function ProductCatalogInner() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category") || "todo";

    const filtered = useMemo(() => {
        if (initialCategory === "todo") return PRODUCTS;
        return PRODUCTS.filter((p) => p.category === initialCategory);
    }, [initialCategory]);

    return (
        <main className="min-h-screen bg-nordic-bg pt-48 pb-48">

            {/* ─── Structured Header ─── */}
            <section className="px-8 md:px-24 max-w-[1600px] mx-auto mb-32">
                <div className="space-y-8 flex flex-col md:flex-row md:items-end justify-between border-b border-nordic-border pb-16">
                    <div className="space-y-4">
                        <nav className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-nordic-muted">
                            <Link href="/" className="hover:text-black">Inicio</Link>
                            <span>/</span>
                            <span className="text-nordic-accent font-bold">Archivo</span>
                        </nav>
                        <h1 className="text-6xl md:text-9xl font-bold tracking-tighter">Archivo <br />Actual.</h1>
                    </div>
                    <div className="flex gap-8 text-[11px] uppercase tracking-widest font-bold">
                        <button className="text-nordic-accent pb-1 border-b-2 border-nordic-accent">Esenciales</button>
                        <button className="text-nordic-muted hover:text-black transition-colors">Temporada</button>
                    </div>
                </div>
            </section>

            {/* ─── Clean Gallery ─── */}
            <section className="px-8 md:px-24 max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-32">
                    {filtered.map((product, idx) => (
                        <motion.div
                            key={product.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                        >
                            <Link href={`/productos/${product.slug}`} className="group block space-y-10">
                                <div className="aspect-[3/4] min-h-[320px] overflow-hidden bg-[#EBEBEB] border border-nordic-border">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 md:grayscale group-hover:grayscale-0"
                                    />
                                </div>

                                <div className="space-y-4 px-2">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-2xl font-bold tracking-tight">{product.name}</h3>
                                        <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                                    </div>
                                    <p className="text-sm text-nordic-muted leading-relaxed line-clamp-2">
                                        Silueta a medida confeccionada en algodón orgánico de alto gramaje para una estructura permanente.
                                    </p>
                                    <div className="pt-4 border-t border-nordic-border flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-bold">
                                        <span>Ver Detalles</span>
                                        <span className="opacity-40">Serie {product.category}</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default function ProductCatalog() {
    return (
        <Suspense>
            <ProductCatalogInner />
        </Suspense>
    );
}
