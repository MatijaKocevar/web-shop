import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { listOrders } from "@/queries/orders";
import { formatCurrency } from "@/lib/pricing";

export default async function AdminOrdersPage() {
    const orders = await listOrders();
    const locale = await getLocale();
    const t = await getTranslations("admin.orders");
    const tStatus = await getTranslations("status.order");

    return (
        <div>
            <h1 className="mb-6 text-2xl font-semibold">{t("title")}</h1>
            <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-left">
                        <tr>
                            <th className="px-4 py-2 font-medium">{t("date")}</th>
                            <th className="px-4 py-2 font-medium">{t("email")}</th>
                            <th className="px-4 py-2 font-medium">{t("items")}</th>
                            <th className="px-4 py-2 font-medium">{t("total")}</th>
                            <th className="px-4 py-2 font-medium">{t("status")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {orders.map((o) => (
                            <tr key={o.id} className="hover:bg-muted/30">
                                <td className="px-4 py-2 text-muted-foreground">
                                    {o.createdAt.toLocaleDateString(locale)}
                                </td>
                                <td className="px-4 py-2">
                                    <Link
                                        href={`/admin/orders/${o.id}`}
                                        className="font-medium hover:underline"
                                    >
                                        {o.email}
                                    </Link>
                                </td>
                                <td className="px-4 py-2">{o.items.length}</td>
                                <td className="px-4 py-2">
                                    {formatCurrency(o.total, "EUR", locale)}
                                </td>
                                <td className="px-4 py-2">
                                    <Badge variant="secondary">{tStatus(o.status)}</Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
