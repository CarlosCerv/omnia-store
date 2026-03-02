"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NewsletterCaptureProps {
    /** Variante de presentación */
    variant?: "footer" | "block";
}

export default function NewsletterCapture({ variant = "footer" }: NewsletterCaptureProps) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    // Validación básica de email en cliente
    const isValidEmail = (value: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setErrorMsg("Ingresa tu correo electrónico.");
            setStatus("error");
            return;
        }
        if (!isValidEmail(email)) {
            setErrorMsg("Por favor ingresa un email válido.");
            setStatus("error");
            return;
        }

        // TODO: conectar con Resend / API route cuando esté disponible
        setStatus("success");
        setEmail("");
        setErrorMsg("");
    };

    if (variant === "block") {
        return (
            <section className="py-24 px-8 md:px-24 bg-black text-white">
                <div className="max-w-2xl mx-auto text-center space-y-10">
                    <div className="space-y-4">
                        <p className="text-[10px] uppercase tracking-[0.5em] text-white/50 font-black">
                            Archivos Privados
                        </p>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none">
                            Únete a los Archivos OMNIA.
                        </h2>
                        <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto">
                            Acceso anticipado a Series de Producción Limitada.
                            Sin spam. Solo lo que importa.
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {status === "success" ? (
                            <motion.p
                                key="success"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-white/80 font-medium"
                            >
                                ✓ Estás en la lista. Bienvenido a los Archivos.
                            </motion.p>
                        ) : (
                            <motion.form
                                key="form"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit}
                                className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto"
                            >
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setStatus("idle");
                                        setErrorMsg("");
                                    }}
                                    placeholder="tu@correo.com"
                                    className="flex-1 bg-transparent border-b border-white/30 pb-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white transition-colors"
                                    aria-label="Correo electrónico"
                                />
                                <button
                                    type="submit"
                                    className="mt-4 sm:mt-0 sm:ml-6 text-white/60 hover:text-white transition-colors flex items-center gap-2 text-xs uppercase tracking-widest font-black group"
                                    aria-label="Unirse a la lista"
                                >
                                    Unirse
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {status === "error" && (
                        <p className="text-red-400 text-xs">{errorMsg}</p>
                    )}
                </div>
            </section>
        );
    }

    // Variante footer: más compacta, usada en el footer del home
    return (
        <div className="space-y-6">
            <p className="text-[11px] uppercase tracking-[0.3em] font-black text-nordic-muted">Archivos por Email</p>
            <p className="text-xs text-nordic-muted leading-relaxed max-w-[260px]">
                Acceso anticipado a Series de Producción Limitada.
            </p>

            <AnimatePresence mode="wait">
                {status === "success" ? (
                    <motion.p
                        key="success"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs font-medium"
                    >
                        ✓ Bienvenido a los Archivos.
                    </motion.p>
                ) : (
                    <motion.form key="form" onSubmit={handleSubmit}>
                        <div className="flex items-end gap-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setStatus("idle");
                                    setErrorMsg("");
                                }}
                                placeholder="Tu correo electrónico"
                                className="bg-transparent border-b border-nordic-border pb-2 outline-none text-sm w-full focus:border-black transition-colors placeholder:text-nordic-muted"
                                aria-label="Correo electrónico"
                            />
                            <button
                                type="submit"
                                className="text-nordic-muted hover:text-black transition-colors shrink-0 pb-2"
                                aria-label="Suscribirse"
                            >
                                <ArrowRight size={18} />
                            </button>
                        </div>
                        {status === "error" && (
                            <p className="text-red-600 text-[10px] mt-2">{errorMsg}</p>
                        )}
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}
