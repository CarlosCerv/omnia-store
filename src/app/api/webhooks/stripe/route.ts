import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { sendOrderConfirmation } from "@/lib/email";

function getStripe() {
    const { default: Stripe } = require("stripe");
    return new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-02-24.acacia",
    });
}

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const stripe = getStripe();
    let event: any;

    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
        console.error("[Webhook] Invalid signature:", err.message);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // ─── Pago Exitoso ────────────────────────────────────────────────
    if (event.type === "payment_intent.succeeded") {
        const pi = event.data.object;
        const meta = pi.metadata || {};

        try {
            const prisma = getPrisma();
            const items: any[] = JSON.parse(meta.items || "[]");

            const order = await prisma.order.create({
                data: {
                    customerName: meta.customerName || "Cliente",
                    customerEmail: meta.customerEmail || "",
                    total: pi.amount / 100,
                    status: "Procesando",
                    stripePaymentId: pi.id,
                    shippingAddress: JSON.parse(meta.shippingAddress || "{}"),
                    items: {
                        create: items.map((item: any) => ({
                            productSlug: item.slug,
                            productName: item.name,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
            });

            const shipping = JSON.parse(meta.shippingAddress || "{}");
            await sendOrderConfirmation({
                to: meta.customerEmail,
                customerName: meta.customerName,
                orderNumber: order.id.slice(-8).toUpperCase(),
                items: items.map((item: any) => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size,
                    color: item.color,
                })),
                total: pi.amount / 100,
                shippingAddress: {
                    address: shipping.address,
                    city: shipping.city,
                    state: shipping.state,
                    zip: shipping.zip,
                },
            });

            console.log(`[Webhook] Order ${order.id} created successfully`);
        } catch (err) {
            console.error("[Webhook] Error creating order:", err);
        }
    }

    if (event.type === "payment_intent.payment_failed") {
        const pi = event.data.object;
        console.warn(`[Webhook] Payment failed for PI: ${pi.id}`);
    }

    return NextResponse.json({ received: true });
}
