import Link from "next/link";
import { ArrowRight, Upload } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { listProducts } from "@/queries/products";
import { ProductCard } from "./products/_components/product-card";

export default async function HomePage() {
    const products = await listProducts();

    return (
        <div className="mx-auto max-w-7xl px-4">
            <section className="py-20 text-center sm:py-28">
                <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
                    Things you can&apos;t find anywhere else, printed for you.
                </h1>
                <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
                    Shop ready-made 3D printed products, or upload your own model and we&apos;ll
                    print it on demand.
                </p>
                <div className="mt-8 flex items-center justify-center gap-3">
                    <Link href="/products" className={buttonVariants({ size: "lg" })}>
                        Browse products
                        <ArrowRight className="size-4" />
                    </Link>
                    <Link
                        href="/upload"
                        className={buttonVariants({ size: "lg", variant: "outline" })}
                    >
                        <Upload className="size-4" />
                        Upload a model
                    </Link>
                </div>
            </section>

            {products.length > 0 && (
                <section className="pb-24">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Latest products</h2>
                        <Link
                            href="/products"
                            className={buttonVariants({ variant: "ghost", size: "sm" })}
                        >
                            View all
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
