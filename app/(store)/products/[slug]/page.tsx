import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { getProductBySlug } from "@/queries/products";
import { AddToCartForm } from "./_components/add-to-cart-form";
import { publicUrl } from "@/lib/storage-url";
import { ModelViewer } from "@/components/model-viewer";

type ProductDetailPageProps = {
    params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    const locale = await getLocale();
    const t = await getTranslations("products");

    if (!product) notFound();

    return (
        <div className="mx-auto max-w-7xl px-4 py-10">
            <div className="grid gap-8 lg:grid-cols-2">
                <div className="aspect-square overflow-hidden rounded-xl bg-muted">
                    {product.modelFile ? (
                        <ModelViewer
                            src={publicUrl(product.modelFile.key)}
                            format={product.modelFile.format === "THREE_MF" ? "3mf" : "stl"}
                            className="h-full w-full"
                        />
                    ) : product.images.length > 0 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={publicUrl(product.images[0].key)}
                            alt={product.images[0].alt ?? product.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            {t("noPreview")}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold">{product.name}</h1>
                        {product.category && (
                            <Badge variant="secondary" className="mt-2">
                                {product.category.name}
                            </Badge>
                        )}
                    </div>

                    {product.price != null && (
                        <p className="text-2xl font-semibold">
                            {new Intl.NumberFormat(locale, {
                                style: "currency",
                                currency: product.currency,
                            }).format(product.price)}
                        </p>
                    )}

                    {product.description && (
                        <p className="text-muted-foreground">{product.description}</p>
                    )}

                    <div className="mt-auto">
                        <AddToCartForm
                            productId={product.id}
                            productName={product.name}
                            basePrice={product.price}
                            variants={product.variants.map((v) => ({
                                id: v.id,
                                name: v.name,
                                price: v.price,
                            }))}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
