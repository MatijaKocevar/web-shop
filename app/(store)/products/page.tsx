import { getTranslations } from "next-intl/server";
import { listCategories } from "@/queries/categories";
import { listProducts } from "@/queries/products";
import { ProductCard } from "./_components/product-card";
import { ProductFilters } from "./_components/product-filters";

type ProductsPageProps = {
    searchParams: Promise<{
        category?: string;
        type?: string;
        price?: string;
        sort?: string;
        q?: string;
    }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const { category, type, price, sort, q } = await searchParams;
    const [products, categories] = await Promise.all([
        listProducts({ category, type, price, sort, query: q }),
        listCategories(),
    ]);
    const t = await getTranslations("products");

    return (
        <div className="mx-auto max-w-7xl px-4 py-10">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">{t("title")}</h1>
                <p className="text-muted-foreground">
                    {t("itemCount", { count: products.length })}
                </p>
            </div>

            <ProductFilters
                categories={categories.map((item) => ({ slug: item.slug, name: item.name }))}
                category={category ?? ""}
                type={type ?? ""}
                price={price ?? ""}
                sort={sort ?? ""}
                q={q ?? ""}
            />

            {products.length === 0 ? (
                <p className="py-20 text-center text-muted-foreground">{t("empty")}</p>
            ) : (
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
