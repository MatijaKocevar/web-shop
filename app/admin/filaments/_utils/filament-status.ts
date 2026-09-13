import type { FilamentStatus } from "../_types/filament";

export function getFilamentStatus(
    stockGrams: number,
    lowStockThresholdGrams: number,
): FilamentStatus {
    if (stockGrams <= 0) return "empty";
    if (stockGrams < lowStockThresholdGrams) return "low";

    return "ok";
}
