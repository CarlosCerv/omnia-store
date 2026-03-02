"use server";

import { revalidatePath } from "next/cache";
import { ProductService } from "@/services/productService";
import { Product } from "@/types";

export async function createProduct(formData: FormData) {
    const raw = {
        slug: (formData.get("slug") as string).toLowerCase().replace(/\s+/g, "-"),
        name: formData.get("name") as string,
        price: parseFloat(formData.get("price") as string),
        category: formData.get("category") as string,
        image: formData.get("image") as string,
        images: [(formData.get("image") as string)],
        description: formData.get("description") as string,
        badge: (formData.get("badge") as string) || undefined,
        sizes: (formData.get("sizes") as string).split(",").map((s) => s.trim()).filter(Boolean),
        colors: JSON.parse((formData.get("colors") as string) || "[]"),
    };

    await ProductService.create(raw as Product);
    revalidatePath("/productos");
    revalidatePath("/dashboard/productos");
}

export async function updateProduct(slug: string, formData: FormData) {
    const updates = {
        name: formData.get("name") as string,
        price: parseFloat(formData.get("price") as string),
        category: formData.get("category") as string,
        image: formData.get("image") as string,
        description: formData.get("description") as string,
        badge: (formData.get("badge") as string) || undefined,
        sizes: (formData.get("sizes") as string).split(",").map((s) => s.trim()).filter(Boolean),
        colors: JSON.parse((formData.get("colors") as string) || "[]"),
    };

    await ProductService.update(slug, updates);
    revalidatePath("/productos");
    revalidatePath(`/productos/${slug}`);
    revalidatePath("/dashboard/productos");
}

export async function deleteProduct(slug: string) {
    await ProductService.delete(slug);
    revalidatePath("/productos");
    revalidatePath("/dashboard/productos");
}
