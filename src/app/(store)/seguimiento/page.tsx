import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PlaceholderPageProps {
    title: string;
    subtitle: string;
    description: string;
}

function PlaceholderPage({ title, subtitle, description }: PlaceholderPageProps) {
    return (
        <main className="min-h-screen bg-nordic-bg flex flex-col items-center justify-center px-8 pt-[104px]">
            <div className="max-w-lg text-center space-y-8">
                <p className="text-[10px] uppercase tracking-[0.5em] text-nordic-muted font-black">{subtitle}</p>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">{title}</h1>
                <p className="text-nordic-muted leading-relaxed">{description}</p>
                <div className="pt-4 border-t border-nordic-border">
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

export default function SeguimientoPage() {
    return (
        <PlaceholderPage
            title="Seguimiento"
            subtitle="Tus pedidos"
            description="Próximamente podrás rastrear el estado de tu pedido en tiempo real. Por ahora, recibirás actualizaciones por correo electrónico."
        />
    );
}
