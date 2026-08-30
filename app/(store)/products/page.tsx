import { listProducts } from "@/queries/products";
import { ProductCard } from "./_components/product-card";

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; q?: string }>;
}) {
    const { category, q } = await searchParams;
    const products = await listProducts({ category, query: q });

    return (
        <div className="mx-auto max-w-7xl px-4 py-10">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">Products</h1>
                <p className="text-muted-foreground">
                    {products.length} {products.length === 1 ? "item" : "items"}
                </p>
            </div>

            {products.length === 0 ? (
                <p className="py-20 text-center text-muted-foreground">No products yet.</p>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
