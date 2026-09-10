import type { StockReason } from "@/generated/prisma/enums";

export type SetFilamentStocksEntry = {
    filamentId: string;
    stockGrams: number;
    reason?: StockReason;
    note?: string;
};
