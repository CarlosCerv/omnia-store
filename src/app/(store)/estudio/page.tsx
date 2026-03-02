import Link from "next/link";
import NewsletterCapture from "@/components/NewsletterCapture";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "El Estudio | OMNIA",
    description: "La calidad es un acto de rebeldía. OMNIA Studio México — diseño arquitectónico anti-fast fashion.",
};

export default function EstudioPage() {
    return (
        <main className="bg-nordic-bg min-h-screen pt-[104px]">

            {/* ─── Hero: Manifiesto ─── */}
            <section className="py-32 md:py-48 px-8 text-center border-b border-nordic-border">
                <div className="max-w-4xl mx-auto space-y-10">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-nordic-muted font-black">
                        OMNIA Studio México — Est. 2026
                    </p>
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9] italic">
                        La calidad es<br className="hidden md:block" /> un acto de<br className="hidden md:block" /> rebeldía.
                    </h1>
                    <p className="text-lg text-nordic-muted leading-relaxed max-w-lg mx-auto">
                        Rechazamos el ciclo del fast fashion. Cada pieza OMNIA es una adición permanente a tu silueta, diseñada para envejecer con dignidad.
                    </p>
                </div>
            </section>

            {/* ─── Layout Editorial: Visión ─── */}
            <section className="py-32 px-8 md:px-24 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-24 md:gap-40 items-start">

                    {/* Columna izquierda */}
                    <div className="space-y-16">
                        <div className="space-y-6">
                            <p className="text-[10px] uppercase tracking-[0.4em] text-nordic-muted font-black">01 — Origen</p>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                                Diseño forjado en la intersección del arte y la arquitectura.
                            </h2>
                            <p className="text-nordic-muted leading-loose text-sm">
                                OMNIA nació de una frustración simple: la imposibilidad de encontrar prendas que sobrevivieran más de una temporada sin perder su forma, su textura, o su sentido. Empezamos con una sola pregunta — ¿qué se necesita para que una camiseta dure décadas?
                            </p>
                        </div>

                        <div className="space-y-6">
                            <p className="text-[10px] uppercase tracking-[0.4em] text-nordic-muted font-black">02 — Materia</p>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                                Solo materiales que merecen existir.
                            </h2>
                            <p className="text-nordic-muted leading-loose text-sm">
                                Trabajamos exclusivamente con fibras naturales de alto gramaje, algodón orgánico certificado y viscosa de bambú. Sin mezclas sintéticas. Sin compromisos en la cadena de producción. Cada tela es auditada antes de cortar una sola pieza.
                            </p>
                        </div>
                    </div>

                    {/* Columna derecha: métricas editoriales */}
                    <div className="space-y-0 md:pt-24">
                        <div className="border-t border-nordic-border py-10 space-y-3">
                            <p className="text-6xl md:text-8xl font-bold tracking-tighter">∞</p>
                            <p className="text-[11px] uppercase tracking-[0.3em] text-nordic-muted font-medium">
                                Garantía de vida útil
                            </p>
                        </div>
                        <div className="border-t border-nordic-border py-10 space-y-3">
                            <p className="text-6xl md:text-8xl font-bold tracking-tighter">02</p>
                            <p className="text-[11px] uppercase tracking-[0.3em] text-nordic-muted font-medium">
                                Series activas en el Archivo
                            </p>
                        </div>
                        <div className="border-t border-nordic-border py-10 space-y-3">
                            <p className="text-6xl md:text-8xl font-bold tracking-tighter">0%</p>
                            <p className="text-[11px] uppercase tracking-[0.3em] text-nordic-muted font-medium">
                                Compromiso con fast fashion
                            </p>
                        </div>
                        <div className="border-t border-b border-nordic-border py-10 space-y-3">
                            <p className="text-6xl md:text-8xl font-bold tracking-tighter">MX</p>
                            <p className="text-[11px] uppercase tracking-[0.3em] text-nordic-muted font-medium">
                                Origen 100% mexicano
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Segundo bloque editorial ─── */}
            <section className="py-32 px-8 md:px-24 bg-black text-white border-t border-nordic-border">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                    <div className="space-y-8">
                        <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 font-black">03 — Principio</p>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none">
                            Producción limitada. Siempre.
                        </h2>
                        <p className="text-white/50 leading-loose text-sm max-w-md">
                            Nos negamos a sobreproducir. Cada Serie tiene una cantidad máxima definida antes de iniciar la producción. Cuando se agota, se archiva. No hay reimpresiones. No hay segundas oportunidades.
                        </p>
                        <p className="text-white/50 leading-loose text-sm max-w-md">
                            Esta escasez no es un truco de marketing — es un compromiso con la integridad del diseño y el respeto al cliente que eligió nuestra pieza antes de que existiera.
                        </p>
                    </div>
                    <div className="space-y-8">
                        <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 font-black">04 — Promesa</p>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none">
                            Diseñado para envejecer con dignidad.
                        </h2>
                        <p className="text-white/50 leading-loose text-sm max-w-md">
                            Una prenda OMNIA no es una compra — es una decisión. Cuando alguien elige llevar nuestra ropa, está declarando que rechaza la disposabilidad como estilo de vida.
                        </p>
                        <Link
                            href="/productos"
                            className="inline-flex items-center gap-3 text-[11px] uppercase tracking-widest font-black text-white hover:text-white/60 transition-colors group"
                        >
                            Ver el Archivo Actual
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── Newsletter CTA ─── */}
            <NewsletterCapture variant="block" />

        </main>
    );
}
