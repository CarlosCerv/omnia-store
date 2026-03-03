import { getPrisma } from "@/lib/prisma";
import { MedusaClient } from "@/lib/medusaClient";
import { Product as ProductType, Color } from "@/types";
import { CATEGORIES } from "@/lib/products";

/**
 * ProductService — Capa de datos de productos.
 *
 * Jerarquía de fuentes (en orden de preferencia):
 *   1. Medusa Store API  → si MEDUSA_BACKEND_URL está configurado
 *   2. Prisma/PostgreSQL → si DATABASE_URL está configurado
 *   3. Mock (vacío)      → si ninguna fuente está disponible
 */
export class ProductService {

  // ─── READ ────────────────────────────────────────────────────────────────

  static async getAll(): Promise<ProductType[]> {
    // 1. Intentar Medusa
    const medusaProducts = await MedusaClient.getAll();
    if (medusaProducts) return medusaProducts as unknown as ProductType[];

    // 2. Fallback a Prisma
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("mock")) return [];
    const products = await getPrisma().product.findMany({ orderBy: { createdAt: "desc" } });
    return products as unknown as ProductType[];
  }

  static async getBySlug(slug: string): Promise<ProductType | null> {
    // 1. Intentar Medusa
    const medusaProduct = await MedusaClient.getBySlug(slug);
    if (medusaProduct) return medusaProduct as unknown as ProductType;

    // 2. Fallback a Prisma
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("mock")) return null;
    const product = await getPrisma().product.findUnique({ where: { slug } });
    return product as unknown as ProductType | null;
  }

  static async getByCategory(categorySlug: string): Promise<ProductType[]> {
    if (categorySlug === "todo") return this.getAll();

    // 1. Intentar Medusa
    const medusaProducts = await MedusaClient.getByCategory(categorySlug);
    if (medusaProducts) return medusaProducts as unknown as ProductType[];

    // 2. Fallback a Prisma
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("mock")) return [];
    const products = await getPrisma().product.findMany({
      where: { category: categorySlug },
      orderBy: { createdAt: "desc" },
    });
    return products as unknown as ProductType[];
  }

  static async getCategories() {
    return CATEGORIES;
  }

  // ─── WRITE (solo Prisma — Medusa tiene su propio Admin API) ──────────────

  static async create(product: ProductType) {
    const newProduct = await getPrisma().product.create({
      data: {
        slug: product.slug,
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.image,
        images: product.images,
        description: product.description,
        badge: product.badge,
        colors: product.colors as any,
        sizes: product.sizes,
      },
    });
    return newProduct as unknown as ProductType;
  }

  static async update(slug: string, updates: Partial<ProductType>) {
    const updatedProduct = await getPrisma().product.update({
      where: { slug },
      data: { ...updates as any },
    });
    return updatedProduct as unknown as ProductType;
  }

  static async delete(slug: string) {
    await getPrisma().product.delete({ where: { slug } });
    return true;
  }

  // ─── Estadísticas (solo Prisma) ───────────────────────────────────────────
  static async getStats() {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("mock")) {
      return { totalProducts: 0, totalSales: 0, totalOrders: 0 };
    }
    const prisma = getPrisma();
    const [totalProducts, totalOrdersCount, aggregateSales] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
    ]);

    return {
      totalProducts,
      totalSales: aggregateSales._sum.total || 0,
      totalOrders: totalOrdersCount,
    };
  }
}
