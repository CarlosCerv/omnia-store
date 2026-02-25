"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Heart, Share } from "lucide-react";
import { getProductBySlug, PRODUCTS, formatPrice } from "@/lib/products";
import { useCart } from "@/context/CartProvider";

const DETAILS = [
    { title: "Detalles del Producto", content: "Confeccionado en una mezcla especializada de viscosa de bambú. Antimicrobiano, regulador de temperatura y excepcionalmente suave. Ajuste semi-entallado con dobladillo festoneado." },
    { title: "Composición y Cuidados", content: "95% Viscosa de Bambú, 5% Elastano. Lavar a máquina en frío con colores similares. Secar en secadora a temperatura baja o secar al aire para prolongar la vida útil de la prenda. No usar lejía." },
    { title: "Envíos y Devoluciones", content: "Envío estándar gratuito en pedidos superiores a $899 MXN (4-5 días hábiles). Devoluciones gratuitas dentro de los 30 días posteriores a la recepción en su empaque original." }
];

export default function ProductPage() {
    const params = useParams();
    const slug = params.slug as string;
    const product = getProductBySlug(slug);
    const { addToCart, openCart } = useCart();

    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [openAccordion, setOpenAccordion] = useState<number | null>(0);
    const [mainImage, setMainImage] = useState(0);

    if (!product) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center flex-col pt-24">
                <h1 className="text-2xl font-semibold mb-4 text-omnia-dark">Producto no encontrado</h1>
                <Link href="/productos" className="px-6 py-3 bg-omnia-dark text-white text-sm hover:bg-opacity-90 transition-colors">
                    Explorar Todo
                </Link>
            </main>
        );
    }

    if (!selectedColor && product.colors.length > 0) setTimeout(() => setSelectedColor(product.colors[0].name), 0);
    if (!selectedSize && product.sizes.length > 0) setTimeout(() => setSelectedSize(product.sizes[0]), 0);

    const handleAddToCart = () => {
        addToCart({
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.image,
            color: selectedColor || product.colors[0]?.name || "Default",
            size: selectedSize || product.sizes[0] || "M",
        });
        openCart();
    };

    const relatedProducts = PRODUCTS.filter((p) => p.slug !== product.slug && p.category === product.category).slice(0, 4);

    return (
        <main className="min-h-screen bg-white pt-[90px] md:pt-[98px] pb-16">

            {/* ─── Breadcrumb ─── */}
            <div className="px-4 md:px-8 py-4 max-w-[1400px] mx-auto hidden md:block">
                <nav className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-omnia-muted">
                    <Link href="/" className="hover:text-omnia-dark transition-colors">Inicio</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link href="/productos" className="hover:text-omnia-dark transition-colors">{product.category}</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-omnia-dark font-medium">{product.name}</span>
                </nav>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">

                    {/* ─── Left: Image Gallery (Classic Layout) ─── */}
                    <div className="w-full lg:w-2/3 flex flex-col-reverse md:flex-row gap-4">
                        {/* Thumbnails */}
                        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible md:w-[80px] shrink-0 no-scrollbar">
                            {product.images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setMainImage(i)}
                                    className={`w-[80px] aspect-[3/4] shrink-0 overflow-hidden bg-omnia-cream transition-all ${mainImage === i ? 'ring-1 ring-omnia-dark ring-offset-1' : 'opacity-70 hover:opacity-100'}`}
                                >
                                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 bg-omnia-cream aspect-[3/4] md:aspect-auto md:h-[calc(100vh-160px)] min-h-[500px] relative overflow-hidden flex items-center justify-center">
                            <motion.img
                                key={mainImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                src={product.images[mainImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {/* Mobile Breadcrumb/Actions overlay */}
                            <div className="absolute top-4 right-4 flex gap-3 md:hidden">
                                <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-omnia-dark shadow-sm">
                                    <Heart className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ─── Right: Product Details ─── */}
                    <div className="w-full lg:w-1/3 flex flex-col pt-2 lg:pt-8">
                        <div className="flex justify-between items-start mb-2">
                            <h1 className="text-2xl font-semibold tracking-tight text-omnia-dark leading-tight">
                                {product.name}
                            </h1>
                            <button className="hidden md:block text-omnia-muted hover:text-omnia-dark transition-colors">
                                <Heart className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-lg font-medium text-omnia-dark mb-8">
                            {formatPrice(product.price)} MXN
                        </p>

                        {/* Colors */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-medium text-omnia-dark uppercase tracking-wide">
                                    Color: <span className="text-omnia-muted">{selectedColor}</span>
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {product.colors.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => setSelectedColor(color.name)}
                                        className={`w-9 h-9 rounded-full relative transition-all flex items-center justify-center ${selectedColor === color.name ? 'ring-1 ring-omnia-dark ring-offset-2' : 'hover:ring-1 hover:ring-omnia-border hover:ring-offset-2'}`}
                                        aria-label={`Select ${color.name}`}
                                    >
                                        <span className={`block w-full h-full rounded-full ${color.border ? 'border border-omnia-border' : ''}`} style={{ backgroundColor: color.hex }} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sizes */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-medium text-omnia-dark uppercase tracking-wide">
                                    Talla: <span className="text-omnia-muted">{selectedSize}</span>
                                </span>
                                <button className="text-xs text-omnia-dark underline hover:text-omnia-muted">Guía de Tallas</button>
                            </div>
                            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`h-11 rounded border text-sm font-medium transition-colors ${selectedSize === size ? 'bg-omnia-dark text-white border-omnia-dark' : 'bg-white text-omnia-dark border-omnia-border hover:border-omnia-dark'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ATC */}
                        <button
                            onClick={handleAddToCart}
                            className="w-full h-12 bg-omnia-dark text-white text-sm font-semibold uppercase tracking-wide hover:bg-opacity-90 transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] flex items-center justify-center mb-10"
                        >
                            Añadir a la Bolsa
                        </button>

                        {/* Accordions (Classic Clean) */}
                        <div className="border-t border-omnia-border">
                            {DETAILS.map((detail, index) => (
                                <div key={index} className="border-b border-omnia-border">
                                    <button
                                        className="w-full py-5 flex justify-between items-center text-left text-omnia-dark hover:text-omnia-muted transition-colors"
                                        onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                                    >
                                        <span className="text-sm font-medium">{detail.title}</span>
                                        <motion.div animate={{ rotate: openAccordion === index ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                            <ChevronDown size={18} strokeWidth={1.5} />
                                        </motion.div>
                                    </button>
                                    <AnimatePresence>
                                        {openAccordion === index && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                <div className="pb-6">
                                                    <p className="text-sm text-omnia-muted leading-relaxed">{detail.content}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>

                        {/* Share */}
                        <button className="flex items-center gap-2 text-sm text-omnia-dark hover:text-omnia-muted transition-colors mt-8">
                            <Share className="w-4 h-4" /> Compartir
                        </button>

                    </div>
                </div>
            </div>

            {/* ─── Related Products ─── */}
            {relatedProducts.length > 0 && (
                <section className="mt-24 px-4 md:px-8 max-w-[1400px] mx-auto border-t border-omnia-border pt-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                        <h2 className="text-2xl font-semibold tracking-tight text-omnia-dark">Recomendaciones para ti</h2>
                        <Link href="/productos" className="hidden md:block text-sm font-medium text-omnia-dark underline hover:text-omnia-muted">
                            Ver Todo
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {relatedProducts.map((p) => (
                            <Link key={p.slug} href={`/productos/${p.slug}`} className="group block">
                                <div className="aspect-[3/4] overflow-hidden bg-omnia-cream relative mb-3">
                                    <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0" />
                                    <img src={p.images[1] || p.image} alt={`${p.name} alt`} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-omnia-dark">{p.name}</h3>
                                    <p className="text-sm text-omnia-dark font-semibold mt-1">{formatPrice(p.price)} MXN</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
