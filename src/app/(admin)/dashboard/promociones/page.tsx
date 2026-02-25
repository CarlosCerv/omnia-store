"use client";

import { PROMOTIONS } from "@/lib/promotions";
import { Megaphone, Plus, Trash2, Edit, CheckCircle2, XCircle } from "lucide-react";

export default function PromocionesPage() {
    return (
        <div className="space-y-24">
            {/* Header */}
            <div className="flex justify-between items-end pb-12 border-b border-nordic-border">
                <div className="space-y-6">
                    <div className="text-[11px] uppercase tracking-[0.6em] font-bold text-nordic-muted">Marketing & Visibilidad</div>
                    <h1 className="text-7xl font-bold tracking-tighter text-nordic-accent">Promociones.</h1>
                </div>
                <button className="bg-nordic-accent text-white px-8 py-4 rounded-xl font-bold text-[12px] uppercase tracking-widest flex items-center gap-4 hover:pr-12 transition-all">
                    Nueva Campaña
                    <Plus size={18} />
                </button>
            </div>

            {/* Promotions List */}
            <div className="grid grid-cols-1 gap-12">
                {PROMOTIONS.map((promo) => (
                    <div key={promo.id} className="nordic-card overflow-hidden !p-0 flex flex-col md:flex-row">
                        {promo.image && (
                            <div className="w-full md:w-64 aspect-square bg-[#F5F5F0] overflow-hidden">
                                <img src={promo.image} alt={promo.title} className="w-full h-full object-cover grayscale" />
                            </div>
                        )}
                        <div className="flex-1 p-10 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${promo.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                                        }`}>
                                        {promo.active ? "Activa" : "Inactiva"}
                                    </span>
                                    <span className="text-[10px] text-nordic-muted font-bold uppercase tracking-widest">Tipo: {promo.type}</span>
                                </div>
                                <h3 className="text-3xl font-bold tracking-tight">{promo.title}</h3>
                                <p className="text-nordic-muted text-sm max-w-xl">{promo.description || "Sin descripción adicional."}</p>
                                {promo.ctaText && (
                                    <div className="pt-4 flex items-center gap-2 text-xs font-bold text-nordic-accent">
                                        Logo CTA: <span className="bg-nordic-bg px-3 py-1 rounded-lg">{promo.ctaText}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-6 mt-8 pt-8 border-t border-nordic-border">
                                <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-nordic-muted hover:text-nordic-accent transition-colors">
                                    <Edit size={16} />
                                    Editar
                                </button>
                                <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-nordic-muted hover:text-nordic-accent transition-colors">
                                    {promo.active ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                                    {promo.active ? "Desactivar" : "Activar"}
                                </button>
                                <button className="ml-auto flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors">
                                    <Trash2 size={16} />
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tips / Info */}
            <div className="bg-white p-10 border border-nordic-border rounded-2xl flex items-start gap-8">
                <div className="p-4 bg-nordic-bg rounded-xl">
                    <Megaphone className="text-nordic-accent" size={24} />
                </div>
                <div className="space-y-2">
                    <h4 className="font-bold text-lg">Estrategia de Visibilidad</h4>
                    <p className="text-nordic-muted text-sm leading-relaxed max-w-2xl">
                        Las promociones configuradas aquí se reflejan instantáneamente en la página de inicio y el anuncio superior de la tienda. Recomendamos utilizar imágenes minimalistas con alto contraste para mantener la estética Nordic Gallery.
                    </p>
                </div>
            </div>
        </div>
    );
}
