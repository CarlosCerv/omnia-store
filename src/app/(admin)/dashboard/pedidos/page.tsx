"use client";

import { ShoppingBag, Search, Filter, ArrowRight } from "lucide-react";

const mockOrders = [
    { id: "#8820-A", customer: "Carlos Eduardo", date: "25 Feb, 2026", total: "$3,600.00", status: "Procesado", items: 2 },
    { id: "#8819-A", customer: "Sofía Martínez", date: "24 Feb, 2026", total: "$1,800.00", status: "Enviado", items: 1 },
    { id: "#8818-A", customer: "Daniel Rocha", date: "24 Feb, 2026", total: "$5,400.00", status: "Pendiente", items: 3 },
    { id: "#8817-A", customer: "Valentina Ruiz", date: "23 Feb, 2026", total: "$1,800.00", status: "Entregado", items: 1 },
];

export default function PedidosPage() {
    return (
        <div className="space-y-24">
            {/* Header */}
            <div className="flex justify-between items-end pb-12 border-b border-nordic-border">
                <div className="space-y-6">
                    <div className="text-[11px] uppercase tracking-[0.6em] font-bold text-nordic-muted">Gestión de Logística</div>
                    <h1 className="text-7xl font-bold tracking-tighter text-nordic-accent">Pedidos.</h1>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-nordic-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar pedido..."
                            className="bg-white border border-nordic-border pl-12 pr-6 py-4 rounded-xl text-sm focus:border-nordic-accent outline-none w-64"
                        />
                    </div>
                    <button className="bg-white border border-nordic-border p-4 rounded-xl text-nordic-muted hover:border-nordic-accent hover:text-nordic-accent transition-all">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-nordic-border rounded-3xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-nordic-bg border-b border-nordic-border">
                            <th className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-nordic-muted">Referencia</th>
                            <th className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-nordic-muted">Cliente</th>
                            <th className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-nordic-muted">Fecha</th>
                            <th className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-nordic-muted">Artículos</th>
                            <th className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-nordic-muted">Total</th>
                            <th className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-nordic-muted">Estado</th>
                            <th className="px-10 py-6"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockOrders.map((order) => (
                            <tr key={order.id} className="group border-b border-nordic-border hover:bg-nordic-bg/50 transition-colors last:border-0 cursor-pointer">
                                <td className="px-10 py-8 font-black text-lg">{order.id}</td>
                                <td className="px-10 py-8">
                                    <p className="font-bold">{order.customer}</p>
                                </td>
                                <td className="px-10 py-8 text-sm text-nordic-muted font-medium">{order.date}</td>
                                <td className="px-10 py-8 text-sm font-bold">{order.items}</td>
                                <td className="px-10 py-8 font-bold">{order.total}</td>
                                <td className="px-10 py-8">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${order.status === "Entregado" ? "bg-emerald-100 text-emerald-700" :
                                            order.status === "Enviado" ? "bg-blue-100 text-blue-700" :
                                                order.status === "Pendiente" ? "bg-amber-100 text-amber-700" :
                                                    "bg-nordic-bg text-nordic-muted"
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-nordic-border group-hover:bg-nordic-accent group-hover:text-white transition-all">
                                        <ArrowRight size={16} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center text-[11px] uppercase tracking-[0.2em] font-bold text-nordic-muted">
                <p>Mostrando {mockOrders.length} pedidos recientes</p>
                <div className="flex gap-4">
                    <button className="opacity-40" disabled>Anterior</button>
                    <button className="hover:text-nordic-accent">Siguiente</button>
                </div>
            </div>
        </div>
    );
}
