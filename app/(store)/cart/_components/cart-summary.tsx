import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/pricing";

type CartSummaryProps = {
    subtotal: number;
};

export async function CartSummary({ subtotal }: CartSummaryProps) {
    const locale = await getLocale();
    const t = await getTranslations("cart");

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("subtotal")}</span>
                <span className="font-medium">{formatCurrency(subtotal, "EUR", locale)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
                <span className="font-semibold">{t("total")}</span>
                <span className="text-xl font-semibold">
                    {formatCurrency(subtotal, "EUR", locale)}
                </span>
            </div>
            <Link href="/checkout" className={buttonVariants({ size: "lg" })}>
                {t("checkout")}
            </Link>
        </div>
    );
}
