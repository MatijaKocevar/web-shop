import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { AdminFormDialog } from "@/components/admin-form-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { publicUrl } from "@/lib/storage-url";
import { listCategories } from "@/queries/categories";
import { listFilaments } from "@/queries/filaments";
import { getProductById, getVariantById, listProductsWithVariants } from "@/queries/products";
import { deleteProduct } from "./_actions/delete-product";
import { removeProductImage } from "./_actions/remove-product-image";
import { ProductForm } from "./_components/product-form";
import { ProductImageUploadForm } from "./_components/product-image-upload-form";
import { ProductModelUploadForm } from "./_components/product-model-upload-form";
import { ProductsTable } from "./_components/products-table";
import { VariantForm } from "./_components/variant-form";

type AdminProductsPageProps = {
    searchParams: Promise<{
        id?: string;
        new?: string;
        newVariant?: string;
        variantId?: string;
        product?: string;
    }>;
};

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
    const {
        id,
        new: isNew,
        newVariant,
        variantId,
        product: newVariantProductId,
    } = await searchParams;
    const [products, categories, filaments, editing, editingVariant] = await Promise.all([
        listProductsWithVariants(),
        listCategories(),
        listFilaments(),
        id ? getProductById(id) : null,
        variantId ? getVariantById(variantId) : null,
    ]);
    const t = await getTranslations("admin.products");
    const tStock = await getTranslations("admin.stock");

    const filamentOptions = filaments.map((f) => ({ id: f.id, name: f.name }));

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <ProductsTable
                products={products}
                toolbarActions={
                    <Link
                        href="/admin/products?new=1"
                        aria-label={t("new")}
                        className={buttonVariants({ size: "sm" })}
                    >
                        <Plus className="size-4" />
                        <span className="hidden sm:inline">{t("new")}</span>
                    </Link>
                }
            />

            <AdminFormDialog
                open={Boolean(isNew) || Boolean(editing)}
                onCloseHref="/admin/products"
                title={editing ? t("edit") : t("newTitle")}
                className="sm:max-w-2xl lg:max-w-3xl"
            >
                {editing ? (
                    <div className="flex flex-col gap-8">
                        <ProductForm
                            product={{
                                id: editing.id,
                                name: editing.name,
                                slug: editing.slug,
                                description: editing.description,
                                price: editing.price,
                                type: editing.type,
                                active: editing.active,
                                categoryId: editing.categoryId,
                            }}
                            categories={categories}
                        />

                        <div>
                            <Separator className="mb-6" />

                            <h2 className="mb-3 font-semibold">{t("previewModel")}</h2>
                            <p className="mb-3 text-sm text-muted-foreground">
                                {editing.modelFile
                                    ? t("current", { filename: editing.modelFile.filename })
                                    : t("noModel")}
                            </p>
                            <ProductModelUploadForm productId={editing.id} />

                            <Separator className="my-6" />

                            <h2 className="mb-3 font-semibold">{t("images")}</h2>
                            <ProductImageUploadForm productId={editing.id} />

                            {editing.images.length > 0 && (
                                <ul className="mt-3 grid grid-cols-3 gap-3">
                                    {editing.images.map((img) => (
                                        <li
                                            key={img.id}
                                            className="relative overflow-hidden rounded-lg border"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={publicUrl(img.key)}
                                                alt={img.alt ?? ""}
                                                className="aspect-square w-full object-cover"
                                            />
                                            <form action={removeProductImage}>
                                                <input
                                                    type="hidden"
                                                    name="imageId"
                                                    value={img.id}
                                                />
                                                <input
                                                    type="hidden"
                                                    name="productId"
                                                    value={editing.id}
                                                />
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
                                <input type="hidden" name="id" value={editing.id} />
                                <Button type="submit" variant="destructive">
                                    <Trash2 className="size-4" />
                                    {t("deleteProduct")}
                                </Button>
                            </form>
                        </div>
                    </div>
                ) : isNew ? (
                    <ProductForm categories={categories} />
                ) : null}
            </AdminFormDialog>

            <AdminFormDialog
                open={Boolean(newVariant) || Boolean(editingVariant)}
                onCloseHref="/admin/products"
                title={editingVariant ? tStock("editVariant") : tStock("newVariant")}
                className="sm:max-w-xl"
            >
                {(newVariant || editingVariant) && (
                    <VariantForm
                        variant={editingVariant ?? undefined}
                        productId={newVariant ? newVariantProductId : undefined}
                        filaments={filamentOptions}
                    />
                )}
            </AdminFormDialog>
        </div>
    );
}
