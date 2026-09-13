"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ArrowUpDown, ListFilter, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
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
    const [filters, setFilters] = useState<Record<string, string>>({});

    const selectOptions = useMemo(
        () =>
            columns.map((column) => {
                const filter = column.filter;
                if (!filter || filter.type !== "select" || filter.options) return null;

                const seen: string[] = [];

                for (const row of rows) {
                    const value = row.filterValues?.[filter.key];
                    if (value && !seen.includes(value)) seen.push(value);
                }

                return seen.map((value) => ({ value, label: value }));
            }),
        [columns, rows],
    );

    const visibleRows = useMemo(() => {
        const normalized = query.trim().toLowerCase();

        let result = rows;

        columns.forEach((column, index) => {
            const filter = column.filter;
            if (!filter) return;

            const key = filterKey(filter, index);
            const value = filters[key];
            if (!value) return;

            if (filter.type === "select") {
                result = result.filter((row) => row.filterValues?.[filter.key] === value);
            } else {
                result = result.filter((row) => {
                    const cell = row.cells[index];
                    const text = cell ? cellText(cell) : "";

                    return text.toLowerCase().includes(value.toLowerCase());
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

    function toggleSort(index: number) {
        setSort((current) => {
            if (!current || current.index !== index) return { index, direction: "asc" };
            if (current.direction === "asc") return { index, direction: "desc" };
            return null;
        });
    }

    function setFilter(key: string, value: string) {
        setFilters((current) => ({ ...current, [key]: value }));
    }

    function renderFilterControl(filter: AdminTableColumnFilter, index: number) {
        const inputClass =
            "w-full rounded-md border bg-background px-2 py-1 text-xs font-normal focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

        if (filter.type === "select") {
            const options = filter.options ?? selectOptions[index] ?? [];
            const key = filterKey(filter, index);

            return (
                <select
                    className={inputClass}
                    value={filters[key] ?? ""}
                    onChange={(event) => setFilter(key, event.target.value)}
                >
                    <option value="">{t("filterAll")}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        }

        const key = filterKey(filter, index);

        return (
            <input
                className={inputClass}
                value={filters[key] ?? ""}
                onChange={(event) => setFilter(key, event.target.value)}
                placeholder={t("filter")}
            />
        );
    }

    const table = (
        <Table className={cn(layout === "fixed" && "table-fixed", className)}>
            {columns.length > 0 && (
                <TableHeader className="bg-muted/50 text-left">
                    <TableRow className="hover:bg-transparent">
                        {columns.map((column, index) => {
                            const active = sort?.index === index;
                            const filterActive = column.filter
                                ? (filters[filterKey(column.filter, index)] ?? "") !== ""
                                : false;

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

                                        {column.filter && (
                                            <>
                                                <div className="hidden min-w-0 flex-1 sm:block">
                                                    {renderFilterControl(column.filter, index)}
                                                </div>

                                                <Popover>
                                                    <PopoverTrigger
                                                        className={cn(
                                                            "hidden rounded p-1 sm:hidden max-sm:inline-flex",
                                                            filterActive
                                                                ? "text-primary"
                                                                : "text-muted-foreground",
                                                        )}
                                                    >
                                                        <ListFilter className="size-3.5" />
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="hidden w-56 sm:hidden max-sm:flex"
                                                        side="bottom"
                                                        align="start"
                                                    >
                                                        {renderFilterControl(column.filter, index)}
                                                    </PopoverContent>
                                                </Popover>
                                            </>
                                        )}

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
