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
                <h1 className="text-2xl font-semibold mb-4">Producto no encontrado</h1>
                <Link href="/productos" className="px-6 py-3 bg-black text-white text-sm hover:bg-opacity-90 transition-colors">
                    Explorar Todo
                </Link>
            </main>
        );
    }

    // Inicializar selecciones solo si están vacías
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
        // pt = 40px (promo bar) + 64px (header h-16) = 104px
        <main className="min-h-screen bg-white pt-[104px] pb-16">

            {/* ─── Breadcrumb (solo desktop) ─── */}
            <div className="px-4 md:px-8 py-4 max-w-[1400px] mx-auto hidden md:block">
                <nav className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-nordic-muted">
                    <Link href="/" className="hover:text-black transition-colors">Inicio</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link href="/productos" className="hover:text-black transition-colors">{product.category}</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-black font-medium">{product.name}</span>
                </nav>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                {/* ─── Layout: imagen + panel side-by-side en lg, stacked en mobile ─── */}
                <div className="flex flex-col lg:flex-row gap-8 xl:gap-16">

                    {/* ─── Galería de imágenes ─── */}
                    <div className="w-full lg:w-3/5">
                        {/* Imagen principal */}
                        <div className="w-full aspect-[3/4] min-h-[360px] bg-[#EBEBEB] relative overflow-hidden mb-3">
                            <motion.img
                                key={mainImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                src={product.images[mainImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {/* Botón favorito en mobile */}
                            <div className="absolute top-4 right-4 flex gap-3 md:hidden">
                                <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-sm">
                                    <Heart className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Thumbnails horizontales */}
                        {product.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setMainImage(i)}
                                        className={`w-[72px] h-[90px] shrink-0 overflow-hidden bg-[#EBEBEB] transition-all ${mainImage === i ? 'ring-1 ring-black ring-offset-1' : 'opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt={`Vista ${i + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ─── Panel de detalles ─── */}
                    <div className="w-full lg:w-2/5 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                                {product.name}
                            </h1>
                            <button className="hidden md:block text-nordic-muted hover:text-black transition-colors ml-4 shrink-0">
                                <Heart className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-xl font-bold mb-6">
                            {formatPrice(product.price)} MXN
                        </p>

                        {product.description && (
                            <p className="text-sm text-nordic-muted leading-relaxed mb-6">{product.description}</p>
                        )}

                        {/* ─── Colores ─── */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold uppercase tracking-wide">
                                    Color: <span className="text-nordic-muted font-normal">{selectedColor}</span>
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {product.colors.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => setSelectedColor(color.name)}
                                        className={`w-9 h-9 rounded-full relative transition-all ${selectedColor === color.name ? 'ring-2 ring-black ring-offset-2' : 'ring-1 ring-nordic-border hover:ring-black ring-offset-1'}`}
                                        aria-label={`Seleccionar ${color.name}`}
                                    >
                                        <span
                                            className={`block w-full h-full rounded-full ${color.border ? 'border border-nordic-border' : ''}`}
                                            style={{ backgroundColor: color.hex }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ─── Tallas ─── */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold uppercase tracking-wide">
                                    Talla: <span className="text-nordic-muted font-normal">{selectedSize}</span>
                                </span>
                                <button className="text-xs underline hover:text-nordic-muted transition-colors">Guía de Tallas</button>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`h-11 border text-sm font-bold transition-all ${selectedSize === size
                                                ? 'bg-black text-white border-black'           // ← estado seleccionado: usa #000 directo
                                                : 'bg-white text-black border-nordic-border hover:border-black'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ─── Añadir al carrito ─── */}
                        <button
                            onClick={handleAddToCart}
                            className="w-full h-14 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-nordic-muted transition-colors flex items-center justify-center mb-8"
                        >
                            Añadir a la Bolsa
                        </button>

                        {/* ─── Accordions ─── */}
                        <div className="border-t border-nordic-border">
                            {DETAILS.map((detail, index) => (
                                <div key={index} className="border-b border-nordic-border">
                                    <button
                                        className="w-full py-5 flex justify-between items-center text-left hover:text-nordic-muted transition-colors"
                                        onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                                    >
                                        <span className="text-sm font-medium">{detail.title}</span>
                                        <motion.div animate={{ rotate: openAccordion === index ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                            <ChevronDown size={18} strokeWidth={1.5} />
                                        </motion.div>
                                    </button>
                                    <AnimatePresence>
                                        {openAccordion === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pb-6">
                                                    <p className="text-sm text-nordic-muted leading-relaxed">{detail.content}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>

                        <button className="flex items-center gap-2 text-sm hover:text-nordic-muted transition-colors mt-6">
                            <Share className="w-4 h-4" /> Compartir
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── Productos Relacionados ─── */}
            {relatedProducts.length > 0 && (
                <section className="mt-24 px-4 md:px-8 max-w-[1400px] mx-auto border-t border-nordic-border pt-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                        <h2 className="text-2xl font-bold tracking-tight">Recomendaciones para ti</h2>
                        <Link href="/productos" className="hidden md:block text-sm font-medium underline hover:text-nordic-muted">
                            Ver Todo
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {relatedProducts.map((p) => (
                            <Link key={p.slug} href={`/productos/${p.slug}`} className="group block">
                                <div className="aspect-[3/4] min-h-[200px] overflow-hidden bg-[#EBEBEB] relative mb-3">
                                    <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0" />
                                    <img src={p.images[1] || p.image} alt={`${p.name} alt`} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold">{p.name}</h3>
                                    <p className="text-sm mt-1">{formatPrice(p.price)} MXN</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
