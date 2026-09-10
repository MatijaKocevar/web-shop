"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, CornerDownRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { AdminTable } from "@/components/admin-table";
import type { AdminTableColumn, AdminTableRow } from "@/components/admin-table.types";
import { buttonVariants } from "@/components/ui/button";
import type { StockProduct } from "../_types/stock-product";
import { VariantStockCell } from "./variant-stock-cell";

type StockTableProps = {
    products: StockProduct[];
};

export function StockTable({ products }: StockTableProps) {
    const t = useTranslations("admin.stock");
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

    const columns: AdminTableColumn[] = [
        { label: t("product"), filter: { type: "text" }, className: "w-[30%]" },
        { label: t("filament"), className: "w-[30%]" },
        { label: t("gramsPerUnit"), className: "w-[15%]" },
        { label: t("stock"), className: "w-[15%]" },
        { label: t("actions"), srOnly: true, className: "w-[10%]" },
    ];

    const rows = products.flatMap((product) => {
        const isOpen = !collapsed.has(product.id);

        const productRow: AdminTableRow = {
            key: product.id,
            className: "bg-muted/40",
            href: `/admin/stock?productId=${product.id}`,
            cells: [
                {
                    content: (
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                                onClick={() => toggle(product.id)}
                                title={t("toggleVariants")}
                            >
                                {isOpen ? (
                                    <ChevronDown className="size-4" />
                                ) : (
                                    <ChevronRight className="size-4" />
                                )}
                            </button>
                            <Link
                                href={`/admin/stock?productId=${product.id}`}
                                className="font-medium hover:underline"
                            >
                                {product.name}
                            </Link>
                        </div>
                    ),
                    search: product.name,
                },
                { content: "", colSpan: 3 },
                {
                    content: (
                        <div className="flex justify-end">
                            <Link
                                href={`/admin/stock?newVariant=1&product=${product.id}`}
                                className={buttonVariants({ size: "sm" })}
                            >
                                {t("newVariant")}
                            </Link>
                        </div>
                    ),
                },
            ],
        };

        if (!isOpen) return [productRow];

        const variantRows: AdminTableRow[] = product.variants.map((variant) => ({
            key: variant.id,
            cells: [
                {
                    content: (
                        <div className="flex items-center gap-1.5 pl-7">
                            <CornerDownRight className="size-3.5 shrink-0 text-muted-foreground" />
                            <span className="font-medium">{variant.name}</span>
                        </div>
                    ),
                    search: `${product.name} ${variant.name}`,
                },
                { content: variant.filament?.name ?? "—", search: variant.filament?.name ?? "" },
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
                                href={`/admin/stock?variantId=${variant.id}`}
                                className={buttonVariants({ variant: "outline", size: "sm" })}
                            >
                                {t("editVariant")}
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
                                {t("noVariants")}
                            </span>
                        ),
                        className: "text-muted-foreground",
                        colSpan: 5,
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
            layout="fixed"
            counter={
                <span className="text-xs text-muted-foreground">
                    {t("count", { count: products.length })}
                </span>
            }
            fill
        />
    );
}
