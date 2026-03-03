/**
 * OMNIA — Cliente de la Medusa Store API
 *
 * Este módulo conecta el storefront Next.js a la API de Medusa.js.
 * Se usa como fuente de datos primaria cuando MEDUSA_BACKEND_URL está configurado.
 * Prisma actúa como fallback si Medusa no está disponible.
 */

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL;
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

// ─── Helper de fetch autenticado ──────────────────────────────────────────────
async function medusaFetch<T>(path: string, options?: RequestInit): Promise<T | null> {
    if (!MEDUSA_URL) return null;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    // Publishable API Key: requerida en Medusa v2 para el store API
    if (PUBLISHABLE_KEY) {
        headers["x-publishable-api-key"] = PUBLISHABLE_KEY;
    }

    try {
        const res = await fetch(`${MEDUSA_URL}${path}`, {
            ...options,
            headers: { ...headers, ...(options?.headers as Record<string, string> || {}) },
            next: { revalidate: 3600 }, // ISR compatible con Next.js
        });

        if (!res.ok) return null;
        return res.json() as T;
    } catch {
        return null;
    }
}

// ─── Tipos de respuesta de Medusa Store API ───────────────────────────────────
interface MedusaProduct {
    id: string;
    handle: string;
    title: string;
    description: string | null;
    thumbnail: string | null;
    images: { url: string }[];
    variants: {
        id: string;
        title: string;
        prices: { amount: number; currency_code: string }[];
        options: { value: string; option: { title: string } }[];
        inventory_quantity: number;
    }[];
    collection: { handle: string; title: string } | null;
    tags: { value: string }[];
}

// ─── Normalizar producto Medusa → formato interno OMNIA ───────────────────────
function normalizeProduct(p: MedusaProduct) {
    // Extraer precio base (primera variante, en MXN, dividir centavos)
    const mxnPrice = p.variants[0]?.prices.find(
        (pr) => pr.currency_code === "mxn"
    );
    const price = mxnPrice ? mxnPrice.amount / 100 : 0;

    // Tallas únicas de las variantes
    const sizes = [
        ...new Set(
            p.variants
                .map((v) => v.options.find((o) => o.option.title === "Talla")?.value)
                .filter(Boolean) as string[]
        ),
    ];

    // Colores únicos de las variantes
    const colorNames = [
        ...new Set(
            p.variants
                .map((v) => v.options.find((o) => o.option.title === "Color")?.value)
                .filter(Boolean) as string[]
        ),
    ];
    const colors = colorNames.map((name) => ({
        name,
        hex: name === "Onix" ? "#0A0A0A" : name === "Hueso" ? "#F5F0E8" : "#888888",
        border: name !== "Onix",
    }));

    return {
        id: p.id,
        slug: p.handle,
        name: p.title,
        price,
        description: p.description ?? "",
        image: p.thumbnail ?? p.images[0]?.url ?? "/images/placeholder.jpg",
        images: p.images.map((img) => img.url),
        category: p.collection?.handle ?? "signature",
        badge: p.tags[0]?.value ?? "",
        sizes,
        colors,
        inStock: p.variants.some((v) => v.inventory_quantity > 0),
    };
}

// ─── API pública del cliente ──────────────────────────────────────────────────
export const MedusaClient = {
    /** Retorna todos los productos publicados */
    async getAll() {
        const data = await medusaFetch<{ products: MedusaProduct[] }>(
            "/store/products?status=published&limit=100"
        );
        if (!data?.products) return null;
        return data.products.map(normalizeProduct);
    },

    /** Retorna un producto por su handle (slug) */
    async getBySlug(slug: string) {
        const data = await medusaFetch<{ products: MedusaProduct[] }>(
            `/store/products?handle=${slug}&status=published`
        );
        if (!data?.products?.length) return null;
        return normalizeProduct(data.products[0]);
    },

    /** Retorna productos filtrados por colección */
    async getByCategory(categorySlug: string) {
        if (categorySlug === "todo") return this.getAll();
        const data = await medusaFetch<{ products: MedusaProduct[] }>(
            `/store/products?collection_handle=${categorySlug}&status=published&limit=100`
        );
        if (!data?.products) return null;
        return data.products.map(normalizeProduct);
    },

    /** Verifica si el backend de Medusa está disponible */
    async isAvailable(): Promise<boolean> {
        if (!MEDUSA_URL) return false;
        try {
            const res = await fetch(`${MEDUSA_URL}/health`, { cache: "no-store" });
            return res.ok;
        } catch {
            return false;
        }
    },
};
