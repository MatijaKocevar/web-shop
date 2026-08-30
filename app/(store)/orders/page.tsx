import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/pricing";
import { listOrdersForUser } from "@/queries/orders";

export default async function OrdersPage() {
    const session = await auth();
    if (!session) redirect("/signin?callbackUrl=/orders");

    const orders = await listOrdersForUser(session.user.id);
    const locale = await getLocale();
    const t = await getTranslations("orders");
    const tStatus = await getTranslations("status.order");

    return (
        <div className="mx-auto max-w-4xl px-4 py-10">
            <h1 className="mb-6 text-2xl font-semibold">{t("title")}</h1>

            {orders.length === 0 ? (
                <p className="text-muted-foreground">{t("empty")}</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                        <div key={order.id} className="rounded-xl border p-5">
                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    {order.createdAt.toLocaleDateString(locale)}
                                </span>
                                <Badge variant="secondary">{tStatus(order.status)}</Badge>
                            </div>
                            <ul className="flex flex-col divide-y">
                                {order.items.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex items-center justify-between py-2 text-sm"
                                    >
                                        <span>
                                            {item.name} × {item.quantity}
                                        </span>
                                        <span>
                                            {formatCurrency(
                                                item.unitPrice * item.quantity,
                                                "EUR",
                                                locale,
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-3 flex items-center justify-between border-t pt-3">
                                <span className="font-medium">{t("total")}</span>
                                <span className="font-semibold">
                                    {formatCurrency(order.total, "EUR", locale)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
