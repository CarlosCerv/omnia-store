"use server";

import { revalidatePath } from "next/cache";
import { ProductService } from "@/services/productService";
import { ProductSchema } from "@/lib/validations";

// ─── Helper: parsear y validar FormData de Producto ───────────────────────────
function parseProductFormData(formData: FormData, includeSlug = true) {
    const sizesRaw = (formData.get("sizes") as string) || "";
    const colorsRaw = (formData.get("colors") as string) || "[]";

    const raw: Record<string, unknown> = {
        name: formData.get("name"),
        price: formData.get("price"),    // z.coerce.number() lo convierte
        category: formData.get("category"),
        image: formData.get("image"),
        description: formData.get("description") || undefined,
        badge: formData.get("badge") || undefined,
        sizes: sizesRaw.split(",").map((s) => s.trim()).filter(Boolean),
        colors: (() => { try { return JSON.parse(colorsRaw); } catch { return []; } })(),
    };

    if (includeSlug) {
        raw.slug = (formData.get("slug") as string || "")
            .toLowerCase()
            .replace(/\s+/g, "-");
    }

    const schema = includeSlug ? ProductSchema : ProductSchema.omit({ slug: true });
    const result = schema.safeParse(raw);

    if (!result.success) {
        const messages = result.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join(" | ");
        throw new Error(`Validación fallida: ${messages}`);
    }

    return result.data;
}

export async function createProduct(formData: FormData) {
    const data = parseProductFormData(formData, true);
    // slug is present when includeSlug=true — cast to access it safely
    const slug: string = (data as any).slug ?? "";
    await ProductService.create({
        slug,
        name: data.name,
        price: data.price,
        category: data.category,
        image: data.image,
        images: [data.image],
        description: data.description ?? "",
        badge: data.badge ?? "",
        colors: data.colors,
        sizes: data.sizes,
    });
    revalidatePath("/productos");
    revalidatePath("/dashboard/productos");
}

export async function updateProduct(slug: string, formData: FormData) {
    const data = parseProductFormData(formData, false);
    await ProductService.update(slug, {
        name: data.name,
        price: data.price,
        category: data.category,
        image: data.image,
        images: [data.image],
        description: data.description ?? "",
        badge: data.badge ?? "",
        colors: data.colors,
        sizes: data.sizes,
    });
    revalidatePath("/productos");
    revalidatePath(`/productos/${slug}`);
    revalidatePath("/dashboard/productos");
}

export async function deleteProduct(slug: string) {
    if (!slug || typeof slug !== "string") {
        throw new Error("Slug de producto inválido");
    }
    await ProductService.delete(slug);
    revalidatePath("/productos");
    revalidatePath("/dashboard/productos");
}
