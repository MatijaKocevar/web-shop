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
import { cn } from "@/lib/utils";
import { addVariantStock } from "../_actions/add-variant-stock";
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
    const [mode, setMode] = useState<"set" | "made">("set");
    const [amount, setAmount] = useState(String(variant.stock));
    const [made, setMade] = useState<{ quantity: number; grams: string } | null>(null);

    function handleOpenChange(next: boolean) {
        if (next) {
            setMode("set");
            setAmount(String(variant.stock));
        }

        setOpen(next);
    }

    function switchMode(nextMode: "set" | "made") {
        setMode(nextMode);
        setAmount("");
    }

    function apply() {
        if (pending || amount === "") return;

        const value = Number(amount);

        if (!Number.isFinite(value) || value < 0) return;

        if (mode === "made") {
            const quantity = Math.round(value);

            if (quantity <= 0) return;

            setOpen(false);
            setMade({
                quantity,
                grams: variant.grams ? String(variant.grams * quantity) : "",
            });
            return;
        }

        const next = Math.round(value);
        const delta = next - variant.stock;

        if (delta > 0) {
            setOpen(false);
            setMade({
                quantity: delta,
                grams: variant.grams ? String(variant.grams * delta) : "",
            });
            return;
        }

        startTransition(async () => {
            await setVariantStock({ variantId: variant.id, stock: next });
        });

        setOpen(false);
    }

    function confirmMade() {
        if (pending || !made) return;

        const grams = Number(made.grams);

        startTransition(async () => {
            await addVariantStock({
                variantId: variant.id,
                quantity: made.quantity,
                gramsUsed: Number.isFinite(grams) && grams > 0 ? grams : 0,
            });
        });

        setMade(null);
    }

    return (
        <div className="flex items-center gap-2">
            <span className="tabular-nums">{variant.stock}</span>
            <Popover open={open} onOpenChange={handleOpenChange}>
                <PopoverTrigger
                    render={<Button variant="ghost" size="icon-sm" title={t("adjustStock")} />}
                >
                    <SlidersHorizontal className="size-3.5" />
                </PopoverTrigger>
                <PopoverContent className="w-56 gap-2 p-3" side="bottom" align="start">
                    <div className="flex rounded-md border p-0.5">
                        <button
                            type="button"
                            className={cn(
                                "flex-1 rounded px-2 py-1 text-xs",
                                mode === "set" && "bg-muted font-medium",
                            )}
                            onClick={() => switchMode("set")}
                        >
                            {t("setMode")}
                        </button>
                        <button
                            type="button"
                            className={cn(
                                "flex-1 rounded px-2 py-1 text-xs",
                                mode === "made" && "bg-muted font-medium",
                            )}
                            onClick={() => switchMode("made")}
                        >
                            {t("madeMode")}
                        </button>
                    </div>
                    <input
                        className={inputClass}
                        type="number"
                        step="1"
                        min="0"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        placeholder={mode === "made" ? t("madePlaceholder") : String(variant.stock)}
                        title={mode === "made" ? t("madePlaceholder") : t("setMode")}
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

            <Dialog open={made !== null} onOpenChange={(next) => !next && setMade(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t("filamentUsedTitle")}</DialogTitle>
                        <DialogDescription>
                            {t("filamentUsedHint", {
                                count: made?.quantity ?? 0,
                                name: variant.name,
                                filament: variant.filament?.name ?? "—",
                            })}
                        </DialogDescription>
                    </DialogHeader>
                    <input
                        className={inputClass}
                        type="number"
                        step="1"
                        min="0"
                        value={made?.grams ?? ""}
                        onChange={(event) =>
                            setMade((current) =>
                                current ? { ...current, grams: event.target.value } : null,
                            )
                        }
                        placeholder={t("gramsUsed")}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setMade(null)}>
                            {t("cancel")}
                        </Button>
                        <Button onClick={confirmMade} disabled={pending}>
                            {pending ? <Loader2 className="size-4 animate-spin" /> : t("confirm")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
