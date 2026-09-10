"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, Pencil, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { AdminTable } from "@/components/admin-table";
import type { AdminTableColumn } from "@/components/admin-table.types";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { setFilamentStocks } from "../_actions/set-filament-stocks";
import type { Filament } from "../_types/filament";

type FilamentTableProps = {
    filaments: Filament[];
    toolbarActions?: React.ReactNode;
};

export function FilamentTable({ filaments, toolbarActions }: FilamentTableProps) {
    const t = useTranslations("admin.filaments");
    const tCommon = useTranslations("admin.common");
    const [pending, startTransition] = useTransition();
    const [stocks, setStocks] = useState<Record<string, number>>(() =>
        Object.fromEntries(filaments.map((f) => [f.id, f.stockGrams])),
    );

    const changed = useMemo(
        () =>
            filaments
                .filter((f) => (stocks[f.id] ?? f.stockGrams) !== f.stockGrams)
                .map((f) => ({ filamentId: f.id, stockGrams: stocks[f.id] ?? 0 })),
        [filaments, stocks],
    );

    function saveStocks() {
        if (pending || changed.length === 0) return;

        startTransition(async () => {
            await setFilamentStocks(changed);
        });
    }

    function setStock(id: string, value: string) {
        const grams = Number(value);

        setStocks((current) => ({ ...current, [id]: Number.isFinite(grams) ? grams : 0 }));
    }

    const columns: AdminTableColumn[] = [
        { label: tCommon("name"), sortable: true, filter: { type: "text" } },
        {
            label: tCommon("material"),
            sortable: true,
            filter: { type: "select", key: "material" },
        },
        { label: tCommon("color"), sortable: true, filter: { type: "text" } },
        { label: t("stock"), sortable: true },
        { label: t("density"), sortable: true },
        { label: t("costPerGramShort"), sortable: true },
        { label: t("edit"), srOnly: true },
    ];

    const rows = filaments.map((f) => {
        const stock = stocks[f.id] ?? f.stockGrams;

        return {
            key: f.id,
            href: `/admin/filaments/${f.id}`,
            filterValues: { material: f.material },
            cells: [
                {
                    content: (
                        <Link
                            href={`/admin/filaments/${f.id}`}
                            className="font-medium hover:underline"
                        >
                            {f.name}
                        </Link>
                    ),
                    search: f.name,
                },
                { content: f.material, search: f.material },
                { content: f.color, search: f.color },
                {
                    content: (
                        <div className="flex items-center gap-2">
                            {stock < f.lowStockThresholdGrams && (
                                <Badge variant="destructive">{t("lowStock")}</Badge>
                            )}
                            <input
                                className="w-20 rounded-md border bg-background px-2 py-1 text-xs focus-visible:ring-2 focus-visible:ring-ring/50 outline-none"
                                type="number"
                                step="1"
                                min="0"
                                value={stock}
                                onChange={(event) => setStock(f.id, event.target.value)}
                                title={t("setStockTitle")}
                            />
                        </div>
                    ),
                    search: String(stock),
                    sort: stock,
                },
                { content: `${f.density} g/cm³`, search: String(f.density), sort: f.density },
                {
                    content: `€${f.costPerGram.toFixed(4)}`,
                    search: f.costPerGram.toFixed(4),
                    sort: f.costPerGram,
                },
                {
                    content: (
                        <Link
                            href={`/admin/filaments/${f.id}`}
                            className={buttonVariants({ variant: "outline", size: "sm" })}
                        >
                            <Pencil className="size-4" />
                            {t("edit")}
                        </Link>
                    ),
                },
            ],
        };
    });

    return (
        <AdminTable
            columns={columns}
            rows={rows}
            toolbarActions={
                <div className="flex items-center gap-2">
                    {toolbarActions}
                    <Button
                        type="button"
                        size="sm"
                        onClick={saveStocks}
                        disabled={pending || changed.length === 0}
                    >
                        {pending ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Save className="size-4" />
                        )}
                        {t("saveStock")}
                    </Button>
                </div>
            }
            fill
        />
    );
}
