import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { sendOrderConfirmation } from "@/lib/email";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { orderId, shipping, items, total, paymentMethod } = data;

        if (!orderId || !shipping || !items || !total) {
            return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
        }

        const prisma = getPrisma();

        // 1. Crear Orden en Base de Datos
        const order = await prisma.order.create({
            data: {
                total,
                status: "pending",
                items: JSON.stringify(items),
                customerName: shipping.name,
                customerEmail: shipping.email,
                shippingAddress: shipping,
                // Utilizamos el orderId asignado en el frontend o generamos uno si no usáramos Prisma
                // Por ahora Prisma usa autoincrement ID, podemos guardar el `orderId`
                // en `stripePaymentId` o crear una columna `reference`.
                // Dado como tenemos el Schema, si `stripePaymentId` es nullable,
                // lo usamos para la referencia de transferencia:
                stripePaymentId: `BANK_TRANSFER_${orderId}`,
            },
        });

        // 2. Enviar Confirmación por Email (Resend)
        if (process.env.RESEND_API_KEY) {
            await sendOrderConfirmation({
                to: shipping.email,
                customerName: shipping.name,
                orderNumber: orderId,
                items,
                total,
                shippingAddress: shipping,
            });
        } else {
            console.warn("No RESEND_API_KEY configured. Skipping email.");
        }

        return NextResponse.json({ success: true, orderId: order.id });
    } catch (err: any) {
        console.error("[/api/checkout] Error:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
