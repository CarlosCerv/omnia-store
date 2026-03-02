"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { Product } from "@/types";

interface Props {
    products: Product[];
}

export default function ProductGrid({ products }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-32">
            {products.map((product, idx) => (
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
                            {product.description && (
                                <p className="text-sm text-nordic-muted leading-relaxed line-clamp-2">
                                    {product.description}
                                </p>
                            )}
                            <div className="pt-4 border-t border-nordic-border flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-bold">
                                <span>Ver Detalles</span>
                                <span className="opacity-40">Serie {product.category}</span>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
