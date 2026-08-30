import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { listProducts } from "@/queries/products";

export default async function AdminProductsPage() {
    const products = await listProducts();

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Products</h1>
                <Link href="/admin/products/new" className={buttonVariants()}>
                    New product
                </Link>
            </div>

            <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-left">
                        <tr>
                            <th className="px-4 py-2 font-medium">Name</th>
                            <th className="px-4 py-2 font-medium">Type</th>
                            <th className="px-4 py-2 font-medium">Price</th>
                            <th className="px-4 py-2 font-medium">Category</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {products.map((p) => (
                            <tr key={p.id} className="hover:bg-muted/30">
                                <td className="px-4 py-2">
                                    <Link
                                        href={`/admin/products/${p.id}`}
                                        className="font-medium hover:underline"
                                    >
                                        {p.name}
                                    </Link>
                                </td>
                                <td className="px-4 py-2">
                                    <Badge variant="secondary">{p.type}</Badge>
                                </td>
                                <td className="px-4 py-2">
                                    {p.price != null ? `€${p.price.toFixed(2)}` : "—"}
                                </td>
                                <td className="px-4 py-2 text-muted-foreground">
                                    {p.category?.name ?? "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
