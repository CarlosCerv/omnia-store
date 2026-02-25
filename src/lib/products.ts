import { Product } from "@/types";

export function formatPrice(price: number) {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
    }).format(price);
}

export function getProductBySlug(slug: string) {
    return PRODUCTS.find((p) => p.slug === slug);
}

export const CATEGORIES = [
    { slug: "signature", name: "Colección Signature", subtitle: "La esencia del minimalismo.", image: "/images/products/signature-black-orig.png" },
];

const DEFAULT_COLORS = [
    { name: "Onix", hex: "#0A0A0A" },
    { name: "Hueso", hex: "#FAFAF8", border: true },
];

const DEFAULT_SIZES = ["S", "M", "L", "XL"];

export const PRODUCTS: Product[] = [
    {
        slug: "omnia-signature-black",
        name: "Omnia Signature Black",
        price: 1800,
        category: "signature",
        image: "/images/products/signature-black-orig.png",
        images: [
            "/images/products/signature-black-orig.png",
        ],
        colors: [{ name: "Onix", hex: "#0A0A0A" }],
        sizes: DEFAULT_SIZES,
        description: "Silueta de algodón orgánico de alto gramaje. Diseñada para una estructura permanente y un ajuste arquitectónico.",
        badge: "Esencial",
    },
    {
        slug: "omnia-signature-white",
        name: "Omnia Signature White",
        price: 1800,
        category: "signature",
        image: "/images/products/signature-white-orig.png",
        images: [
            "/images/products/signature-white-orig.png",
        ],
        colors: [{ name: "Hueso", hex: "#FAFAF8", border: true }],
        sizes: DEFAULT_SIZES,
        description: "Silueta minimalista en blanco puro. Confeccionada con fibras de primera calidad para una caída inigualable.",
        badge: "Esencial",
    },
];
