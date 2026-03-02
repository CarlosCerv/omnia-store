import { NextRequest, NextResponse } from "next/server";

function getStripe() {
    const { default: Stripe } = require("stripe");
    return new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-02-24.acacia",
    });
}

export async function POST(req: NextRequest) {
    try {
        const { amount, currency = "mxn", metadata } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Monto inválido" }, { status: 400 });
        }

        const stripe = getStripe();

        // Stripe maneja centavos — multiplicar por 100
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency,
            metadata,
            automatic_payment_methods: { enabled: true },
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (err: any) {
        console.error("[/api/checkout] Error:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
