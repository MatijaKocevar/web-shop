import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { listOrders } from "@/queries/orders";
import { formatCurrency } from "@/lib/pricing";

export default async function AdminOrdersPage() {
    const orders = await listOrders();

    return (
        <div>
            <h1 className="mb-6 text-2xl font-semibold">Orders</h1>
            <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-left">
                        <tr>
                            <th className="px-4 py-2 font-medium">Date</th>
                            <th className="px-4 py-2 font-medium">Email</th>
                            <th className="px-4 py-2 font-medium">Items</th>
                            <th className="px-4 py-2 font-medium">Total</th>
                            <th className="px-4 py-2 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {orders.map((o) => (
                            <tr key={o.id} className="hover:bg-muted/30">
                                <td className="px-4 py-2 text-muted-foreground">
                                    {o.createdAt.toLocaleDateString()}
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
                                <td className="px-4 py-2">{formatCurrency(o.total)}</td>
                                <td className="px-4 py-2">
                                    <Badge variant="secondary">{o.status}</Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
