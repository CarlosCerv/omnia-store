import { Resend } from "resend";

function getResend() {
    return new Resend(process.env.RESEND_API_KEY);
}


interface OrderConfirmationData {
    to: string;
    customerName: string;
    orderNumber: string;
    items: { name: string; quantity: number; price: number; size: string; color: string }[];
    total: number;
    shippingAddress: {
        address: string;
        city: string;
        state: string;
        zip: string;
    };
}

export async function sendOrderConfirmation(data: OrderConfirmationData) {
    const itemsHtml = data.items
        .map(
            (item) => `
        <tr>
            <td style="padding:8px 0;border-bottom:1px solid #f0f0f0">
                <strong>${item.name}</strong><br/>
                <span style="color:#888;font-size:12px">Talla ${item.size} · ${item.color} · Qty ${item.quantity}</span>
            </td>
            <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:bold">
                $${(item.price * item.quantity).toLocaleString("es-MX")} MXN
            </td>
        </tr>`
        )
        .join("");

    const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#f9f9f9;margin:0;padding:40px 20px">
        <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e8e8e8">
            <!-- Header -->
            <div style="padding:40px 40px 24px;border-bottom:2px solid #000">
                <p style="margin:0;font-size:10px;letter-spacing:0.5em;text-transform:uppercase;color:#888">Confirmación de Pedido</p>
                <h1 style="margin:8px 0 0;font-size:32px;letter-spacing:-0.04em;font-weight:900">OMNIA</h1>
            </div>

            <!-- Body -->
            <div style="padding:40px">
                <p style="margin:0 0 8px;font-size:14px;color:#333">Hola <strong>${data.customerName}</strong>,</p>
                <p style="margin:0 0 32px;font-size:14px;color:#555;line-height:1.6">
                    Tu pedido ha sido confirmado. Lo empezaremos a preparar de inmediato.
                </p>

                <p style="margin:0 0 12px;font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:#888;font-weight:bold">
                    Pedido #${data.orderNumber}
                </p>

                <!-- Items -->
                <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
                    ${itemsHtml}
                </table>

                <!-- Total -->
                <div style="display:flex;justify-content:space-between;padding:16px 0;border-top:2px solid #000">
                    <span style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;font-weight:bold">Total</span>
                    <span style="font-size:18px;font-weight:900">$${data.total.toLocaleString("es-MX")} MXN</span>
                </div>

                <!-- Shipping -->
                <div style="background:#f9f9f9;padding:20px;margin-top:24px">
                    <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:#888;font-weight:bold">Dirección de Envío</p>
                    <p style="margin:0;font-size:14px;color:#333;line-height:1.6">
                        ${data.shippingAddress.address}<br/>
                        ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}
                    </p>
                </div>

                <p style="margin:32px 0 0;font-size:13px;color:#888;line-height:1.6">
                    Recibirás un email com la guía de rastreo cuando tu pedido sea despachado.<br/>
                    Para dudas escríbenos a <a href="mailto:${process.env.STORE_EMAIL}" style="color:#000">${process.env.STORE_EMAIL}</a>
                </p>
            </div>

            <!-- Footer -->
            <div style="padding:24px 40px;border-top:1px solid #e8e8e8;background:#f9f9f9">
                <p style="margin:0;font-size:10px;color:#aaa;letter-spacing:0.3em;text-transform:uppercase">
                    © 2026 OMNIA Studio México — Todos los derechos reservados
                </p>
            </div>
        </div>
    </body>
    </html>`;

    return getResend().emails.send({
        from: `OMNIA Studio <${process.env.STORE_EMAIL || "onboarding@resend.dev"}>`,
        to: data.to,
        subject: `Pedido confirmado #${data.orderNumber} — OMNIA`,
        html,
    });
}
