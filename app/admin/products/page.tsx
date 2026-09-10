import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AdminTable } from "@/components/admin-table";
import type { AdminTableColumn } from "@/components/admin-table.types";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { listProducts } from "@/queries/products";

export default async function AdminProductsPage() {
    const products = await listProducts();
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
        href: `/admin/products/${product.id}`,
        filterValues: { type: product.type },
        cells: [
            {
                content: (
                    <Link
                        href={`/admin/products/${product.id}`}
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
                    <Link href="/admin/products/new" className={buttonVariants({ size: "sm" })}>
                        {t("new")}
                    </Link>
                }
                fill
            />
        </div>
    );
}
