"use client";

import { Settings, Save, Globe, Palette, ShieldCheck, CreditCard } from "lucide-react";

export default function ConfiguracionPage() {
    return (
        <div className="space-y-24">
            {/* Header */}
            <div className="flex justify-between items-end pb-12 border-b border-nordic-border">
                <div className="space-y-6">
                    <div className="text-[11px] uppercase tracking-[0.6em] font-bold text-nordic-muted">Parámetros Globales</div>
                    <h1 className="text-7xl font-bold tracking-tighter text-nordic-accent">Ajustes.</h1>
                </div>
                <button className="bg-nordic-accent text-white px-10 py-4 rounded-xl font-bold text-[12px] uppercase tracking-widest flex items-center gap-4 hover:pr-14 transition-all shadow-xl shadow-black/10">
                    Guardar Cambios
                    <Save size={18} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Navigation / Sections */}
                <div className="space-y-4">
                    {[
                        { name: "General", icon: Globe, active: true },
                        { name: "Apariencia", icon: Palette },
                        { name: "Pagos", icon: CreditCard },
                        { name: "Seguridad", icon: ShieldCheck },
                    ].map((item) => (
                        <button key={item.name} className={`w-full flex items-center gap-5 px-8 py-6 rounded-2xl transition-all border ${item.active
                                ? "bg-white border-nordic-accent text-nordic-accent shadow-lg"
                                : "border-nordic-border text-nordic-muted hover:bg-white hover:border-nordic-accent"
                            }`}>
                            <item.icon size={20} strokeWidth={item.active ? 2.5 : 2} />
                            <span className="font-bold tracking-tight">{item.name}</span>
                        </button>
                    ))}
                </div>

                {/* Form Content */}
                <div className="lg:col-span-2 space-y-16">
                    <div className="nordic-card space-y-10">
                        <h3 className="text-2xl font-bold tracking-tight border-b border-nordic-border pb-6">Identidad de Marca</h3>
                        <div className="grid grid-cols-1 gap-10">
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-nordic-muted">Nombre de la Tienda</label>
                                <input type="text" defaultValue="OMNIA Studio" className="w-full bg-nordic-bg border-0 p-6 rounded-xl font-bold text-lg outline-nordic-accent" />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-nordic-muted">Eslogan de Marca</label>
                                <input type="text" defaultValue="Silence Is Luxury" className="w-full bg-nordic-bg border-0 p-6 rounded-xl font-bold text-lg outline-nordic-accent" />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-nordic-muted">Moneda Base</label>
                                <select className="w-full bg-nordic-bg border-0 p-6 rounded-xl font-bold text-lg outline-nordic-accent appearance-none">
                                    <option>MXN - Pesos Mexicanos</option>
                                    <option>USD - Dólares Americanos</option>
                                    <option>EUR - Euros</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="nordic-card space-y-10">
                        <h3 className="text-2xl font-bold tracking-tight border-b border-nordic-border pb-6">Comunicación y Soporte</h3>
                        <div className="grid grid-cols-1 gap-10">
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-nordic-muted">Email de Contacto</label>
                                <input type="email" defaultValue="studio@omnia.com" className="w-full bg-nordic-bg border-0 p-6 rounded-xl font-bold text-sm outline-nordic-accent" />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-nordic-muted">Dirección del Studio</label>
                                <textarea rows={3} className="w-full bg-nordic-bg border-0 p-6 rounded-xl font-bold text-sm outline-nordic-accent resize-none">Paseo de la Reforma 250, Juárez, CDMX</textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
