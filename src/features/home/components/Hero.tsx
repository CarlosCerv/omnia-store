"use client";

import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative w-full h-[100dvh] flex items-end overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="/hero.png"
                    alt="OMNIA Editorial"
                    className="w-full h-full object-cover object-[50%_30%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full px-5 sm:px-8 lg:px-12 xl:px-16 pb-14 sm:pb-20 md:pb-24">
                <div className="max-w-[1400px] mx-auto">
                    <motion.div
                        className="inline-block px-3 py-1 border border-white/25 mb-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        <span className="text-white/80 text-[10px] tracking-[0.3em] uppercase font-light">
                            Nueva Colección — Otoño 2026
                        </span>
                    </motion.div>

                    <motion.h1
                        className="text-white font-serif text-[2.2rem] sm:text-[3rem] md:text-[3.8rem] lg:text-[4.5rem] tracking-[-0.01em] leading-[1.05] mb-5 sm:mb-6 max-w-2xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        Transición<br />Total.
                    </motion.h1>

                    <motion.p
                        className="text-white/65 text-[13px] sm:text-[14px] font-light max-w-md mb-8 leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                    >
                        Ropa que se adapta a las aventuras más exigentes y a la vida urbana.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                    >
                        <a
                            href="#collection"
                            className="inline-flex items-center justify-center h-12 px-8 bg-white text-omnia-dark text-[11px] tracking-[0.14em] uppercase font-semibold hover:bg-omnia-accent hover:text-white transition-all duration-400"
                        >
                            Descubre la Colección
                        </a>
                        <a
                            href="#bestsellers"
                            className="inline-flex items-center justify-center h-12 px-8 border border-white/40 text-white text-[11px] tracking-[0.14em] uppercase font-medium hover:bg-white/10 transition-all duration-400"
                        >
                            Best Sellers
                        </a>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                <motion.div
                    className="w-[1px] h-8 bg-white/30"
                    animate={{ scaleY: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformOrigin: "top" }}
                />
            </motion.div>
        </section>
    );
}
