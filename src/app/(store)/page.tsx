"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { PROMOTIONS } from "@/lib/promotions";
import NewsletterCapture from "@/components/NewsletterCapture";

export default function HomePage() {
  const heroPromo = PROMOTIONS.find(p => p.type === 'hero' && p.active);

  return (
    <main className="bg-nordic-bg selection:bg-black selection:text-white">

      {/* ─── Hero Section: The Statement ─── */}
      <section className="min-h-screen flex flex-col justify-center px-8 md:px-24 max-w-[1600px] mx-auto">
        <div className="space-y-12 max-w-4xl pt-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="font-medium text-[11px] uppercase tracking-[0.5em] text-nordic-muted"
          >
            {heroPromo?.description || "Colección Primavera / Verano 2026"}
          </motion.div>

          <h1 className="font-bold text-7xl md:text-[10rem] leading-[0.85] tracking-[-0.06em] text-nordic-accent">
            {heroPromo?.title.split(' ')[0]} <br />
            {heroPromo?.title.split(' ').slice(1).join(' ')}
          </h1>

          <div className="flex flex-col md:flex-row md:items-end gap-12 pt-12">
            <Link
              href={heroPromo?.ctaLink || "/productos"}
              className="group bg-nordic-accent text-white px-12 py-6 text-sm font-bold uppercase tracking-widest flex items-center gap-4 transition-all hover:pr-16"
            >
              {heroPromo?.ctaText || "Explorar Colección"}
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <p className="max-w-xs text-nordic-muted leading-relaxed text-sm">
              Siluetas funcionales forjadas en la intersección de la precisión arquitectónica y el arte usable. Creadas para el minimalista moderno.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Featured Grid: Extreme Whitespace ─── */}
      <section className="section-padding px-8 md:px-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8 border-b border-nordic-border pb-12">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Siluetas Esenciales</h2>
          <Link href="/productos" className="font-medium text-[11px] uppercase tracking-widest hover:underline underline-offset-8 transition-all">
            Ver Todas las Series
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-24 gap-y-48">
          {[
            { name: "Signature Black v1", price: "$1,800 MXN", img: "/images/products/signature-black-orig.png" },
            { name: "Architect White v2", price: "$1,800 MXN", img: "/images/products/signature-white-orig.png" }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: idx * 0.2 }}
              className="group"
            >
              <Link href="/productos" className="block space-y-12">
                <div className="aspect-[4/5] min-h-[340px] overflow-hidden bg-[#EBEBEB]">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover md:grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight">{item.name}</h3>
                    <p className="text-nordic-muted text-sm uppercase tracking-widest font-medium">Serie de Producción Limitada</p>
                  </div>
                  <p className="font-bold text-lg">{item.price}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Philosophy Section ─── */}
      <section className="section-padding px-8 md:px-24 border-t border-nordic-border">
        {/* Eyebrow */}
        <div className="flex items-center gap-6 mb-16">
          <span className="text-[10px] uppercase tracking-[0.6em] font-bold text-nordic-muted">Manifiesto — OMNIA Studio</span>
          <div className="flex-1 h-px bg-nordic-border" />
        </div>

        {/* Headline editorial de ancho completo */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-[13vw] md:text-[11vw] font-bold tracking-tighter leading-[0.88] text-nordic-accent mb-20"
        >
          La calidad<br />
          <span className="italic font-light">es un acto</span><br />
          de rebeldía.
        </motion.h2>

        {/* Columna de cuerpo + CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-t border-nordic-border pt-12">
          <p className="max-w-md text-nordic-muted leading-relaxed text-base md:text-lg font-light">
            Rechazamos el ciclo del fast fashion. Cada pieza OMNIA es una adición permanente a tu silueta, diseñada para envejecer con dignidad durante décadas.
          </p>
          <Link
            href="/estudio"
            className="group flex items-center gap-4 font-bold text-[11px] uppercase tracking-[0.4em] text-nordic-accent hover:gap-6 transition-all whitespace-nowrap"
          >
            Leer el Manifiesto
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-24 px-8 md:px-24 border-t border-nordic-border">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-24">
          <div className="space-y-12 max-w-sm">
            <h2 className="font-bold text-4xl tracking-tighter">OMNIA</h2>
            <NewsletterCapture variant="footer" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-24 gap-y-12 text-[11px] uppercase tracking-widest font-medium text-nordic-muted">
            <div className="space-y-4">
              <p className="text-nordic-accent font-bold text-[10px]">Pedidos</p>
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
              <Link href="#" className="block hover:text-black">Instagram</Link>
              <Link href="#" className="block hover:text-black">Behance</Link>
            </div>
          </div>
        </div>
        <div className="mt-24 pt-12 border-t border-nordic-border flex justify-between items-center text-[10px] uppercase tracking-widest opacity-40">
          <p>© 2026 Carlos Cervantes — OMNIA Studio México</p>
          <p>Todos los derechos reservados</p>
        </div>
      </footer>
    </main>
  );
}
