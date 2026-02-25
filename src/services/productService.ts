import prisma from "@/lib/prisma";
import { Product as ProductType, Color } from "@/types";
import { CATEGORIES } from "@/lib/products";

export class ProductService {

  static async getAll() {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return products as unknown as ProductType[];
  }

  static async getBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug }
    });
    return product as unknown as ProductType | null;
  }

  static async getByCategory(categorySlug: string) {
    if (categorySlug === "todo") return this.getAll();
    const products = await prisma.product.findMany({
      where: { category: categorySlug },
      orderBy: { createdAt: 'desc' }
    });
    return products as unknown as ProductType[];
  }

  static async getCategories() {
    // Categories are still static as per current implementation plan
    return CATEGORIES;
  }

  static async create(product: ProductType) {
    const newProduct = await prisma.product.create({
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
      }
    });
    return newProduct as unknown as ProductType;
  }

  static async update(slug: string, updates: Partial<ProductType>) {
    const updatedProduct = await prisma.product.update({
      where: { slug },
      data: {
        ...updates as any
      }
    });
    return updatedProduct as unknown as ProductType;
  }

  static async delete(slug: string) {
    await prisma.product.delete({
      where: { slug }
    });
    return true;
  }

  static async getStats() {
    // Real stats from DB
    const totalProducts = await prisma.product.count();
    const totalOrdersCount = await prisma.order.count();
    const aggregateSales = await prisma.order.aggregate({
      _sum: {
        total: true
      }
    });

    return {
      totalProducts,
      totalSales: aggregateSales._sum.total || 0,
      totalOrders: totalOrdersCount,
    };
  }
}
