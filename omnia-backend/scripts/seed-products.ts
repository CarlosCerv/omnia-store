#!/usr/bin/env tsx
/**
 * OMNIA Backend — Seed de Productos
 * Pobla la base de datos de Medusa con el catálogo inicial de OMNIA.
 *
 * Uso: npm run seed
 * Pre-requisito: Medusa corriendo y DB migrada (npm run migrate)
 */

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000";

// ─── Datos del catálogo OMNIA ─────────────────────────────────────────────────
const PRODUCTS = [
    {
        title: "Omnia Signature Black",
        handle: "omnia-signature-black",
        description:
            "Construida en algodón orgánico de alto gramaje (280 g/m²). Corte oversize estructurado. Costuras reforzadas en triple puntada. Tinte en prenda para profundidad de color.",
        status: "published",
        images: [{ url: "/images/products/signature-black.jpg" }],
        options: [
            { title: "Talla", values: ["XS", "S", "M", "L", "XL"] },
            { title: "Color", values: ["Onix"] },
        ],
        variants: [
            { title: "S / Onix", prices: [{ amount: 159000, currency_code: "mxn" }], options: { Talla: "S", Color: "Onix" }, inventory_quantity: 50 },
            { title: "M / Onix", prices: [{ amount: 159000, currency_code: "mxn" }], options: { Talla: "M", Color: "Onix" }, inventory_quantity: 80 },
            { title: "L / Onix", prices: [{ amount: 159000, currency_code: "mxn" }], options: { Talla: "L", Color: "Onix" }, inventory_quantity: 60 },
            { title: "XL / Onix", prices: [{ amount: 159000, currency_code: "mxn" }], options: { Talla: "XL", Color: "Onix" }, inventory_quantity: 40 },
        ],
        collection: "signature",
        tags: [{ value: "esencial" }, { value: "signature" }],
    },
    {
        title: "Omnia Signature White",
        handle: "omnia-signature-white",
        description:
            "La misma silueta de la Signature Black, ahora en blanco hueso. Algodón orgánico 280 g/m², lavado enzimático para suavidad inmediata. Costuras reforzadas.",
        status: "published",
        images: [{ url: "/images/products/signature-white.jpg" }],
        options: [
            { title: "Talla", values: ["XS", "S", "M", "L", "XL"] },
            { title: "Color", values: ["Hueso"] },
        ],
        variants: [
            { title: "S / Hueso", prices: [{ amount: 159000, currency_code: "mxn" }], options: { Talla: "S", Color: "Hueso" }, inventory_quantity: 50 },
            { title: "M / Hueso", prices: [{ amount: 159000, currency_code: "mxn" }], options: { Talla: "M", Color: "Hueso" }, inventory_quantity: 75 },
            { title: "L / Hueso", prices: [{ amount: 159000, currency_code: "mxn" }], options: { Talla: "L", Color: "Hueso" }, inventory_quantity: 55 },
            { title: "XL / Hueso", prices: [{ amount: 159000, currency_code: "mxn" }], options: { Talla: "XL", Color: "Hueso" }, inventory_quantity: 35 },
        ],
        collection: "signature",
        tags: [{ value: "esencial" }, { value: "signature" }],
    },
];

// ─── Autenticación con Medusa Admin API ───────────────────────────────────────
async function getAdminToken(): Promise<string> {
    const email = process.env.ADMIN_EMAIL || "admin@omnia.com";
    const password = process.env.ADMIN_PASSWORD || "admin1234";

    const res = await fetch(`${MEDUSA_URL}/auth/user/emailpass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Auth failed: ${err}`);
    }

    const { token } = await res.json();
    return token as string;
}

// ─── Crear o actualizar un producto ──────────────────────────────────────────
async function upsertProduct(token: string, product: typeof PRODUCTS[number]) {
    // Verificar si ya existe
    const existing = await fetch(
        `${MEDUSA_URL}/admin/products?handle=${product.handle}`,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then((r) => r.json());

    if (existing.products?.length > 0) {
        console.log(`  ⟳  Ya existe: ${product.title}`);
        return;
    }

    const res = await fetch(`${MEDUSA_URL}/admin/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
    });

    if (!res.ok) {
        const err = await res.text();
        console.error(`  ✗  Error creando ${product.title}: ${err}`);
        return;
    }

    console.log(`  ✓  Creado: ${product.title}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    console.log("\n╔══════════════════════════════════════════════╗");
    console.log("║   OMNIA — Seed de Productos                  ║");
    console.log("╚══════════════════════════════════════════════╝\n");

    console.log(`  Backend: ${MEDUSA_URL}\n`);

    let token: string;
    try {
        token = await getAdminToken();
        console.log("  ✓  Autenticado en Medusa Admin\n");
    } catch (err) {
        console.error("  ✗  No se pudo autenticar. ¿Está corriendo Medusa?\n", err);
        process.exit(1);
    }

    for (const product of PRODUCTS) {
        await upsertProduct(token, product);
    }

    console.log("\n  ✅  Seed completado.\n");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
