import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductService } from "@/services/productService";
import { formatPrice } from "@/lib/products";
import ProductGrid from "@/features/products/ProductGrid";

export const revalidate = 3600; // ISR: revalidar cada hora

interface Props {
    searchParams: Promise<{ categoria?: string }>;
}

export default async function ProductCatalog({ searchParams }: Props) {
    const { categoria } = await searchParams;
    const activeCategory = categoria || "todo";

    const products = await ProductService.getByCategory(activeCategory);

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
                        <h1 className="text-6xl md:text-9xl font-bold tracking-tighter">
                            Archivo <br />Actual.
                        </h1>
                    </div>
                    <div className="flex gap-8 text-[11px] uppercase tracking-widest font-bold">
                        <Link
                            href="/productos"
                            className={`pb-1 transition-colors ${activeCategory === "todo" ? "text-nordic-accent border-b-2 border-nordic-accent" : "text-nordic-muted hover:text-black"}`}
                        >
                            Esenciales
                        </Link>
                        <Link
                            href="/productos?categoria=signature"
                            className={`pb-1 transition-colors ${activeCategory === "signature" ? "text-nordic-accent border-b-2 border-nordic-accent" : "text-nordic-muted hover:text-black"}`}
                        >
                            Temporada
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── Clean Gallery ─── */}
            <section className="px-8 md:px-24 max-w-[1600px] mx-auto">
                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-48 gap-6 text-center">
                        <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-nordic-muted">
                            No hay productos disponibles
                        </p>
                        <Link
                            href="/productos"
                            className="group flex items-center gap-3 font-bold text-[11px] uppercase tracking-[0.3em] hover:gap-4 transition-all"
                        >
                            Ver Todo <ArrowRight size={14} />
                        </Link>
                    </div>
                ) : (
                    <ProductGrid products={products} />
                )}
            </section>
        </main>
    );
}
