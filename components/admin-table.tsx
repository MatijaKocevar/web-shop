"use client";

import { useMemo, useState } from "react";
import type { Key } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ArrowUpDown, ListFilter, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type {
    AdminTableCell,
    AdminTableColumn,
    AdminTableColumnFilter,
    AdminTableRow,
} from "@/components/admin-table.types";

type AdminTableProps = {
    columns?: AdminTableColumn[];
    rows: AdminTableRow[];
    empty?: React.ReactNode;
    frameless?: boolean;
    className?: string;
    toolbar?: boolean;
    toolbarActions?: React.ReactNode;
    counter?: boolean | React.ReactNode;
    layout?: "auto" | "fixed";
    maxHeight?: string;
    fill?: boolean;
};

type SortState = {
    index: number;
    direction: "asc" | "desc";
} | null;

type FilterState = {
    query: string;
    checked: Set<string> | null;
};

const EMPTY_FILTER: FilterState = { query: "", checked: null };

function cellText(cell: AdminTableCell): string {
    if (cell.search != null) return String(cell.search);
    if (typeof cell.content === "string") return cell.content;
    if (typeof cell.content === "number") return String(cell.content);
    return "";
}

function compareValues(a: string | number, b: string | number): number {
    if (typeof a === "number" && typeof b === "number") return a - b;

    return new Intl.Collator(undefined, { numeric: true }).compare(String(a), String(b));
}

export function AdminTable({
    columns = [],
    rows,
    empty,
    frameless = false,
    className,
    toolbar = true,
    toolbarActions,
    counter = true,
    layout = "auto",
    maxHeight,
    fill = false,
}: AdminTableProps) {
    const t = useTranslations("admin.table");
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState<SortState>(null);
    const [filters, setFilters] = useState<Record<string, FilterState>>({});

    const filterOptions = useMemo(
        () =>
            columns.map((column, index) => {
                const filter = column.filter;
                if (!filter) return null;

                if (filter.type === "select" && filter.options) return filter.options;

                const seen = new Map<string, string>();

                for (const row of rows) {
                    if (row.parentKey != null) continue;

                    const value =
                        filter.type === "select"
                            ? row.filterValues?.[filter.key]
                            : cellText(row.cells[index] ?? { content: "" });

                    if (value && !seen.has(value)) seen.set(value, value);
                }

                return [...seen.entries()].map(([value, label]) => ({ value, label }));
            }),
        [columns, rows],
    );

    const visibleRows = useMemo(() => {
        const normalized = query.trim().toLowerCase();

        let result = rows;

        columns.forEach((column, index) => {
            const filter = column.filter;
            if (!filter) return;

            const state = filters[filterKey(filter, index)];
            if (!state) return;

            const byKey = new Map<Key, AdminTableRow>();

            for (const row of rows) {
                if (row.key != null) byKey.set(row.key, row);
            }

            const valueOf = (row: AdminTableRow) =>
                filter.type === "select"
                    ? (row.filterValues?.[filter.key] ?? "")
                    : cellText(row.cells[index] ?? { content: "" });

            const parentValueOf = (row: AdminTableRow) => {
                if (row.parentKey == null) return null;

                const parent = byKey.get(row.parentKey);

                return parent ? valueOf(parent) : null;
            };

            if (state.checked) {
                result = result.filter((row) => {
                    const parentValue = parentValueOf(row);

                    return (
                        state.checked?.has(valueOf(row)) ||
                        (parentValue != null && state.checked?.has(parentValue))
                    );
                });
            }

            const filterQuery = state.query.trim().toLowerCase();

            if (filterQuery) {
                result = result.filter((row) => {
                    const parentValue = parentValueOf(row);

                    return (
                        valueOf(row).toLowerCase().includes(filterQuery) ||
                        (parentValue != null && parentValue.toLowerCase().includes(filterQuery))
                    );
                });
            }
        });

        if (normalized) {
            result = result.filter((row) =>
                row.cells.some((cell) => cellText(cell).toLowerCase().includes(normalized)),
            );
        }

        if (sort) {
            const sorted = [...result];

            sorted.sort((a, b) => {
                const cellA = a.cells[sort.index];
                const cellB = b.cells[sort.index];
                const valueA = cellA ? (cellA.sort ?? cellText(cellA)) : "";
                const valueB = cellB ? (cellB.sort ?? cellText(cellB)) : "";
                const diff = compareValues(valueA, valueB);

                return sort.direction === "asc" ? diff : -diff;
            });

            result = sorted;
        }

        return result;
    }, [rows, columns, filters, query, sort]);

    function filterKey(filter: AdminTableColumnFilter, index: number): string {
        return filter.type === "select" ? filter.key : `text-${index}`;
    }

    function setFilterQuery(key: string, value: string) {
        setFilters((current) => ({
            ...current,
            [key]: { ...(current[key] ?? EMPTY_FILTER), query: value },
        }));
    }

    function resetFilter(key: string) {
        setFilters((current) => {
            const next = { ...current };

            delete next[key];

            return next;
        });
    }

    function setFilterChecked(key: string, checked: Set<string> | null) {
        setFilters((current) => ({
            ...current,
            [key]: { ...(current[key] ?? EMPTY_FILTER), checked },
        }));
    }

    function toggleFilterValue(key: string, value: string, selected: boolean, allValues: string[]) {
        const next = new Set(filters[key]?.checked ?? allValues);

        if (selected) {
            next.add(value);
        } else {
            next.delete(value);
        }

        setFilterChecked(key, next.size >= allValues.length ? null : next);
    }

    function toggleSort(index: number) {
        setSort((current) => {
            if (!current || current.index !== index) return { index, direction: "asc" };
            if (current.direction === "asc") return { index, direction: "desc" };
            return null;
        });
    }

    function renderFilterControl(filter: AdminTableColumnFilter, index: number) {
        const key = filterKey(filter, index);
        const state = filters[key];
        const active = Boolean(state && (state.query.trim() !== "" || state.checked != null));
        const options = filterOptions[index] ?? [];
        const checked = state?.checked ?? null;
        const normalized = (state?.query ?? "").trim().toLowerCase();
        const visibleOptions = normalized
            ? options.filter((option) => option.label.toLowerCase().includes(normalized))
            : options;
        const allValues = options.map((option) => option.value);
        const noneChecked = checked != null && checked.size === 0;

        return (
            <Popover>
                <PopoverTrigger
                    className={cn(
                        "rounded p-1",
                        active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                    )}
                    aria-label={t("filter")}
                >
                    <ListFilter className="size-3.5" />
                </PopoverTrigger>
                <PopoverContent className="w-64 gap-0 p-0" side="bottom" align="start">
                    <div className="flex items-center gap-1 border-b p-2">
                        <input
                            className="min-w-0 flex-1 rounded-md border bg-background px-2 py-1.5 text-xs font-normal focus-visible:ring-2 focus-visible:ring-ring/50 outline-none"
                            value={state?.query ?? ""}
                            onChange={(event) => setFilterQuery(key, event.target.value)}
                            placeholder={t("filter")}
                        />
                        <button
                            type="button"
                            className="rounded p-1 text-muted-foreground hover:text-foreground"
                            onClick={() => resetFilter(key)}
                            aria-label={t("reset")}
                            title={t("reset")}
                        >
                            <X className="size-3.5" />
                        </button>
                    </div>
                    <div className="flex max-h-72 flex-col gap-0.5 overflow-y-auto p-1.5">
                        <label className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-xs hover:bg-muted">
                            <Checkbox
                                checked={checked == null}
                                indeterminate={checked != null && !noneChecked}
                                onCheckedChange={(next) =>
                                    setFilterChecked(key, next ? null : new Set())
                                }
                            />
                            <span className="truncate">{t("filterAll")}</span>
                        </label>
                        {visibleOptions.map((option) => (
                            <label
                                key={option.value}
                                className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-xs hover:bg-muted"
                            >
                                <Checkbox
                                    checked={checked == null || checked.has(option.value)}
                                    onCheckedChange={(next) =>
                                        toggleFilterValue(key, option.value, next, allValues)
                                    }
                                />
                                <span className="truncate">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        );
    }

    const table = (
        <Table className={cn(layout === "fixed" && "table-fixed", className)}>
            {columns.length > 0 && (
                <TableHeader className="bg-muted/50 text-left">
                    <TableRow className="hover:bg-transparent">
                        {columns.map((column, index) => {
                            const active = sort?.index === index;

                            return (
                                <TableHead
                                    key={index}
                                    className={cn("px-4 py-2", column.className)}
                                >
                                    <div className="flex items-center gap-1.5">
                                        <span
                                            className={cn(
                                                "inline-flex items-center gap-0.5 font-medium whitespace-nowrap",
                                                column.sortable && "cursor-pointer select-none",
                                            )}
                                            onClick={
                                                column.sortable
                                                    ? () => toggleSort(index)
                                                    : undefined
                                            }
                                        >
                                            {column.srOnly ? (
                                                <span className="sr-only">{column.label}</span>
                                            ) : (
                                                column.label
                                            )}
                                        </span>

                                        {column.filter && renderFilterControl(column.filter, index)}

                                        {column.sortable && (
                                            <button
                                                type="button"
                                                className={cn(
                                                    "rounded p-0.5",
                                                    active
                                                        ? "text-foreground"
                                                        : "text-muted-foreground hover:text-foreground",
                                                )}
                                                onClick={() => toggleSort(index)}
                                            >
                                                {active ? (
                                                    sort.direction === "asc" ? (
                                                        <ArrowUp className="size-3.5" />
                                                    ) : (
                                                        <ArrowDown className="size-3.5" />
                                                    )
                                                ) : (
                                                    <ArrowUpDown className="size-3.5" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </TableHead>
                            );
                        })}
                    </TableRow>
                </TableHeader>
            )}
            <TableBody className="divide-y">
                {visibleRows.map((row, index) => {
                    const interactive = Boolean(row.href);

                    return (
                        <TableRow
                            key={row.key ?? index}
                            className={cn(
                                "hover:bg-muted/30",
                                row.className,
                                interactive && "cursor-pointer select-none",
                            )}
                            title={row.title ?? (interactive ? t("doubleClick") : undefined)}
                            onDoubleClick={(event) => {
                                if (row.onDoubleClick) return row.onDoubleClick(event);
                                if (!row.href) return;

                                const target = event.target as HTMLElement;
                                if (target.closest("a, button, input, select, form")) return;

                                router.push(row.href);
                            }}
                        >
                            {row.cells.map((cell, cellIndex) => (
                                <TableCell
                                    key={cellIndex}
                                    className={cn("px-4 py-2", cell.className)}
                                    colSpan={cell.colSpan}
                                >
                                    {cell.content}
                                </TableCell>
                            ))}
                        </TableRow>
                    );
                })}
                {visibleRows.length === 0 && (
                    <TableRow className="hover:bg-transparent">
                        <TableCell
                            colSpan={columns.length || 1}
                            className="px-4 py-2 text-muted-foreground"
                        >
                            {rows.length === 0 ? empty : t("noResults")}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );

    const toolbarNode = toolbar && (
        <div className="flex shrink-0 items-center gap-2 border-b p-2">
            <div className="relative min-w-0 flex-1 sm:flex-none">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    className="w-full rounded-md border bg-background py-1.5 pr-3 pl-8 text-sm focus-visible:ring-2 focus-visible:ring-ring/50 outline-none sm:w-72"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={t("search")}
                />
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-2">
                {toolbarActions}
                {counter === true && (
                    <span className="text-xs text-muted-foreground">
                        {t("results", { visible: visibleRows.length, total: rows.length })}
                    </span>
                )}
                {counter && counter !== true && counter}
            </div>
        </div>
    );

    const content = (
        <>
            {toolbarNode}
            <div
                className="min-h-0 flex-1 overflow-auto [&>[data-slot=table-container]]:overflow-visible"
                style={maxHeight ? { maxHeight } : undefined}
            >
                {table}
            </div>
        </>
    );

    if (frameless) {
        return <div className={cn(fill && "flex min-h-0 flex-1 flex-col")}>{content}</div>;
    }

    return (
        <div
            className={cn(
                "overflow-hidden rounded-lg border",
                fill && "flex min-h-0 flex-1 flex-col",
            )}
        >
            {content}
        </div>
    );
}
