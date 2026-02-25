"use client";

import { CartProvider } from "@/context/CartProvider";
import Header from "@/components/layout/Header";
import SlideOutCart from "@/features/cart/components/SlideOutCart";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <Header />
            {children}
            <SlideOutCart />
        </CartProvider>
    );
}
