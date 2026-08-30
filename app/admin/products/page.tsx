import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { listProducts } from "@/queries/products";

export default async function AdminProductsPage() {
    const products = await listProducts();
    const t = await getTranslations("admin.products");
    const tCommon = await getTranslations("admin.common");
    const tType = await getTranslations("productType");

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">{t("title")}</h1>
                <Link href="/admin/products/new" className={buttonVariants()}>
                    {t("new")}
                </Link>
            </div>

            <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-left">
                        <tr>
                            <th className="px-4 py-2 font-medium">{tCommon("name")}</th>
                            <th className="px-4 py-2 font-medium">{tCommon("type")}</th>
                            <th className="px-4 py-2 font-medium">{tCommon("price")}</th>
                            <th className="px-4 py-2 font-medium">{tCommon("category")}</th>
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
                                    <Badge variant="secondary">{tType(p.type)}</Badge>
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
