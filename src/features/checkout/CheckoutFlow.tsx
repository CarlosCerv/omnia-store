"use client";

import { useState } from "react";
import { useCart } from "@/context/CartProvider";
import { formatPrice } from "@/lib/products";
import { CheckCircle, ArrowRight, Loader2, CreditCard, Building2 } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface ShippingData {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
}

// ─── Banco Config ─────────────────────────────────────────────────────────────
const BANK_INFO = {
    bank: "BBVA México",
    clabe: "012 320 0123456789 01",
    beneficiary: "OMNIA Nordic Gallery S.A. de C.V.",
    reference: "OMNIA-PEDIDO",
};

// ─── Step 1: Datos de Envío ───────────────────────────────────────────────────
function ShippingStep({ onNext }: { onNext: (data: ShippingData) => void }) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onNext({
            name: fd.get("name") as string,
            email: fd.get("email") as string,
            address: fd.get("address") as string,
            city: fd.get("city") as string,
            state: fd.get("state") as string,
            zip: fd.get("zip") as string,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-8">Datos de Envío</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nombre completo" name="name" required />
                <Field label="Email" name="email" type="email" required />
            </div>
            <Field label="Dirección" name="address" placeholder="Calle, número, colonia" required />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Field label="Ciudad" name="city" required />
                <Field label="Estado" name="state" required />
                <Field label="Código Postal" name="zip" required />
            </div>

            <button
                type="submit"
                className="w-full h-14 bg-black text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-neutral-800 transition-colors flex items-center justify-center gap-3 mt-4"
            >
                Continuar al Pago <ArrowRight size={16} />
            </button>
        </form>
    );
}

// ─── Step 2: Instrucciones de Transferencia ───────────────────────────────────
function PaymentStep({
    shipping,
    orderId,
    total,
    onConfirm,
    isProcessing,
}: {
    shipping: ShippingData;
    orderId: string;
    total: number;
    onConfirm: () => void;
    isProcessing: boolean;
}) {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-2">Método de Pago</h2>
                <p className="text-sm text-nordic-muted">Realiza una transferencia bancaria con los siguientes datos.</p>
            </div>

            {/* Datos bancarios */}
            <div className="border border-nordic-border p-6 space-y-4 bg-neutral-50">
                <div className="flex items-center gap-3 mb-2">
                    <Building2 size={18} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{BANK_INFO.bank}</span>
                </div>

                <BankRow label="Beneficiario" value={BANK_INFO.beneficiary} />
                <BankRow label="CLABE" value={BANK_INFO.clabe} copiable />
                <BankRow label="Referencia" value={`${BANK_INFO.reference}-${orderId}`} copiable />
                <BankRow label="Monto exacto" value={`$${formatPrice(total)} MXN`} highlight />
            </div>

            {/* Aviso */}
            <div className="border-l-4 border-l-amber-400 pl-4 py-2">
                <p className="text-xs text-neutral-700 leading-relaxed">
                    <strong>Importante:</strong> tu pedido se procesará una vez que recibamos la
                    transferencia (1-2 días hábiles). Asegúrate de incluir la referencia exacta
                    y enviar el comprobante a <strong>studio@omnia.com</strong>
                </p>
            </div>

            <button
                onClick={onConfirm}
                disabled={isProcessing}
                className="w-full h-14 bg-black text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-neutral-800 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
            >
                {isProcessing
                    ? <><Loader2 size={16} className="animate-spin" /> Registrando pedido...</>
                    : <><CreditCard size={16} /> He realizado la transferencia</>
                }
            </button>
        </div>
    );
}

// ─── Step 3: Confirmación ─────────────────────────────────────────────────────
function ConfirmationStep({ orderId, customerName }: { orderId: string; customerName: string }) {
    return (
        <div className="text-center py-12 space-y-8">
            <CheckCircle className="mx-auto text-black" size={48} strokeWidth={1} />
            <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-nordic-muted">Pedido Registrado</p>
                <h2 className="text-4xl font-bold tracking-tighter">¡Gracias, {customerName.split(" ")[0]}!</h2>
                <p className="text-nordic-muted text-sm leading-relaxed max-w-sm mx-auto">
                    Tu pedido <strong>#{orderId}</strong> ha sido registrado. Recibirás un email de confirmación
                    con los datos bancarios. Una vez recibida tu transferencia, confirmamos y enviamos.
                </p>
            </div>
            <a
                href="/productos"
                className="inline-flex items-center gap-3 h-12 px-8 border border-black text-[11px] font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-colors"
            >
                Seguir Comprando
            </a>
        </div>
    );
}

// ─── Main CheckoutFlow ────────────────────────────────────────────────────────
export default function CheckoutFlow() {
    const { items, cartTotal, clearCart } = useCart();
    const [step, setStep] = useState<"shipping" | "payment" | "confirmation">("shipping");
    const [shipping, setShipping] = useState<ShippingData | null>(null);
    const [orderId, setOrderId] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [pendingOrderId, setPendingOrderId] = useState("");

    const handleShippingNext = (data: ShippingData) => {
        setShipping(data);
        // Generar ID de referencia de pedido único
        const id = Math.random().toString(36).slice(2, 8).toUpperCase();
        setPendingOrderId(id);
        setStep("payment");
    };

    const handleTransferConfirm = async () => {
        if (!shipping) return;
        setIsProcessing(true);

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId: pendingOrderId,
                    shipping,
                    items: items.map((i) => ({
                        slug: i.slug,
                        name: i.name,
                        price: i.price,
                        quantity: i.quantity,
                        size: i.size,
                        color: i.color,
                    })),
                    total: cartTotal,
                    paymentMethod: "bank_transfer",
                }),
            });

            if (res.ok) {
                clearCart?.();
                setOrderId(pendingOrderId);
                setStep("confirmation");
            } else {
                throw new Error("Error al registrar el pedido");
            }
        } catch (err) {
            alert("Hubo un error al registrar tu pedido. Intenta de nuevo.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0 && step !== "confirmation") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
                <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-nordic-muted">Tu bolsa está vacía</p>
                <a href="/productos" className="underline text-sm">Explorar productos</a>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 xl:gap-24">

            {/* ─── Left: Form Steps ─── */}
            <div className="lg:col-span-3">
                {/* Step indicators */}
                {step !== "confirmation" && (
                    <div className="flex items-center gap-4 mb-12">
                        {(["shipping", "payment"] as const).map((s, i) => (
                            <div key={s} className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-colors ${step === s ? "bg-black text-white" : i < ["shipping", "payment"].indexOf(step) ? "bg-black/20 text-black" : "bg-neutral-100 text-neutral-400"}`}>
                                    {i + 1}
                                </div>
                                <span className={`text-[10px] uppercase tracking-[0.3em] font-bold ${step === s ? "text-black" : "text-nordic-muted"}`}>
                                    {s === "shipping" ? "Envío" : "Pago"}
                                </span>
                                {i < 1 && <div className="w-8 h-px bg-neutral-200" />}
                            </div>
                        ))}
                    </div>
                )}

                {step === "shipping" && <ShippingStep onNext={handleShippingNext} />}
                {step === "payment" && shipping && (
                    <PaymentStep
                        shipping={shipping}
                        orderId={pendingOrderId}
                        total={cartTotal}
                        onConfirm={handleTransferConfirm}
                        isProcessing={isProcessing}
                    />
                )}
                {step === "confirmation" && (
                    <ConfirmationStep orderId={orderId} customerName={shipping?.name || "Cliente"} />
                )}
            </div>

            {/* ─── Right: Order Summary ─── */}
            {step !== "confirmation" && (
                <div className="lg:col-span-2">
                    <div className="border border-nordic-border p-8 space-y-6 sticky top-32">
                        <h3 className="text-[10px] uppercase tracking-[0.4em] font-black border-b border-nordic-border pb-4">
                            Tu Pedido
                        </h3>
                        <ul className="space-y-4">
                            {items.map((item) => (
                                <li key={`${item.slug}-${item.size}-${item.color}`} className="flex gap-4">
                                    <div className="w-16 h-20 bg-[#EBEBEB] shrink-0 overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold uppercase tracking-tight">{item.name}</p>
                                        <p className="text-[10px] text-nordic-muted mt-1">
                                            Talla {item.size} · {item.color} · Qty {item.quantity}
                                        </p>
                                        <p className="text-sm font-bold mt-2">{formatPrice(item.price * item.quantity)} MXN</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t border-nordic-border pt-4 flex justify-between items-baseline">
                            <span className="text-[10px] uppercase tracking-widest font-medium text-nordic-muted">Total</span>
                            <span className="text-2xl font-bold">{formatPrice(cartTotal)} MXN</span>
                        </div>
                        <p className="text-[10px] text-nordic-muted">Impuestos incluidos. Envío calculado al procesar el pedido.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Helper Components ────────────────────────────────────────────────────────
function Field({ label, name, type = "text", placeholder, required }: {
    label: string; name: string; type?: string; placeholder?: string; required?: boolean;
}) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-600">{label}</label>
            <input
                type={type} name={name} placeholder={placeholder} required={required}
                className="w-full border border-nordic-border px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-white"
            />
        </div>
    );
}

function BankRow({ label, value, copiable = false, highlight = false }: {
    label: string; value: string; copiable?: boolean; highlight?: boolean;
}) {
    const copy = () => navigator.clipboard.writeText(value);
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold shrink-0">{label}</span>
            <span className={`text-sm font-mono text-right ${highlight ? "font-black text-base" : "font-medium"}`}>
                {value}
                {copiable && (
                    <button onClick={copy} className="ml-2 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-black transition-colors font-sans">
                        copiar
                    </button>
                )}
            </span>
        </div>
    );
}
