import { z } from "zod";

// ─── Schema de Producto para creación/edición ─────────────────────────────────
export const ProductSchema = z.object({
    name: z.string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(120, "El nombre no puede superar 120 caracteres"),

    slug: z.string()
        .min(3, "El slug debe tener al menos 3 caracteres")
        .max(80)
        .regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones")
        .optional(),

    price: z.coerce.number()
        .positive("El precio debe ser mayor a 0")
        .max(999999, "El precio no puede superar $999,999 MXN"),

    category: z.enum(["signature", "basicos", "accesorios", "archivo"]),

    image: z.string()
        .url("Debe ser una URL válida"),

    description: z.string()
        .max(500, "La descripción no puede superar 500 caracteres")
        .optional()
        .or(z.literal("")),

    badge: z.string()
        .max(30, "El badge no puede superar 30 caracteres")
        .optional()
        .or(z.literal("")),

    sizes: z.array(z.string().min(1)).min(1, "Debe haber al menos una talla"),

    colors: z.array(z.object({
        name: z.string().min(1),
        hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Formato de color inválido (ej: #0A0A0A)"),
        border: z.boolean().optional(),
    })).min(1, "Debe haber al menos un color"),
});

export type ProductInput = z.infer<typeof ProductSchema>;

// ─── Schema de Checkout (datos de envío) ──────────────────────────────────────
export const ShippingSchema = z.object({
    name: z.string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(100),

    email: z.string()
        .email("Email inválido"),

    address: z.string()
        .min(8, "La dirección debe ser más detallada")
        .max(200),

    city: z.string()
        .min(2, "Ciudad inválida")
        .max(80),

    state: z.string()
        .min(2, "Estado inválido")
        .max(80),

    zip: z.string()
        .regex(/^\d{5}$/, "El código postal debe tener 5 dígitos"),
});

export type ShippingInput = z.infer<typeof ShippingSchema>;

// ─── Helper: parsear FormData con un schema Zod ───────────────────────────────
export function parseFormData<T extends z.ZodTypeAny>(
    schema: T,
    formData: FormData
): { data: z.infer<T>; errors: null } | { data: null; errors: Record<string, string[]> } {
    const raw = Object.fromEntries(formData.entries());
    const result = schema.safeParse(raw);

    if (!result.success) {
        const errors: Record<string, string[]> = {};
        result.error.issues.forEach((issue) => {
            const key = issue.path.join(".");
            if (!errors[key]) errors[key] = [];
            errors[key].push(issue.message);
        });
        return { data: null, errors };
    }

    return { data: result.data, errors: null };
}
