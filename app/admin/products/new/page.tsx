import { getTranslations } from "next-intl/server";
import { listCategories } from "@/queries/categories";
import { ProductForm } from "../_components/product-form";

export default async function NewProductPage() {
    const categories = await listCategories();
    const t = await getTranslations("admin.products");

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <h1 className="mb-6 text-2xl font-semibold">{t("newTitle")}</h1>
            <ProductForm categories={categories} />
        </div>
    );
}
