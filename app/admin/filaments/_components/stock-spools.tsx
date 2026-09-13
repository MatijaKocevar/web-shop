import { cn } from "@/lib/utils";
import type { FilamentStatus } from "../_types/filament";

const SPOOL_GRAMS = 1000;
const MAX_BOXES = 8;

const FILL_CLASS: Record<FilamentStatus, string> = {
    empty: "bg-red-500",
    low: "bg-orange-500",
    ok: "bg-green-500",
};

type StockSpoolsProps = {
    stockGrams: number;
    status: FilamentStatus;
};

export function StockSpools({ stockGrams, status }: StockSpoolsProps) {
    const totalBoxes = Math.max(1, Math.ceil(stockGrams / SPOOL_GRAMS));
    const visibleBoxes = Math.min(totalBoxes, MAX_BOXES);

    return (
        <div className="flex items-center gap-1" title={`${stockGrams} g`}>
            {Array.from({ length: visibleBoxes }, (_, index) => {
                const filled = Math.min(SPOOL_GRAMS, Math.max(0, stockGrams - index * SPOOL_GRAMS));
                const percentage = Math.round((filled / SPOOL_GRAMS) * 100);

                return (
                    <span
                        key={index}
                        className="relative h-5 w-2.5 overflow-hidden rounded-[3px] border border-muted-foreground/50 bg-muted"
                    >
                        <span
                            className={cn("absolute inset-x-0 bottom-0", FILL_CLASS[status])}
                            style={{ height: `${percentage}%` }}
                        />
                    </span>
                );
            })}
            {totalBoxes > MAX_BOXES && (
                <span className="text-xs text-muted-foreground">+{totalBoxes - MAX_BOXES}</span>
            )}
        </div>
    );
}
