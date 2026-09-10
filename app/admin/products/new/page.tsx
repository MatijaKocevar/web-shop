import { listCategories } from "@/queries/categories";
import { ProductForm } from "../_components/product-form";

export default async function NewProductPage() {
    const categories = await listCategories();

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <ProductForm categories={categories} />
        </div>
    );
}
