import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrensaPage() {
    return (
        <main className="min-h-screen bg-nordic-bg pt-[104px] pb-24 px-8 md:px-24 max-w-[1400px] mx-auto">
            <div className="max-w-2xl space-y-16">
                <div className="space-y-6">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-nordic-muted font-black">Medios</p>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">Prensa</h1>
                </div>

                <div className="space-y-8">
                    <div className="border-t border-nordic-border pt-8 space-y-4">
                        <p className="text-nordic-muted leading-relaxed">
                            Para solicitudes de prensa, colaboraciones editoriales o préstamo de prendas, contáctanos directamente. Respondemos todas las solicitudes en un plazo de 48 horas hábiles.
                        </p>
                    </div>
                    <div className="border-t border-nordic-border pt-8 space-y-4">
                        <h2 className="text-lg font-bold tracking-tight">Contacto de Prensa</h2>
                        <p className="text-nordic-muted">
                            <a href="mailto:prensa@omnia.com" className="text-black hover:text-nordic-muted transition-colors">
                                prensa@omnia.com
                            </a>
                        </p>
                    </div>
                    <div className="border-t border-nordic-border pt-8 space-y-4">
                        <h2 className="text-lg font-bold tracking-tight">Kit de Marca</h2>
                        <p className="text-nordic-muted leading-relaxed">
                            Assets de alta resolución, guías de uso de marca y notas de prensa disponibles bajo solicitud.
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
