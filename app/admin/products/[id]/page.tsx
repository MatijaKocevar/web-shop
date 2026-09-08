import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { listCategories } from "@/queries/categories";
import { getProductById } from "@/queries/products";
import { publicUrl } from "@/lib/storage";
import { ProductForm } from "../_components/product-form";
import { deleteProduct } from "../_actions/delete-product";
import { removeProductImage } from "../_actions/remove-product-image";
import { uploadProductImage } from "../_actions/upload-product-image";
import { uploadProductModel } from "../_actions/upload-product-model";

const inputClass =
    "rounded-md border bg-background px-3 py-2 text-sm w-full focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

type EditProductPageProps = {
    params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;
    const [product, categories] = await Promise.all([getProductById(id), listCategories()]);
    const t = await getTranslations("admin.products");
    const tCommon = await getTranslations("admin.common");

    if (!product) notFound();

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="mb-6 text-2xl font-semibold">{t("edit")}</h1>
                <ProductForm
                    product={{
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        description: product.description,
                        price: product.price,
                        type: product.type,
                        active: product.active,
                        categoryId: product.categoryId,
                    }}
                    categories={categories}
                />
            </div>

            <div className="max-w-xl">
                <Separator className="mb-6" />

                <h2 className="mb-3 font-semibold">{t("previewModel")}</h2>
                <p className="mb-3 text-sm text-muted-foreground">
                    {product.modelFile
                        ? t("current", { filename: product.modelFile.filename })
                        : t("noModel")}
                </p>
                <form action={uploadProductModel} className="flex items-center gap-2">
                    <input type="hidden" name="productId" value={product.id} />
                    <input type="file" name="model" accept=".stl,.3mf" className={inputClass} />
                    <Button type="submit" variant="outline">
                        {tCommon("upload")}
                    </Button>
                </form>

                <Separator className="my-6" />

                <h2 className="mb-3 font-semibold">{t("images")}</h2>
                <form action={uploadProductImage} className="mb-4 flex items-center gap-2">
                    <input type="hidden" name="productId" value={product.id} />
                    <input type="file" name="image" accept="image/*" className={inputClass} />
                    <Button type="submit" variant="outline">
                        {tCommon("upload")}
                    </Button>
                </form>

                {product.images.length > 0 && (
                    <ul className="grid grid-cols-3 gap-3">
                        {product.images.map((img) => (
                            <li key={img.id} className="relative overflow-hidden rounded-lg border">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={publicUrl(img.key)}
                                    alt={img.alt ?? ""}
                                    className="aspect-square w-full object-cover"
                                />
                                <form action={removeProductImage}>
                                    <input type="hidden" name="imageId" value={img.id} />
                                    <input type="hidden" name="productId" value={product.id} />
                                    <Button
                                        type="submit"
                                        variant="destructive"
                                        size="icon-sm"
                                        className="absolute top-1 right-1"
                                    >
                                        <Trash2 className="size-3.5" />
                                    </Button>
                                </form>
                            </li>
                        ))}
                    </ul>
                )}

                <Separator className="my-6" />

                <form action={deleteProduct}>
                    <input type="hidden" name="id" value={product.id} />
                    <Button type="submit" variant="destructive">
                        <Trash2 className="size-4" />
                        {t("deleteProduct")}
                    </Button>
                </form>
            </div>
        </div>
    );
}
