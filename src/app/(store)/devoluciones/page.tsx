import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DevolucionesPage() {
    return (
        <main className="min-h-screen bg-nordic-bg pt-[104px] pb-24 px-8 md:px-24 max-w-[1400px] mx-auto">
            <div className="max-w-2xl space-y-16">
                <div className="space-y-6">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-nordic-muted font-black">Política</p>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">Devoluciones</h1>
                </div>

                <div className="space-y-8 text-nordic-muted leading-relaxed">
                    <div className="border-t border-nordic-border pt-8 space-y-4">
                        <h2 className="text-lg font-bold text-black tracking-tight">30 días sin preguntas</h2>
                        <p>Aceptamos devoluciones dentro de los 30 días posteriores a la recepción, siempre que la prenda esté en su empaque original, sin uso y con todas las etiquetas.</p>
                    </div>
                    <div className="border-t border-nordic-border pt-8 space-y-4">
                        <h2 className="text-lg font-bold text-black tracking-tight">Proceso</h2>
                        <p>Envíanos un correo a <span className="text-black font-medium">studio@omnia.com</span> con tu número de orden y motivo. Te enviaremos una guía de devolución prepagada en 24 horas hábiles.</p>
                    </div>
                    <div className="border-t border-nordic-border pt-8 space-y-4">
                        <h2 className="text-lg font-bold text-black tracking-tight">Reembolsos</h2>
                        <p>Los reembolsos se procesan al mismo método de pago original en un plazo de 5-7 días hábiles tras recibir el artículo.</p>
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
