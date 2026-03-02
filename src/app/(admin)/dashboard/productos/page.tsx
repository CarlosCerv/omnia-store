import { ProductService } from "@/services/productService";
import { PRODUCTS } from "@/lib/products";
import ProductsTable from "./ProductsTable";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
    // Intentar desde DB real, con fallback a mock
    let products = await ProductService.getAll();
    if (products.length === 0) {
        products = PRODUCTS as any;
    }

    return <ProductsTable products={products} />;
}
