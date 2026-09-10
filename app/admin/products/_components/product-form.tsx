import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button, buttonVariants } from "@/components/ui/button";
import { saveProduct } from "../_actions/save-product";
import type { Category } from "../_types/category";
import type { Product } from "../_types/product";

const inputClass =
    "rounded-md border bg-background px-3 py-2 text-sm w-full focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

type ProductFormProps = {
    product?: Product;
    categories: Category[];
};

export async function ProductForm({ product, categories }: ProductFormProps) {
    const t = await getTranslations("admin.products");
    const tCommon = await getTranslations("admin.common");
    const tType = await getTranslations("productType");

    return (
        <form action={saveProduct} className="flex max-w-xl flex-col gap-4">
            {product && <input type="hidden" name="id" value={product.id} />}

            <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium">{tCommon("name")}</span>
                <input
                    className={inputClass}
                    name="name"
                    defaultValue={product?.name ?? ""}
                    required
                />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium">{t("slug")}</span>
                <input
                    className={inputClass}
                    name="slug"
                    defaultValue={product?.slug ?? ""}
                    placeholder={t("slugPlaceholder")}
                />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium">{t("description")}</span>
                <textarea
                    className={inputClass}
                    name="description"
                    rows={4}
                    defaultValue={product?.description ?? ""}
                />
            </label>

            <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">{t("priceEur")}</span>
                    <input
                        className={inputClass}
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={product?.price ?? ""}
                    />
                </label>

                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">{tCommon("type")}</span>
                    <select
                        className={inputClass}
                        name="type"
                        defaultValue={product?.type ?? "READY_MADE"}
                    >
                        <option value="READY_MADE">{tType("READY_MADE")}</option>
                        <option value="CUSTOM_PRINT">{tType("CUSTOM_PRINT")}</option>
                    </select>
                </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">{tCommon("category")}</span>
                    <select
                        className={inputClass}
                        name="categoryId"
                        defaultValue={product?.categoryId ?? ""}
                    >
                        <option value="">{tCommon("none")}</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">{t("newCategory")}</span>
                    <input
                        className={inputClass}
                        name="newCategory"
                        placeholder={t("newCategoryPlaceholder")}
                    />
                </label>
            </div>

            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="active" defaultChecked={product?.active ?? true} />
                <span>{tCommon("active")}</span>
            </label>

            <div className="flex items-center justify-end gap-2">
                <Link href="/admin/products" className={buttonVariants({ variant: "ghost" })}>
                    {tCommon("cancel")}
                </Link>
                <Button type="submit">{product ? tCommon("save") : t("createProduct")}</Button>
            </div>
        </form>
    );
}
