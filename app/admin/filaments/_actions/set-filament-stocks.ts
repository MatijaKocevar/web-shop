"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import type { SetFilamentStocksEntry } from "../_types/set-filament-stocks";

export async function setFilamentStocks(entries: SetFilamentStocksEntry[]) {
    const filaments = await db.filament.findMany({
        where: { id: { in: entries.map((entry) => entry.filamentId) } },
    });

    const byId = new Map(filaments.map((filament) => [filament.id, filament]));
    const operations: Prisma.PrismaPromise<unknown>[] = [];

    for (const entry of entries) {
        const filament = byId.get(entry.filamentId);
        const stockGrams = Math.round(entry.stockGrams);

        if (!filament || !Number.isFinite(stockGrams) || stockGrams < 0) continue;
        if (stockGrams === filament.stockGrams) continue;

        const deltaGrams = stockGrams - filament.stockGrams;

        operations.push(
            db.filament.update({
                where: { id: entry.filamentId },
                data: { stockGrams },
            }),
            db.filamentStockLog.create({
                data: {
                    filamentId: entry.filamentId,
                    deltaGrams,
                    reason: deltaGrams > 0 ? "RESTOCK" : "CORRECTION",
                },
            }),
        );
    }

    if (operations.length > 0) {
        await db.$transaction(operations);
    }

    revalidatePath("/admin/filaments");
    revalidatePath("/admin");
}
