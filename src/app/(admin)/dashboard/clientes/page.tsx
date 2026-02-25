"use client";

import { Users, Search, Mail, Phone, Calendar } from "lucide-react";

const mockClients = [
    { name: "Carlos Eduardo", email: "carlos@example.com", phone: "+52 55 1234 5678", orders: 12, spent: "$21,600", joined: "Jan 2026" },
    { name: "Sofía Martínez", email: "sofia.m@example.com", phone: "+52 55 9876 5432", orders: 4, spent: "$7,200", joined: "Feb 2026" },
    { name: "Andrés Delgado", email: "adelgado@example.com", phone: "+52 33 4455 6677", orders: 2, spent: "$3,600", joined: "Feb 2026" },
];

export default function ClientesPage() {
    return (
        <div className="space-y-24">
            {/* Header */}
            <div className="flex justify-between items-end pb-12 border-b border-nordic-border">
                <div className="space-y-6">
                    <div className="text-[11px] uppercase tracking-[0.6em] font-bold text-nordic-muted">Base de Datos de Audiencia</div>
                    <h1 className="text-7xl font-bold tracking-tighter text-nordic-accent">Clientes.</h1>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-nordic-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        className="bg-white border border-nordic-border pl-12 pr-6 py-4 rounded-xl text-sm focus:border-nordic-accent outline-none w-80"
                    />
                </div>
            </div>

            {/* Stats Quick Look */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="bg-nordic-bg p-10 rounded-3xl border border-nordic-border flex items-center justify-between">
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-widest font-black text-nordic-muted">Total Registrados</p>
                        <h4 className="text-4xl font-bold tracking-tighter">1,204</h4>
                    </div>
                    <Users className="text-nordic-accent opacity-20" size={32} />
                </div>
                <div className="bg-nordic-bg p-10 rounded-3xl border border-nordic-border flex items-center justify-between">
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-widest font-black text-nordic-muted">Retención Mensual</p>
                        <h4 className="text-4xl font-bold tracking-tighter">18.4%</h4>
                    </div>
                    <ShieldCheck className="text-emerald-500 opacity-20" size={32} />
                </div>
                <div className="bg-nordic-bg p-10 rounded-3xl border border-nordic-border flex items-center justify-between">
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-widest font-black text-nordic-muted">Ticket Promedio</p>
                        <h4 className="text-4xl font-bold tracking-tighter">$2,840.00</h4>
                    </div>
                    <Calendar className="text-nordic-accent opacity-20" size={32} />
                </div>
            </div>

            {/* Clients Card View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {mockClients.map((client) => (
                    <div key={client.email} className="nordic-card space-y-10 group hover:border-nordic-accent transition-all cursor-pointer">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-nordic-bg rounded-2xl flex items-center justify-center font-bold text-2xl text-nordic-accent uppercase">
                                {client.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight">{client.name}</h3>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-nordic-muted">Desde {client.joined}</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 mt-6 border-t border-nordic-border">
                            <div className="flex items-center gap-4 text-sm font-medium text-nordic-muted">
                                <Mail size={16} />
                                {client.email}
                            </div>
                            <div className="flex items-center gap-4 text-sm font-medium text-nordic-muted">
                                <Phone size={16} />
                                {client.phone}
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-6">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-black text-nordic-muted">Órdenes</p>
                                <p className="font-bold text-xl">{client.orders}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-widest font-black text-nordic-muted">Total Gastado</p>
                                <p className="font-bold text-xl text-nordic-accent">{client.spent}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

import { ShieldCheck } from "lucide-react";
