import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { getHydratedCart } from "@/queries/cart";
import { CartItems } from "./_components/cart-items";
import { CartSummary } from "./_components/cart-summary";

export default async function CartPage() {
    const { items, subtotal } = await getHydratedCart();
    const t = await getTranslations("cart");

    if (items.length === 0) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-20 text-center">
                <h1 className="mb-4 text-2xl font-semibold">{t("emptyTitle")}</h1>
                <p className="mb-6 text-muted-foreground">{t("emptySubtitle")}</p>
                <Link href="/products" className={buttonVariants()}>
                    {t("browseProducts")}
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-10">
            <h1 className="mb-6 text-2xl font-semibold">{t("title")}</h1>
            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                <CartItems items={items} />
                <aside className="h-fit rounded-xl border p-5">
                    <CartSummary subtotal={subtotal} />
                </aside>
            </div>
        </div>
    );
}
