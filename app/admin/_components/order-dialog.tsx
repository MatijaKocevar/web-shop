import { Download } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { AdminFormDialog } from "@/components/admin-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { estimateGrams } from "@/lib/estimate";
import { formatCurrency } from "@/lib/pricing";
import type { OrderDetail } from "@/queries/orders.types";
import { downloadFile } from "../orders/_actions/download-file";
import { updateOrderStatus } from "../orders/_actions/update-order-status";
import { RecordPrintForm } from "../orders/_components/record-print-form";

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

type OrderDialogProps = {
    order: OrderDetail;
    onCloseHref: string;
};

export async function OrderDialog({ order, onCloseHref }: OrderDialogProps) {
    const locale = await getLocale();
    const t = await getTranslations("admin.orders");
    const tStatus = await getTranslations("status.order");
    const tType = await getTranslations("productType");

    const recordItems = order.items.map((item) => {
        let estimatedGrams: number | null = null;

        if (item.type === "CUSTOM_PRINT" && item.file?.volume && item.filament && item.profile) {
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
            filament: item.filament ? { id: item.filament.id, name: item.filament.name } : null,
            estimatedGrams,
        };
    });

    return (
        <AdminFormDialog
            open
            onCloseHref={onCloseHref}
            title={t("order")}
            description={`${order.email} · ${order.createdAt.toLocaleString(locale)} · ${t(
                "stripeSession",
                { id: order.stripeSessionId ?? "—" },
            )}`}
            className="sm:max-w-2xl lg:max-w-3xl"
        >
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
                                            <Button type="submit" variant="outline" size="sm">
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
            </div>
        </AdminFormDialog>
    );
}
