import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDuration } from "@/lib/pricing";
import type { Quote } from "../_hooks/use-quote";

type Props = {
    quote: Quote;
    buildVolumeOk: boolean;
    adding: boolean;
    added: boolean;
    onAdd: () => void;
};

export function QuoteSummary({ quote, buildVolumeOk, adding, added, onAdd }: Props) {
    const locale = useLocale();
    const t = useTranslations("upload");

    return (
        <>
            <Separator />

            {quote ? (
                <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("material")}</span>
                        <span>{quote.grams.toFixed(1)} g</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("printTime")}</span>
                        <span>{formatDuration(quote.timeSeconds)}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <span className="font-medium">{t("estimatedPrice")}</span>
                        <span className="text-xl font-semibold">
                            {formatCurrency(quote.price.total, "EUR", locale)}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t("finalPriceNote")}</p>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">{t("uploadHint")}</p>
            )}

            <Button
                size="lg"
                disabled={!quote || !buildVolumeOk || adding || added}
                onClick={onAdd}
            >
                {adding ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : added ? (
                    t("addedToCart")
                ) : (
                    t("addToCart")
                )}
            </Button>
        </>
    );
}
