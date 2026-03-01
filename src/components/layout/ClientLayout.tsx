"use client";

import { CartProvider } from "@/context/CartProvider";
import Header from "@/components/layout/Header";
import SlideOutCart from "@/features/cart/components/SlideOutCart";

import { SessionProvider } from "next-auth/react"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <CartProvider>
                <Header />
                {children}
                <SlideOutCart />
            </CartProvider>
        </SessionProvider>
    );
}
