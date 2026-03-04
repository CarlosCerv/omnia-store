import Link from "next/link";
import NewsletterCapture from "@/components/NewsletterCapture";

export default function Footer() {
    return (
        <footer className="py-24 px-8 md:px-24 border-t border-nordic-border bg-nordic-bg">
            <div className="max-w-[1600px] mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-24">
                    <div className="space-y-12 max-w-sm">
                        <Link href="/" className="font-bold text-4xl tracking-tighter">OMNIA</Link>
                        <NewsletterCapture variant="footer" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-24 gap-y-12 text-[11px] uppercase tracking-widest font-medium text-nordic-muted">
                        <div className="space-y-4">
                            <p className="text-nordic-accent font-bold text-[10px]">Pedidos</p>
                            {/* Las rutas /seguimiento y /devoluciones deben existir, por ahora apuntamos a sus URLs */}
                            <Link href="/seguimiento" className="block hover:text-black">Seguimiento</Link>
                            <Link href="/devoluciones" className="block hover:text-black">Devoluciones</Link>
                        </div>
                        <div className="space-y-4">
                            <p className="text-nordic-accent font-bold text-[10px]">Estudio</p>
                            <Link href="/estudio" className="block hover:text-black">Manifiesto</Link>
                            <Link href="/ubicacion" className="block hover:text-black">Ubicación</Link>
                            <Link href="/prensa" className="block hover:text-black">Prensa</Link>
                        </div>
                        <div className="space-y-4">
                            <p className="text-nordic-accent font-bold text-[10px]">Social</p>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="block hover:text-black">Instagram</a>
                            <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="block hover:text-black">Behance</a>
                        </div>
                    </div>
                </div>
                <div className="mt-24 pt-12 border-t border-nordic-border flex justify-between items-center text-[10px] uppercase tracking-widest opacity-40">
                    <p>© 2026 Carlos Cervantes — OMNIA Studio México</p>
                    <p>Todos los derechos reservados</p>
                </div>
            </div>
        </footer>
    );
}
