import Link from "next/link";
import { ArrowRight, Upload } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { listProducts } from "@/queries/products";
import { ProductCard } from "./products/_components/product-card";

export default async function HomePage() {
    const products = await listProducts();
    const t = await getTranslations("home");

    return (
        <div className="mx-auto max-w-7xl px-4">
            <section className="py-20 text-center sm:py-28">
                <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
                    {t("heroTitle")}
                </h1>
                <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
                    {t("heroSubtitle")}
                </p>
                <div className="mt-8 flex items-center justify-center gap-3">
                    <Link href="/products" className={buttonVariants({ size: "lg" })}>
                        {t("browseProducts")}
                        <ArrowRight className="size-4" />
                    </Link>
                    <Link
                        href="/upload"
                        className={buttonVariants({ size: "lg", variant: "outline" })}
                    >
                        <Upload className="size-4" />
                        {t("uploadModel")}
                    </Link>
                </div>
            </section>

            {products.length > 0 && (
                <section className="pb-24">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">{t("latestProducts")}</h2>
                        <Link
                            href="/products"
                            className={buttonVariants({ variant: "ghost", size: "sm" })}
                        >
                            {t("viewAll")}
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {products.slice(0, 8).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
