import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/pricing";
import { getOrderById } from "@/queries/orders";
import { updateOrderStatus } from "../_actions/update-order-status";

const inputClass =
    "rounded-md border bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

export default async function AdminOrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) notFound();

    return (
        <div className="max-w-3xl">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Order</h1>
                <Badge variant="secondary">{order.status}</Badge>
            </div>

            <p className="mb-1 text-sm text-muted-foreground">
                {order.email} · {order.createdAt.toLocaleString()}
            </p>
            <p className="mb-6 text-sm text-muted-foreground">
                Stripe session: {order.stripeSessionId ?? "—"}
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
                                    {item.type} × {item.quantity}
                                    {item.printJob ? ` · print job ${item.printJob.status}` : ""}
                                </p>
                            </div>
                            <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
                        </li>
                    ))}
                </ul>
                <Separator />
                <div className="flex items-center justify-between px-4 py-3">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">{formatCurrency(order.total)}</span>
                </div>
            </div>

            <form action={updateOrderStatus} className="flex items-center gap-2">
                <input type="hidden" name="id" value={order.id} />
                <select className={inputClass} name="status" defaultValue={order.status}>
                    {[
                        "PENDING",
                        "PAID",
                        "PROCESSING",
                        "PRINTING",
                        "SHIPPED",
                        "DELIVERED",
                        "CANCELLED",
                        "REFUNDED",
                    ].map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
                <Button type="submit" variant="outline">
                    Update status
                </Button>
            </form>

            <div className="mt-6">
                <Link
                    href="/admin/orders"
                    className="text-sm text-muted-foreground hover:underline"
                >
                    ← Back to orders
                </Link>
            </div>
        </div>
    );
}
