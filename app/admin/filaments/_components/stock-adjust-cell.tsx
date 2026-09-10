"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import type { StockReason } from "@/generated/prisma/enums";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const reasons: StockReason[] = ["RESTOCK", "ORDER", "STOCK_PRINT", "FAILURE", "CORRECTION"];

const inputClass =
    "w-full rounded-md border bg-background px-2 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

type StockAdjustCellProps = {
    filamentId: string;
    stockGrams: number;
    lowStockThresholdGrams: number;
    pending: boolean;
    onChange: (filamentId: string, stockGrams: number, reason: StockReason, note: string) => void;
};

export function StockAdjustCell({
    filamentId,
    stockGrams,
    lowStockThresholdGrams,
    pending,
    onChange,
}: StockAdjustCellProps) {
    const t = useTranslations("admin.filaments");
    const tReason = useTranslations("stockReason");
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<"set" | "used">("set");
    const [amount, setAmount] = useState(String(stockGrams));
    const [reason, setReason] = useState<StockReason>("RESTOCK");
    const [note, setNote] = useState("");

    const low = stockGrams < lowStockThresholdGrams;

    function handleOpenChange(next: boolean) {
        if (next) {
            setMode("set");
            setAmount(String(stockGrams));
            setReason("RESTOCK");
            setNote("");
        }

        setOpen(next);
    }

    function switchMode(nextMode: "set" | "used") {
        setMode(nextMode);
        setAmount("");
        setReason(nextMode === "used" ? "STOCK_PRINT" : "RESTOCK");
    }

    function apply() {
        if (amount === "") return;

        const grams = Number(amount);

        if (!Number.isFinite(grams) || grams < 0) return;

        const next = mode === "used" ? Math.max(0, stockGrams - grams) : grams;

        onChange(filamentId, next, reason, note);
        setOpen(false);
    }

    return (
        <div className="flex items-center gap-2">
            {low && <Badge variant="destructive">{t("lowStock")}</Badge>}
            <span className={cn("tabular-nums", pending && "font-medium text-primary")}>
                {stockGrams} g
            </span>
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
                                mode === "used" && "bg-muted font-medium",
                            )}
                            onClick={() => switchMode("used")}
                        >
                            {t("usedMode")}
                        </button>
                    </div>
                    <input
                        className={inputClass}
                        type="number"
                        step="1"
                        min="0"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        placeholder={mode === "used" ? t("gramsUsed") : String(stockGrams)}
                        title={mode === "used" ? t("gramsUsed") : t("setStockTitle")}
                    />
                    <select
                        className={inputClass}
                        value={reason}
                        onChange={(event) => setReason(event.target.value as StockReason)}
                        title={t("reason")}
                    >
                        {reasons.map((r) => (
                            <option key={r} value={r}>
                                {tReason(r)}
                            </option>
                        ))}
                    </select>
                    <input
                        className={inputClass}
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        placeholder={t("notePlaceholder")}
                        title={t("note")}
                    />
                    <Button size="sm" className="w-full" onClick={apply}>
                        {t("applyAdjustment")}
                    </Button>
                </PopoverContent>
            </Popover>
        </div>
    );
}
