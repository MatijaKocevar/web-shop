import { getLocale, getTranslations } from "next-intl/server";
import { AdminTable } from "@/components/admin-table";
import type { AdminTableColumn } from "@/components/admin-table.types";
import { cn } from "@/lib/utils";
import type { StockReason } from "@/generated/prisma/client";
import type { StockLogEntry } from "../_types/stock-log";

const reasons: StockReason[] = ["ORDER", "STOCK_PRINT", "FAILURE", "RESTOCK", "CORRECTION"];

type StockLogListProps = {
    logs: StockLogEntry[];
};

export async function StockLogList({ logs }: StockLogListProps) {
    const t = await getTranslations("admin.filaments");
    const tReason = await getTranslations("stockReason");
    const locale = await getLocale();

    if (logs.length === 0) {
        return <p className="text-sm text-muted-foreground">{t("noLogEntries")}</p>;
    }

    const columns: AdminTableColumn[] = [
        { label: t("date"), sortable: true, filter: { type: "text" } },
        {
            label: t("reason"),
            sortable: true,
            filter: {
                type: "select",
                key: "reason",
                options: reasons.map((reason) => ({
                    value: reason,
                    label: tReason(reason),
                })),
            },
        },
        { label: t("deltaGrams"), sortable: true },
        { label: t("note"), filter: { type: "text" } },
    ];

    const rows = logs.map((log) => ({
        key: log.id,
        filterValues: { reason: log.reason },
        cells: [
            {
                content: log.createdAt.toLocaleString(locale),
                className: "text-muted-foreground",
                search: log.createdAt.toLocaleString(locale),
                sort: log.createdAt.getTime(),
            },
            { content: tReason(log.reason), search: tReason(log.reason), sort: log.reason },
            {
                content: `${log.deltaGrams > 0 ? "+" : ""}${log.deltaGrams} g`,
                className: cn(
                    "font-medium",
                    log.deltaGrams < 0 ? "text-destructive" : "text-green-600",
                ),
                sort: log.deltaGrams,
            },
            {
                content: log.note ?? "—",
                className: "text-muted-foreground",
                search: log.note ?? "",
            },
        ],
    }));

    return <AdminTable columns={columns} rows={rows} maxHeight="16rem" />;
}
