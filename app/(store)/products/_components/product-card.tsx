import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type ProductCardProps = {
    product: {
        id: string;
        name: string;
        slug: string;
        price: number | null;
        currency: string;
        type: string;
        category: { name: string } | null;
        images: { key: string; alt: string | null }[];
    };
};

export async function ProductCard({ product }: ProductCardProps) {
    const locale = await getLocale();
    const t = await getTranslations("products");
    const image = product.images[0];

    return (
        <Link href={`/products/${product.slug}`} className="group block">
            <Card className="overflow-hidden">
                <div className="aspect-square bg-muted">
                    {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={`${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${image.key}`}
                            alt={image.alt ?? product.name}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            {t("noImage")}
                        </div>
                    )}
                </div>
                <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium">{product.name}</CardTitle>
                    {product.category && (
                        <Badge variant="secondary" className="w-fit">
                            {product.category.name}
                        </Badge>
                    )}
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">
                        {product.price != null
                            ? new Intl.NumberFormat(locale, {
                                  style: "currency",
                                  currency: product.currency,
                              }).format(product.price)
                            : t("quoteOnUpload")}
                    </p>
                </CardContent>
                <CardFooter className="sr-only" />
            </Card>
        </Link>
    );
}
