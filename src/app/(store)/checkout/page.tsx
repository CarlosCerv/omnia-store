import { Metadata } from "next";
import CheckoutFlow from "@/features/checkout/CheckoutFlow";

export const metadata: Metadata = {
    title: "Checkout | OMNIA",
    description: "Completa tu pedido de forma segura.",
    robots: { index: false },
};

export default function CheckoutPage() {
    return (
        <main className="min-h-screen bg-white pt-[104px] pb-24">
            <div className="max-w-[1200px] mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="border-b border-black pb-8 mb-16">
                    <a href="/" className="font-bold text-2xl tracking-[-0.05em]">OMNIA</a>
                </div>
                <CheckoutFlow />
            </div>
        </main>
    );
}
