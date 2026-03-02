import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ProductService } from "@/services/productService";
import { PRODUCTS } from "@/lib/products";
import ProductDetailClient from "@/features/products/ProductDetailClient";

export const revalidate = 3600;

interface Props {
    params: Promise<{ slug: string }>;
}

// ─── SEO Dinámico ─────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await ProductService.getBySlug(slug);

    if (!product) {
        return { title: "Producto no encontrado | OMNIA" };
    }

    return {
        title: `${product.name} | OMNIA`,
        description: product.description,
        openGraph: {
            title: `${product.name} | OMNIA`,
            description: product.description,
            images: [{ url: product.image, width: 800, height: 1000 }],
        },
    };
}

// ─── Server Component ─────────────────────────────────────────────────────────
export default async function ProductPage({ params }: Props) {
    const { slug } = await params;

    // 1. Intentar desde DB real
    let product = await ProductService.getBySlug(slug);

    // 2. Fallback a mock si no hay DB
    if (!product) {
        const { getProductBySlug } = await import("@/lib/products");
        product = getProductBySlug(slug) ?? null;
    }

    // 3. 404 real si no existe en ninguna fuente
    if (!product) {
        notFound();
    }

    // Productos relacionados (de DB si disponible, sino mock)
    const allProducts = await ProductService.getAll();
    const source = allProducts.length > 0 ? allProducts : PRODUCTS;
    const relatedProducts = source
        .filter((p) => p.slug !== product!.slug && p.category === product!.category)
        .slice(0, 4);

    return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
