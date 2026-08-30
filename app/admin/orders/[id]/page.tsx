import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/pricing";
import { getOrderById } from "@/queries/orders";
import { updateOrderStatus } from "../_actions/update-order-status";

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

export default async function AdminOrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const order = await getOrderById(id);
    const locale = await getLocale();
    const t = await getTranslations("admin.orders");
    const tStatus = await getTranslations("status.order");
    const tType = await getTranslations("productType");
    const tJob = await getTranslations("status.printJob");

    if (!order) notFound();

    return (
        <div className="max-w-3xl">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">{t("order")}</h1>
                <Badge variant="secondary">{tStatus(order.status)}</Badge>
            </div>

            <p className="mb-1 text-sm text-muted-foreground">
                {order.email} · {order.createdAt.toLocaleString(locale)}
            </p>
            <p className="mb-6 text-sm text-muted-foreground">
                {t("stripeSession", { id: order.stripeSessionId ?? "—" })}
            </p>

            <div className="mb-6 rounded-lg border">
                <ul className="flex flex-col divide-y">
                    {order.items.map((item) => (
                        <li
                            key={item.id}
                            className="flex items-center justify-between px-4 py-3 text-sm"
                        >
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {tType(item.type)} × {item.quantity}
                                    {item.printJob
                                        ? ` · ${t("printJobStatus", { status: tJob(item.printJob.status) })}`
                                        : ""}
                                </p>
                            </div>
                            <span>
                                {formatCurrency(item.unitPrice * item.quantity, "EUR", locale)}
                            </span>
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

            <form action={updateOrderStatus} className="flex items-center gap-2">
                <input type="hidden" name="id" value={order.id} />
                <select className={inputClass} name="status" defaultValue={order.status}>
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

            <div className="mt-6">
                <Link
                    href="/admin/orders"
                    className="text-sm text-muted-foreground hover:underline"
                >
                    {t("backToOrders")}
                </Link>
            </div>
        </div>
    );
}
