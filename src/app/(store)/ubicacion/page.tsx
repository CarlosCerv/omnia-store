import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function UbicacionPage() {
    return (
        <main className="min-h-screen bg-nordic-bg pt-[104px] pb-24 px-8 md:px-24 max-w-[1400px] mx-auto">
            <div className="max-w-2xl space-y-16">
                <div className="space-y-6">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-nordic-muted font-black">Estudio</p>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">Ubicación</h1>
                </div>

                <div className="space-y-8">
                    <div className="border-t border-nordic-border pt-8 space-y-4">
                        <h2 className="text-lg font-bold tracking-tight">OMNIA Studio México</h2>
                        <address className="not-italic text-nordic-muted leading-loose">
                            Calle Reforma Norte 142<br />
                            Col. Juárez, Cuauhtémoc<br />
                            Ciudad de México, CDMX 06600<br />
                            México
                        </address>
                    </div>
                    <div className="border-t border-nordic-border pt-8 space-y-4">
                        <h2 className="text-lg font-bold tracking-tight">Horarios de Atención</h2>
                        <div className="text-nordic-muted space-y-2">
                            <p>Lunes — Viernes: 10:00 — 18:00</p>
                            <p>Sábado: 11:00 — 16:00</p>
                            <p>Domingo: Cerrado</p>
                        </div>
                    </div>
                    <div className="border-t border-nordic-border pt-8 space-y-4">
                        <h2 className="text-lg font-bold tracking-tight">Contacto</h2>
                        <p className="text-nordic-muted">
                            <a href="mailto:studio@omnia.com" className="text-black hover:text-nordic-muted transition-colors">studio@omnia.com</a>
                        </p>
                    </div>
                </div>

                <div className="border-t border-nordic-border pt-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 text-[11px] uppercase tracking-widest font-black hover:text-nordic-muted transition-colors"
                    >
                        <ArrowLeft size={14} />
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        </main>
    );
}
