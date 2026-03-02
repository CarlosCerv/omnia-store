"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/products";
import { deleteProduct } from "../actions/products";
import ProductForm from "./ProductForm";
import { Product } from "@/types";

interface Props {
    products: Product[];
}

export default function ProductsTable({ products: initialProducts }: Props) {
    const [products] = useState(initialProducts);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleDelete = (slug: string) => {
        if (!confirm(`¿Eliminar el producto "${slug}"? Esta acción no se puede deshacer.`)) return;
        setDeletingSlug(slug);
        startTransition(async () => {
            await deleteProduct(slug);
            setDeletingSlug(null);
        });
    };

    return (
        <>
            {/* Modal Form */}
            {(showCreateForm || editingProduct) && (
                <ProductForm
                    product={editingProduct}
                    onClose={() => {
                        setShowCreateForm(false);
                        setEditingProduct(null);
                    }}
                />
            )}

            <div className="space-y-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-neutral-900 mb-2">Productos</h1>
                        <p className="text-neutral-500 font-medium uppercase text-xs tracking-widest">
                            {products.length} producto{products.length !== 1 ? "s" : ""} en el catálogo
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="h-12 px-6 bg-neutral-900 text-white text-xs font-black uppercase tracking-widest rounded-lg flex items-center gap-3 hover:bg-neutral-800 transition-all shadow-lg"
                    >
                        <Plus size={18} />
                        Nuevo Producto
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-neutral-50 border-b border-neutral-100">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Producto</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Categoría</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Precio</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center text-neutral-400 text-xs uppercase tracking-widest">
                                        No hay productos. Crea el primero.
                                    </td>
                                </tr>
                            ) : products.map((product) => (
                                <tr key={product.slug} className="hover:bg-neutral-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-12 h-12 rounded-lg object-cover bg-neutral-100 border border-neutral-100"
                                            />
                                            <div>
                                                <p className="text-sm font-bold text-neutral-900 uppercase tracking-tight">{product.name}</p>
                                                <p className="text-[10px] text-neutral-400 font-medium uppercase">{product.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-neutral-900 uppercase">
                                            {formatPrice(product.price)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/productos/${product.slug}`}
                                                target="_blank"
                                                className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
                                                title="Ver en tienda"
                                            >
                                                <ExternalLink size={18} />
                                            </Link>
                                            <button
                                                onClick={() => setEditingProduct(product)}
                                                className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
                                                title="Editar"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.slug)}
                                                disabled={deletingSlug === product.slug || isPending}
                                                className="p-2 text-neutral-400 hover:text-red-600 transition-colors disabled:opacity-40"
                                                title="Eliminar"
                                            >
                                                {deletingSlug === product.slug
                                                    ? <Loader2 size={18} className="animate-spin" />
                                                    : <Trash2 size={18} />
                                                }
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
