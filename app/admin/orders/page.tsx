import Link from "next/link";
import { Download } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { AdminFormDialog } from "@/components/admin-form-dialog";
import { AdminTable } from "@/components/admin-table";
import type { AdminTableColumn } from "@/components/admin-table.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { estimateGrams } from "@/lib/estimate";
import { formatCurrency } from "@/lib/pricing";
import { getOrderById, listOrders } from "@/queries/orders";
import { downloadFile } from "./_actions/download-file";
import { updateOrderStatus } from "./_actions/update-order-status";
import { RecordPrintForm } from "./_components/record-print-form";

const inputClass =
    "rounded-md border bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

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
    const tType = await getTranslations("productType");

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

    const recordItems = order
        ? order.items.map((item) => {
              let estimatedGrams: number | null = null;

              if (
                  item.type === "CUSTOM_PRINT" &&
                  item.file?.volume &&
                  item.filament &&
                  item.profile
              ) {
                  estimatedGrams = Math.round(
                      estimateGrams(item.file.volume, item.filament.density, item.profile.infill),
                  );
              } else if (item.type === "READY_MADE" && item.variant?.grams) {
                  estimatedGrams = Math.round(item.variant.grams);
              }

              return {
                  id: item.id,
                  name: item.name,
                  quantity: item.quantity,
                  filament: item.filament
                      ? { id: item.filament.id, name: item.filament.name }
                      : null,
                  estimatedGrams,
              };
          })
        : [];

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <AdminTable columns={columns} rows={rows} fill />

            <AdminFormDialog
                open={Boolean(order)}
                onCloseHref="/admin/orders"
                title={t("order")}
                description={
                    order
                        ? `${order.email} · ${order.createdAt.toLocaleString(locale)} · ${t(
                              "stripeSession",
                              { id: order.stripeSessionId ?? "—" },
                          )}`
                        : undefined
                }
                className="sm:max-w-2xl lg:max-w-3xl"
            >
                {order && (
                    <div className="flex flex-col gap-6">
                        <div className="flex justify-end">
                            <Badge variant="secondary">{tStatus(order.status)}</Badge>
                        </div>

                        <div className="rounded-lg border">
                            <ul className="flex flex-col divide-y">
                                {order.items.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {tType(item.type)} × {item.quantity}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {item.file && (
                                                <form action={downloadFile}>
                                                    <input
                                                        type="hidden"
                                                        name="fileId"
                                                        value={item.file.id}
                                                    />
                                                    <Button
                                                        type="submit"
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Download className="size-4" />
                                                        {t("download")}
                                                    </Button>
                                                </form>
                                            )}
                                            <span>
                                                {formatCurrency(
                                                    item.unitPrice * item.quantity,
                                                    "EUR",
                                                    locale,
                                                )}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <Separator />
                            <div className="flex items-center justify-between px-4 py-3">
                                <span className="font-semibold">{t("total")}</span>
                                <span className="font-semibold">
                                    {formatCurrency(order.total, "EUR", locale)}
                                </span>
                            </div>
                        </div>

                        <RecordPrintForm orderId={order.id} items={recordItems} />

                        <form action={updateOrderStatus} className="flex items-center gap-2">
                            <input type="hidden" name="id" value={order.id} />
                            <select
                                className={inputClass}
                                name="status"
                                defaultValue={order.status}
                            >
                                {orderStatuses.map((s) => (
                                    <option key={s} value={s}>
                                        {tStatus(s)}
                                    </option>
                                ))}
                            </select>
                            <Button type="submit" variant="outline">
                                {t("updateStatus")}
                            </Button>
                        </form>
                    </div>
                )}
            </AdminFormDialog>
        </div>
    );
}
