import Link from "next/link";
import { Trash2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { AdminFormDialog } from "@/components/admin-form-dialog";
import { AdminTable } from "@/components/admin-table";
import type { AdminTableColumn } from "@/components/admin-table.types";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { publicUrl } from "@/lib/storage-url";
import { listCategories } from "@/queries/categories";
import { getProductById, listProducts } from "@/queries/products";
import { deleteProduct } from "./_actions/delete-product";
import { removeProductImage } from "./_actions/remove-product-image";
import { ProductForm } from "./_components/product-form";
import { ProductImageUploadForm } from "./_components/product-image-upload-form";
import { ProductModelUploadForm } from "./_components/product-model-upload-form";

type AdminProductsPageProps = {
    searchParams: Promise<{ id?: string; new?: string }>;
};

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
    const { id, new: isNew } = await searchParams;
    const [products, categories, editing] = await Promise.all([
        listProducts(),
        listCategories(),
        id ? getProductById(id) : null,
    ]);
    const t = await getTranslations("admin.products");
    const tCommon = await getTranslations("admin.common");
    const tType = await getTranslations("productType");

    const columns: AdminTableColumn[] = [
        { label: tCommon("name"), sortable: true, filter: { type: "text" } },
        {
            label: tCommon("type"),
            sortable: true,
            filter: {
                type: "select",
                key: "type",
                options: [
                    { value: "READY_MADE", label: tType("READY_MADE") },
                    { value: "CUSTOM_PRINT", label: tType("CUSTOM_PRINT") },
                ],
            },
        },
        { label: tCommon("price"), sortable: true },
        { label: tCommon("category"), sortable: true, filter: { type: "text" } },
    ];

    const rows = products.map((product) => ({
        key: product.id,
        href: `/admin/products?id=${product.id}`,
        filterValues: { type: product.type },
        cells: [
            {
                content: (
                    <Link
                        href={`/admin/products?id=${product.id}`}
                        className="font-medium hover:underline"
                    >
                        {product.name}
                    </Link>
                ),
                search: product.name,
            },
            {
                content: <Badge variant="secondary">{tType(product.type)}</Badge>,
                search: tType(product.type),
                sort: product.type,
            },
            {
                content: product.price != null ? `€${product.price.toFixed(2)}` : "—",
                sort: product.price ?? -1,
            },
            {
                content: product.category?.name ?? "—",
                className: "text-muted-foreground",
                search: product.category?.name ?? "",
            },
        ],
    }));

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <AdminTable
                columns={columns}
                rows={rows}
                toolbarActions={
                    <Link href="/admin/products?new=1" className={buttonVariants({ size: "sm" })}>
                        {t("new")}
                    </Link>
                }
                fill
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
        </div>
    );
}
