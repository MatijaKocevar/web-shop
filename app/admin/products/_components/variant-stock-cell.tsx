"use client";

import { useState, useTransition } from "react";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { setFilamentStock } from "../_actions/set-filament-stock";
import { setVariantStock } from "../_actions/set-variant-stock";
import type { StockVariant } from "../_types/stock-variant";

const inputClass =
    "w-full rounded-md border bg-background px-2 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

type VariantStockCellProps = {
    variant: StockVariant;
};

export function VariantStockCell({ variant }: VariantStockCellProps) {
    const t = useTranslations("admin.stock");
    const [pending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState(String(variant.stock));
    const [filamentInput, setFilamentInput] = useState<string | null>(null);

    function handleOpenChange(next: boolean) {
        if (next) setAmount(String(variant.stock));

        setOpen(next);
    }

    function apply() {
        if (pending || amount === "") return;

        const stock = Math.round(Number(amount));

        if (!Number.isFinite(stock) || stock < 0) return;

        startTransition(async () => {
            await setVariantStock({ variantId: variant.id, stock });
        });

        setOpen(false);

        if (variant.filament) setFilamentInput(String(variant.filament.stockGrams));
    }

    function saveFilament() {
        const filament = variant.filament;

        if (pending || filamentInput === null || !filament) return;

        const stockGrams = Math.round(Number(filamentInput));

        if (!Number.isFinite(stockGrams) || stockGrams < 0) return;

        startTransition(async () => {
            await setFilamentStock({ filamentId: filament.id, stockGrams });
        });

        setFilamentInput(null);
    }

    return (
        <>
            <Popover open={open} onOpenChange={handleOpenChange}>
                <PopoverTrigger
                    render={<Button variant="ghost" size="icon-sm" title={t("adjustStock")} />}
                >
                    <SlidersHorizontal className="size-3.5" />
                </PopoverTrigger>
                <PopoverContent className="w-56 gap-2 p-3" side="bottom" align="start">
                    <input
                        className={inputClass}
                        type="number"
                        step="1"
                        min="0"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        placeholder={t("setMode")}
                        title={t("setMode")}
                    />
                    <Button size="sm" className="w-full" onClick={apply} disabled={pending}>
                        {pending ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            t("applyAdjustment")
                        )}
                    </Button>
                </PopoverContent>
            </Popover>

            <Dialog
                open={filamentInput !== null}
                onOpenChange={(next) => !next && setFilamentInput(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t("filamentStockTitle")}</DialogTitle>
                        <DialogDescription>
                            {t("filamentStockHint", { filament: variant.filament?.name ?? "—" })}
                        </DialogDescription>
                    </DialogHeader>
                    <input
                        className={inputClass}
                        type="number"
                        step="1"
                        min="0"
                        value={filamentInput ?? ""}
                        onChange={(event) => setFilamentInput(event.target.value)}
                        placeholder={t("grams")}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFilamentInput(null)}>
                            {t("skip")}
                        </Button>
                        <Button onClick={saveFilament} disabled={pending}>
                            {pending ? <Loader2 className="size-4 animate-spin" /> : t("confirm")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
