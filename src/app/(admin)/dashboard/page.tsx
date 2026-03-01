import { ProductService } from "@/services/productService";
import { TrendingUp, Package, ShoppingCart, UserCheck, Activity, Target, Zap, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const stats = await ProductService.getStats();

    // Startup Grade Metrics
    const cards = [
        { name: "Ventas Netas", value: `$${stats.totalSales.toLocaleString()}`, trend: "+12.5%", icon: ShoppingCart, color: "text-nordic-accent" },
        { name: "Conversion Rate", value: "3.24%", trend: "+0.8%", icon: Activity, color: "text-emerald-500" },
        { name: "AOV (Ticket Promedio)", value: "$1,840", trend: "+2.1%", icon: Zap, color: "text-amber-500" },
        { name: "LTV (Customer Value)", value: "$5,200", trend: "+5.4%", icon: Target, color: "text-blue-500" },
    ];

    return (
        <div className="space-y-32">
            {/* ─── Global Status Header ─── */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-12 pb-16 border-b border-nordic-border">
                <div className="space-y-6">
                    <div className="text-[11px] uppercase tracking-[0.6em] font-bold text-nordic-muted">Sistema de Carlos Cervantes / v2.0</div>
                    <h1 className="text-8xl font-bold tracking-tighter text-nordic-accent animate-in fade-in slide-in-from-left duration-1000">Omnia Hub.</h1>
                </div>
                <div className="flex flex-col items-end gap-4">
                    <div className="flex items-center gap-4 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-full border border-emerald-100 font-bold text-xs uppercase tracking-widest">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        Sistemas en línea / CDMX
                    </div>
                    <p className="text-[10px] text-nordic-muted font-medium uppercase tracking-widest">Última sincronización: Hace 2 minutos</p>
                </div>
            </div>

            {/* ─── KPI Grid: Startup Performance ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {cards.map((card, idx) => (
                    <div key={card.name} className="nordic-card space-y-12 group hover:border-nordic-accent transition-all duration-500">
                        <div className="flex justify-between items-start">
                            <div className={`p-4 bg-nordic-bg rounded-2xl ${card.color}`}>
                                <card.icon size={22} strokeWidth={2.5} />
                            </div>
                            <span className="text-[10px] font-black uppercase bg-nordic-bg text-nordic-muted px-4 py-2 rounded-full group-hover:bg-nordic-accent group-hover:text-white transition-colors">
                                {card.trend}
                            </span>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[11px] uppercase tracking-widest font-bold text-nordic-muted">{card.name}</p>
                            <div className="text-6xl font-bold tracking-tighter">{card.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* ─── Real-time Order Stream ─── */}
                <div className="lg:col-span-2 space-y-12">
                    <div className="flex items-center justify-between border-b border-nordic-border pb-6">
                        <h3 className="text-2xl font-bold tracking-tight">Flujo de Transacciones</h3>
                        <button className="text-[10px] uppercase tracking-widest font-bold text-nordic-muted hover:text-nordic-accent">Ver Archivo</button>
                    </div>
                    <div className="space-y-6">
                        {[1, 2, 3].map((i, idx) => (
                            <div key={i} className="flex items-center justify-between p-10 bg-white border border-nordic-border rounded-3xl hover:border-nordic-accent transition-all cursor-pointer group hover:shadow-2xl hover:shadow-black/5">
                                <div className="flex items-center gap-10">
                                    <div className="w-20 h-20 bg-nordic-bg rounded-2xl flex items-center justify-center font-bold text-2xl text-nordic-muted group-hover:bg-nordic-accent group-hover:text-white transition-all">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-2xl tracking-tight">O-882{i}</p>
                                        <p className="text-sm text-nordic-muted font-medium">Hace {idxToMin(i)} • Daniel Rocha • $3,600 MXN</p>
                                    </div>
                                </div>
                                <div className="px-6 py-2 bg-nordic-bg rounded-lg text-[10px] uppercase font-black tracking-widest">
                                    Procesando
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── Readiness / Health ─── */}
                <div className="space-y-12">
                    <div className="flex items-center justify-between border-b border-nordic-border pb-6">
                        <h3 className="text-2xl font-bold tracking-tight">Salud Operativa</h3>
                        <Activity className="text-nordic-muted" size={18} />
                    </div>
                    <div className="nordic-card space-y-10">
                        <StatBar label="Inventario Signature" value={82} status="Saludable" />
                        <StatBar label="Uptime de Plataforma" value={99} status="Óptimo" />
                        <StatBar label="Respuesta de Soporte" value={45} status="Atención" />

                        <div className="pt-8 space-y-4">
                            <button className="w-full py-6 bg-nordic-accent text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:bg-black transition-all">
                                Generar Reporte Mensual
                            </button>
                            <p className="text-center text-[10px] text-nordic-muted uppercase tracking-widest font-medium">Próximo corte: 02 de Marzo</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function idxToMin(i: number) {
    const times = ["42 mins", "2 horas", "5 horas"];
    return times[i - 1] || "Reciente";
}

function StatBar({ label, value, status }: { label: string, value: number, status: string }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between font-bold text-[11px] uppercase tracking-widest">
                <span>{label}</span>
                <span className={status === "Atención" ? "text-amber-600" : "text-nordic-muted"}>{status} ({value}%)</span>
            </div>
            <div className="w-full bg-nordic-bg h-2 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${status === "Atención" ? "bg-amber-500" : "bg-nordic-accent"
                    }`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}
