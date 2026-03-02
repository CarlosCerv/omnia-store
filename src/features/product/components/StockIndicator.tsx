"use client";

interface StockIndicatorProps {
    /** Número de unidades restantes en inventario */
    stock: number;
    /** Nombre opcional de la serie para personalizar el mensaje */
    series?: string;
    /** A partir de qué número de stock se considera "bajo" (default: 10) */
    lowStockThreshold?: number;
}

/**
 * Badge de escasez para la página de producto.
 * Solo se renderiza si el stock es bajo (≤ lowStockThreshold).
 * Mantiene la estética minimalista: sin íconos llamativos, texto tenue pero efectivo.
 */
export default function StockIndicator({
    stock,
    series = "Serie v1",
    lowStockThreshold = 10,
}: StockIndicatorProps) {
    // No mostrar si hay stock suficiente
    if (stock > lowStockThreshold) return null;

    // Urgencia creciente según el stock restante
    const isUrgent = stock <= 3;

    return (
        <div className="flex items-center gap-2 mt-1">
            {/* Punto de indicador: rojo si urgente, gris si bajo */}
            <span
                className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${isUrgent ? "bg-red-700" : "bg-nordic-muted"
                    }`}
            />
            <p
                className={`text-[11px] uppercase tracking-[0.15em] font-medium ${isUrgent ? "text-red-700" : "text-nordic-muted"
                    }`}
            >
                {stock === 0
                    ? `Agotado — ${series}`
                    : isUrgent
                        ? `Solo ${stock} ${stock === 1 ? "unidad restante" : "unidades restantes"} — ${series}`
                        : `Últimas ${stock} unidades — ${series}`}
            </p>
        </div>
    );
}
