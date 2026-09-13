"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ChevronDown,
    ChevronRight,
    ChevronsUpDown,
    CornerDownRight,
    Pencil,
    Plus,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { AdminTable } from "@/components/admin-table";
import type { AdminTableColumn, AdminTableRow } from "@/components/admin-table.types";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { filamentColorHex } from "@/lib/filament-color";
import type { ProductWithVariants } from "../_types/product-with-variants";
import { VariantStockCell } from "./variant-stock-cell";

const TYPE_BADGE_CLASS: Record<string, string> = {
    READY_MADE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
    CUSTOM_PRINT: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
};

type ProductsTableProps = {
    products: ProductWithVariants[];
    toolbarActions?: React.ReactNode;
};

export function ProductsTable({ products, toolbarActions }: ProductsTableProps) {
    const t = useTranslations("admin.products");
    const tCommon = useTranslations("admin.common");
    const tStock = useTranslations("admin.stock");
    const tType = useTranslations("productType");
    const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());

    function toggle(id: string) {
        setCollapsed((current) => {
            const next = new Set(current);

            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }

            return next;
        });
    }

    const allCollapsed = products.length > 0 && collapsed.size >= products.length;

    function toggleAll() {
        setCollapsed(allCollapsed ? new Set() : new Set(products.map((product) => product.id)));
    }

    const columns: AdminTableColumn[] = [
        { label: tCommon("name"), filter: { type: "text" }, className: "w-[22%]" },
        { label: tCommon("type"), className: "w-[10%]" },
        { label: tCommon("price"), className: "w-[9%]" },
        { label: tCommon("category"), className: "w-[12%]" },
        { label: tStock("filament"), className: "w-[19%]" },
        { label: tStock("gramsPerUnit"), className: "w-[9%]" },
        { label: tStock("stock"), className: "w-[8%]" },
        { label: tStock("actions"), srOnly: true, className: "w-[11%]" },
    ];

    const rows = products.flatMap((product) => {
        const isOpen = !collapsed.has(product.id);

        const productRow: AdminTableRow = {
            key: product.id,
            className: "bg-muted/40",
            href: `/admin/products?id=${product.id}`,
            cells: [
                {
                    content: (
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                                onClick={() => toggle(product.id)}
                                title={tStock("toggleVariants")}
                            >
                                {isOpen ? (
                                    <ChevronDown className="size-4" />
                                ) : (
                                    <ChevronRight className="size-4" />
                                )}
                            </button>
                            <Link
                                href={`/admin/products?id=${product.id}`}
                                className="font-medium hover:underline"
                            >
                                {product.name}
                            </Link>
                        </div>
                    ),
                    search: product.name,
                },
                {
                    content: (
                        <Badge variant="secondary" className={TYPE_BADGE_CLASS[product.type]}>
                            {tType(product.type)}
                        </Badge>
                    ),
                    search: tType(product.type),
                },
                {
                    content: product.price != null ? `€${product.price.toFixed(2)}` : "—",
                    search: product.price != null ? String(product.price) : "",
                },
                {
                    content: product.category?.name ?? "—",
                    className: "text-muted-foreground",
                    search: product.category?.name ?? "",
                },
                { content: "", colSpan: 3 },
                {
                    content: (
                        <div className="flex justify-end gap-2">
                            <Link
                                href={`/admin/products?newVariant=1&product=${product.id}`}
                                aria-label={tStock("newVariant")}
                                className={buttonVariants({ size: "sm" })}
                            >
                                <Plus className="size-4" />
                                <span className="hidden sm:inline">{tStock("newVariant")}</span>
                            </Link>
                            <Link
                                href={`/admin/products?id=${product.id}`}
                                aria-label={t("edit")}
                                className={buttonVariants({ variant: "outline", size: "sm" })}
                            >
                                <Pencil className="size-4" />
                                <span className="hidden sm:inline">{t("edit")}</span>
                            </Link>
                        </div>
                    ),
                },
            ],
        };

        if (!isOpen) return [productRow];

        const variantRows: AdminTableRow[] = product.variants.map((variant) => ({
            key: variant.id,
            href: `/admin/products?variantId=${variant.id}`,
            cells: [
                {
                    content: (
                        <div className="flex items-center gap-1.5 pl-7">
                            <CornerDownRight className="size-3.5 shrink-0 text-muted-foreground" />
                            {variant.filament && (
                                <span
                                    className="size-3.5 shrink-0 rounded-[4px] border border-muted-foreground/50"
                                    style={{
                                        backgroundColor:
                                            variant.filament.colorHex ??
                                            filamentColorHex(variant.filament.color),
                                    }}
                                />
                            )}
                            <span className="font-medium">{variant.name}</span>
                        </div>
                    ),
                    search: `${product.name} ${variant.name}`,
                },
                { content: "" },
                {
                    content: variant.price != null ? `€${variant.price.toFixed(2)}` : "—",
                    search: variant.price != null ? String(variant.price) : "",
                },
                { content: "" },
                {
                    content: variant.filament?.name ?? "—",
                    search: variant.filament?.name ?? "",
                },
                {
                    content: variant.grams != null ? `${variant.grams} g` : "—",
                    search: String(variant.grams ?? ""),
                },
                {
                    content: <VariantStockCell variant={variant} />,
                    search: String(variant.stock),
                },
                {
                    content: (
                        <div className="flex justify-end">
                            <Link
                                href={`/admin/products?variantId=${variant.id}`}
                                aria-label={tStock("editVariant")}
                                className={buttonVariants({ variant: "outline", size: "sm" })}
                            >
                                <Pencil className="size-4" />
                                <span className="hidden sm:inline">{tStock("editVariant")}</span>
                            </Link>
                        </div>
                    ),
                },
            ],
        }));

        if (variantRows.length === 0) {
            variantRows.push({
                key: `${product.id}-empty`,
                cells: [
                    {
                        content: (
                            <span className="flex items-center gap-1.5 pl-7 text-muted-foreground">
                                <CornerDownRight className="size-3.5 shrink-0" />
                                {tStock("noVariants")}
                            </span>
                        ),
                        className: "text-muted-foreground",
                        colSpan: 8,
                    },
                ],
            });
        }

        return [productRow, ...variantRows];
    });

    return (
        <AdminTable
            columns={columns}
            rows={rows}
            counter={
                <span className="text-xs text-muted-foreground">
                    {tStock("count", { count: products.length })}
                </span>
            }
            toolbarActions={
                <div className="flex items-center gap-2">
                    {toolbarActions}
                    {products.length > 0 && (
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={toggleAll}
                            aria-label={allCollapsed ? t("expandAll") : t("collapseAll")}
                        >
                            <ChevronsUpDown className="size-4" />
                            <span className="hidden sm:inline">
                                {allCollapsed ? t("expandAll") : t("collapseAll")}
                            </span>
                        </Button>
                    )}
                </div>
            }
            fill
        />
    );
}
