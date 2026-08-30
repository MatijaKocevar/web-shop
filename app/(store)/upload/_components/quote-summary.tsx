import { Loader2 } from "lucide-react";

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
    return (
        <>
            <Separator />

            {quote ? (
                <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Material</span>
                        <span>{quote.grams.toFixed(1)} g</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Est. print time</span>
                        <span>{formatDuration(quote.timeSeconds)}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <span className="font-medium">Estimated price</span>
                        <span className="text-xl font-semibold">
                            {formatCurrency(quote.price.total)}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Final price is confirmed by an exact slice before payment.
                    </p>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">Upload a model to see an estimate.</p>
            )}

            <Button
                size="lg"
                disabled={!quote || !buildVolumeOk || adding || added}
                onClick={onAdd}
            >
                {adding ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : added ? (
                    "Added to cart"
                ) : (
                    "Add to cart"
                )}
            </Button>
        </>
    );
}
