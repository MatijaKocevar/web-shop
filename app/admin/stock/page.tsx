import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AdminFormDialog } from "@/components/admin-form-dialog";
import { AdminTable } from "@/components/admin-table";
import type { AdminTableColumn } from "@/components/admin-table.types";
import { buttonVariants } from "@/components/ui/button";
import { listFilaments } from "@/queries/filaments";
import { getVariantById, listProductsWithVariants } from "@/queries/products";
import { StockTable } from "./_components/stock-table";
import { VariantForm } from "./_components/variant-form";
import { VariantStockCell } from "./_components/variant-stock-cell";

type AdminStockPageProps = {
    searchParams: Promise<{
        newVariant?: string;
        product?: string;
        variantId?: string;
        productId?: string;
    }>;
};

export default async function AdminStockPage({ searchParams }: AdminStockPageProps) {
    const { newVariant, product, variantId, productId } = await searchParams;
    const [products, filaments, editingVariant] = await Promise.all([
        listProductsWithVariants(),
        listFilaments(),
        variantId ? getVariantById(variantId) : null,
    ]);
    const t = await getTranslations("admin.stock");

    const filamentOptions = filaments.map((f) => ({ id: f.id, name: f.name }));
    const productForDialog = productId
        ? (products.find((entry) => entry.id === productId) ?? null)
        : null;

    const variantColumns: AdminTableColumn[] = [
        { label: t("variant") },
        { label: t("filament") },
        { label: t("gramsPerUnit") },
        { label: t("stock") },
        { label: t("actions"), srOnly: true },
    ];

    const variantRows =
        productForDialog?.variants.map((variant) => ({
            key: variant.id,
            cells: [
                { content: <span className="font-medium">{variant.name}</span> },
                { content: variant.filament?.name ?? "—" },
                { content: variant.grams != null ? `${variant.grams} g` : "—" },
                { content: <VariantStockCell variant={variant} /> },
                {
                    content: (
                        <div className="flex justify-end">
                            <Link
                                href={`/admin/stock?variantId=${variant.id}`}
                                className={buttonVariants({ variant: "outline", size: "sm" })}
                            >
                                {t("editVariant")}
                            </Link>
                        </div>
                    ),
                },
            ],
        })) ?? [];

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <StockTable products={products} />

            <AdminFormDialog
                open={Boolean(newVariant) || Boolean(editingVariant)}
                onCloseHref="/admin/stock"
                title={editingVariant ? t("editVariant") : t("newVariant")}
                className="sm:max-w-xl"
            >
                {(newVariant || editingVariant) && (
                    <VariantForm
                        variant={editingVariant ?? undefined}
                        productId={newVariant ? product : undefined}
                        filaments={filamentOptions}
                    />
                )}
            </AdminFormDialog>

            <AdminFormDialog
                open={Boolean(productForDialog)}
                onCloseHref="/admin/stock"
                title={productForDialog?.name}
                className="sm:max-w-2xl"
            >
                {productForDialog && (
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-end">
                            <Link
                                href={`/admin/stock?newVariant=1&product=${productForDialog.id}`}
                                className={buttonVariants({ size: "sm" })}
                            >
                                {t("newVariant")}
                            </Link>
                        </div>
                        <AdminTable
                            toolbar={false}
                            columns={variantColumns}
                            rows={variantRows}
                            empty={t("noVariants")}
                        />
                    </div>
                )}
            </AdminFormDialog>
        </div>
    );
}
