import { listCategories } from "@/queries/categories";
import { ProductForm } from "../_components/product-form";

export default async function NewProductPage() {
    const categories = await listCategories();

    return (
        <div>
            <h1 className="mb-6 text-2xl font-semibold">New product</h1>
            <ProductForm categories={categories} />
        </div>
    );
}
