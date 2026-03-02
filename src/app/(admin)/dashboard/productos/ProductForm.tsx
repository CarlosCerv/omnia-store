"use client";

import { useRef, useState, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import { createProduct, updateProduct } from "../actions/products";
import { Product } from "@/types";

interface Props {
    product?: Product | null;
    onClose: () => void;
}

export default function ProductForm({ product, onClose }: Props) {
    const formRef = useRef<HTMLFormElement>(null);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const isEditing = !!product;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const form = e.currentTarget;
        const formData = new FormData(form);

        startTransition(async () => {
            try {
                if (isEditing && product) {
                    await updateProduct(product.slug, formData);
                } else {
                    await createProduct(formData);
                }
                onClose();
            } catch (err: any) {
                setError(err?.message || "Ocurrió un error. Verifica los datos.");
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto border border-neutral-200 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-neutral-100">
                    <h2 className="text-sm font-black uppercase tracking-[0.3em]">
                        {isEditing ? "Editar Producto" : "Nuevo Producto"}
                    </h2>
                    <button onClick={onClose} className="text-neutral-400 hover:text-black transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form ref={formRef} onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
                    {/* Nombre */}
                    <Field label="Nombre" name="name" defaultValue={product?.name} required />

                    {/* Slug (solo en creación) */}
                    {!isEditing && (
                        <Field label="Slug (URL)" name="slug" placeholder="ej: omnia-signature-black" required />
                    )}

                    {/* Precio */}
                    <Field label="Precio (MXN)" name="price" type="number" defaultValue={String(product?.price ?? "")} required />

                    {/* Categoría */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Categoría</label>
                        <select
                            name="category"
                            defaultValue={product?.category || "signature"}
                            className="w-full border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:border-black"
                        >
                            <option value="signature">Signature</option>
                            <option value="basicos">Básicos</option>
                            <option value="accesorios">Accesorios</option>
                            <option value="archivo">Series de Archivo</option>
                        </select>
                    </div>

                    {/* Imagen URL */}
                    <Field label="URL de Imagen Principal" name="image" type="url" defaultValue={product?.image} placeholder="https://..." required />

                    {/* Descripción */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Descripción</label>
                        <textarea
                            name="description"
                            defaultValue={product?.description}
                            rows={3}
                            className="w-full border border-neutral-200 px-3 py-2 text-sm resize-none focus:outline-none focus:border-black"
                        />
                    </div>

                    {/* Tallas */}
                    <Field
                        label="Tallas (separadas por coma)"
                        name="sizes"
                        defaultValue={product?.sizes?.join(", ") || "S, M, L, XL"}
                        placeholder="S, M, L, XL"
                    />

                    {/* Badge */}
                    <Field label="Badge (opcional)" name="badge" defaultValue={product?.badge} placeholder="Esencial, Nuevo, etc." />

                    {/* Colores (JSON hidden) */}
                    <input
                        type="hidden"
                        name="colors"
                        defaultValue={JSON.stringify(product?.colors || [{ name: "Onix", hex: "#0A0A0A" }])}
                    />

                    {error && (
                        <p className="text-xs text-red-600 font-medium">{error}</p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-11 border border-neutral-200 text-[11px] font-black uppercase tracking-widest hover:border-black transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 h-11 bg-neutral-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isPending && <Loader2 size={14} className="animate-spin" />}
                            {isEditing ? "Guardar Cambios" : "Crear Producto"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Field({ label, name, type = "text", defaultValue, placeholder, required }: {
    label: string; name: string; type?: string;
    defaultValue?: string; placeholder?: string; required?: boolean;
}) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">{label}</label>
            <input
                type={type}
                name={name}
                defaultValue={defaultValue}
                placeholder={placeholder}
                required={required}
                className="w-full border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
        </div>
    );
}
