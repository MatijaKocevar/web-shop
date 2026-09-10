import type { StockReason } from "@/generated/prisma/client";

export type StockLogEntry = {
    id: string;
    deltaGrams: number;
    reason: StockReason;
    note: string | null;
    createdAt: Date;
};
