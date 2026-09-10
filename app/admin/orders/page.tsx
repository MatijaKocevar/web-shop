import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { AdminTable } from "@/components/admin-table";
import type { AdminTableColumn } from "@/components/admin-table.types";
import { Badge } from "@/components/ui/badge";
import { listOrders } from "@/queries/orders";
import { formatCurrency } from "@/lib/pricing";

const orderStatuses = [
    "PENDING",
    "PAID",
    "PROCESSING",
    "PRINTING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
] as const;

export default async function AdminOrdersPage() {
    const orders = await listOrders();
    const locale = await getLocale();
    const t = await getTranslations("admin.orders");
    const tStatus = await getTranslations("status.order");

    const columns: AdminTableColumn[] = [
        { label: t("date"), sortable: true, filter: { type: "text" } },
        { label: t("email"), sortable: true, filter: { type: "text" } },
        { label: t("items"), sortable: true },
        { label: t("total"), sortable: true },
        {
            label: t("status"),
            sortable: true,
            filter: {
                type: "select",
                key: "status",
                options: orderStatuses.map((status) => ({
                    value: status,
                    label: tStatus(status),
                })),
            },
        },
    ];

    const rows = orders.map((order) => ({
        key: order.id,
        filterValues: { status: order.status },
        cells: [
            {
                content: order.createdAt.toLocaleDateString(locale),
                className: "text-muted-foreground",
                search: order.createdAt.toLocaleDateString(locale),
                sort: order.createdAt.getTime(),
            },
            {
                content: (
                    <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium hover:underline"
                    >
                        {order.email}
                    </Link>
                ),
                search: order.email,
            },
            { content: order.items.length, sort: order.items.length },
            { content: formatCurrency(order.total, "EUR", locale), sort: order.total },
            {
                content: <Badge variant="secondary">{tStatus(order.status)}</Badge>,
                search: tStatus(order.status),
                sort: order.status,
            },
        ],
    }));

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-6">
            <h1 className="shrink-0 text-2xl font-semibold">{t("title")}</h1>
            <AdminTable columns={columns} rows={rows} fill />
        </div>
    );
}
