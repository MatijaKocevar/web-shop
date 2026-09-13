"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
    ChevronDown,
    ChevronRight,
    ChevronsUpDown,
    CornerDownRight,
    Loader2,
    Pencil,
    Plus,
    Save,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { StockReason } from "@/generated/prisma/enums";
import { AdminTable } from "@/components/admin-table";
import type { AdminTableColumn, AdminTableRow } from "@/components/admin-table.types";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { setFilamentStocks } from "../_actions/set-filament-stocks";
import type { Filament } from "../_types/filament";
import { writeCollapsedCookie } from "../_utils/collapsed-filaments";
import { filamentColorHex } from "../_utils/filament-color";
import { getFilamentStatus } from "../_utils/filament-status";
import { StockAdjustCell } from "./stock-adjust-cell";
import { StockSpools } from "./stock-spools";

type FilamentTableProps = {
    filaments: Filament[];
    initialCollapsed?: string[];
    toolbarActions?: React.ReactNode;
};

export function FilamentTable({
    filaments,
    initialCollapsed = [],
    toolbarActions,
}: FilamentTableProps) {
    const t = useTranslations("admin.filaments");
    const [pending, startTransition] = useTransition();
    const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set(initialCollapsed));
    const [stocks, setStocks] = useState<Record<string, number>>(() =>
        Object.fromEntries(filaments.map((f) => [f.id, f.stockGrams])),
    );
    const [stockReasons, setStockReasons] = useState<Record<string, StockReason>>(() =>
        Object.fromEntries(filaments.map((f) => [f.id, "RESTOCK"])),
    );
    const [stockNotes, setStockNotes] = useState<Record<string, string>>(() =>
        Object.fromEntries(filaments.map((f) => [f.id, ""])),
    );

    const groups = useMemo(() => {
        const map = new Map<string, Filament[]>();

        for (const filament of filaments) {
            const group = map.get(filament.material);

            if (group) {
                group.push(filament);
            } else {
                map.set(filament.material, [filament]);
            }
        }

        return map;
    }, [filaments]);

    const allCollapsed = groups.size > 0 && collapsed.size >= groups.size;

    const changed = useMemo(
        () =>
            filaments
                .filter((f) => (stocks[f.id] ?? f.stockGrams) !== f.stockGrams)
                .map((f) => ({
                    filamentId: f.id,
                    stockGrams: stocks[f.id] ?? 0,
                    reason: stockReasons[f.id] ?? "RESTOCK",
                    note: stockNotes[f.id] ?? "",
                })),
        [filaments, stocks, stockReasons, stockNotes],
    );

    function persist(next: Set<string>) {
        writeCollapsedCookie([...next]);
    }

    function toggle(material: string) {
        const next = new Set(collapsed);

        if (next.has(material)) {
            next.delete(material);
        } else {
            next.add(material);
        }

        setCollapsed(next);
        persist(next);
    }

    function toggleAll() {
        const next = allCollapsed ? new Set<string>() : new Set(groups.keys());

        setCollapsed(next);
        persist(next);
    }

    function saveStocks() {
        if (pending || changed.length === 0) return;

        startTransition(async () => {
            await setFilamentStocks(changed);
        });
    }

    function handleChange(
        filamentId: string,
        stockGrams: number,
        reason: StockReason,
        note: string,
    ) {
        setStocks((current) => ({ ...current, [filamentId]: stockGrams }));
        setStockReasons((current) => ({ ...current, [filamentId]: reason }));
        setStockNotes((current) => ({ ...current, [filamentId]: note }));
    }

    const columns: AdminTableColumn[] = [
        { label: t("filament"), filter: { type: "text" }, className: "w-[30%]" },
        { label: t("stock"), className: "w-[5%] pr-1 [&>div]:justify-end" },
        { label: t("adjustStock"), srOnly: true, className: "w-[4%]" },
        { label: t("spools"), className: "w-[18%]" },
        { label: t("density"), className: "w-[13%]" },
        { label: t("costPerGramShort"), className: "w-[12%]" },
        { label: t("edit"), srOnly: true, className: "w-[18%]" },
    ];

    const rows: AdminTableRow[] = [...groups.entries()].flatMap(([material, group]) => {
        const isOpen = !collapsed.has(material);

        const materialRow: AdminTableRow = {
            key: material,
            className: "bg-muted/40",
            cells: [
                {
                    content: (
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                                onClick={() => toggle(material)}
                                title={t("toggleColors")}
                            >
                                {isOpen ? (
                                    <ChevronDown className="size-4" />
                                ) : (
                                    <ChevronRight className="size-4" />
                                )}
                            </button>
                            <span className="font-medium">{material}</span>
                        </div>
                    ),
                    search: material,
                },
                { content: "", colSpan: 5 },
                {
                    content: (
                        <div className="flex justify-end">
                            <Link
                                href={`/admin/filaments?new=1&material=${encodeURIComponent(material)}`}
                                aria-label={t("newColor")}
                                className={buttonVariants({ size: "sm" })}
                            >
                                <Plus className="size-4" />
                                <span className="hidden sm:inline">{t("newColor")}</span>
                            </Link>
                        </div>
                    ),
                },
            ],
        };

        if (!isOpen) return [materialRow];

        const colorRows: AdminTableRow[] = group.map((f) => {
            const stock = stocks[f.id] ?? f.stockGrams;
            const pendingStock = stock !== f.stockGrams;
            const status = getFilamentStatus(stock, f.lowStockThresholdGrams);

            return {
                key: f.id,
                href: `/admin/filaments?id=${f.id}`,
                cells: [
                    {
                        content: (
                            <div className="flex items-center gap-1.5 pl-7">
                                <CornerDownRight className="size-3.5 shrink-0 text-muted-foreground" />
                                <span
                                    className="size-3.5 shrink-0 rounded-[4px] border border-muted-foreground/50"
                                    style={{
                                        backgroundColor: f.colorHex ?? filamentColorHex(f.color),
                                    }}
                                />
                                <Link
                                    href={`/admin/filaments?id=${f.id}`}
                                    className="font-medium hover:underline"
                                >
                                    {f.color}
                                </Link>
                            </div>
                        ),
                        search: `${material} ${f.color}`,
                    },
                    {
                        content: (
                            <span
                                className={cn(
                                    "tabular-nums whitespace-nowrap",
                                    pendingStock && "font-medium text-primary",
                                )}
                            >
                                {stock} g
                            </span>
                        ),
                        search: String(stock),
                        className: "pr-1 text-right",
                    },
                    {
                        content: (
                            <StockAdjustCell
                                filamentId={f.id}
                                stockGrams={stock}
                                onChange={handleChange}
                            />
                        ),
                        className: "pl-1",
                    },
                    {
                        content: <StockSpools stockGrams={stock} status={status} />,
                    },
                    { content: `${f.density} g/cm³`, search: String(f.density) },
                    { content: `€${f.costPerGram.toFixed(4)}`, search: f.costPerGram.toFixed(4) },
                    {
                        content: (
                            <div className="flex justify-end">
                                <Link
                                    href={`/admin/filaments?id=${f.id}`}
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
        });

        return [materialRow, ...colorRows];
    });

    return (
        <AdminTable
            columns={columns}
            rows={rows}
            counter={false}
            toolbarActions={
                <div className="flex items-center gap-2">
                    {toolbarActions}
                    {groups.size > 0 && (
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
                    <Button
                        type="button"
                        size="sm"
                        onClick={saveStocks}
                        disabled={pending || changed.length === 0}
                        aria-label={t("saveStock")}
                    >
                        {pending ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Save className="size-4" />
                        )}
                        <span className="hidden sm:inline">{t("saveStock")}</span>
                    </Button>
                </div>
            }
            fill
        />
    );
}
