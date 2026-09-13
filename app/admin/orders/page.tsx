import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { AdminTable } from "@/components/admin-table";
import type { AdminTableColumn } from "@/components/admin-table.types";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/pricing";
import { getOrderById, listOrders } from "@/queries/orders";
import { OrderDialog } from "../_components/order-dialog";

const orderStatuses = [
    "PENDING",
    "PAID",
    "PROCESSING",
    "PRINTING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
];

type AdminOrdersPageProps = {
    searchParams: Promise<{ id?: string }>;
};

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
    const { id } = await searchParams;
    const [orders, order] = await Promise.all([listOrders(), id ? getOrderById(id) : null]);
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

    const rows = orders.map((entry) => ({
        key: entry.id,
        href: `/admin/orders?id=${entry.id}`,
        filterValues: { status: entry.status },
        cells: [
            {
                content: entry.createdAt.toLocaleDateString(locale),
                className: "text-muted-foreground",
                search: entry.createdAt.toLocaleDateString(locale),
                sort: entry.createdAt.getTime(),
            },
            {
                content: (
                    <Link
                        href={`/admin/orders?id=${entry.id}`}
                        className="font-medium hover:underline"
                    >
                        {entry.email}
                    </Link>
                ),
                search: entry.email,
            },
            { content: entry.items.length, sort: entry.items.length },
            { content: formatCurrency(entry.total, "EUR", locale), sort: entry.total },
            {
                content: <Badge variant="secondary">{tStatus(entry.status)}</Badge>,
                search: tStatus(entry.status),
                sort: entry.status,
            },
        ],
    }));

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <AdminTable columns={columns} rows={rows} fill />

            {order && <OrderDialog order={order} onCloseHref="/admin/orders" />}
        </div>
    );
}
