"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function setFilamentStock(args: { filamentId: string; stockGrams: number }) {
    const stockGrams = Math.round(args.stockGrams);

    if (!Number.isFinite(stockGrams) || stockGrams < 0) return;

    const filament = await db.filament.findUnique({ where: { id: args.filamentId } });

    if (!filament || stockGrams === filament.stockGrams) return;

    const deltaGrams = stockGrams - filament.stockGrams;

    await db.$transaction([
        db.filament.update({
            where: { id: filament.id },
            data: { stockGrams },
        }),
        db.filamentStockLog.create({
            data: {
                filamentId: filament.id,
                deltaGrams,
                reason: "CORRECTION",
            },
        }),
    ]);

    revalidatePath("/admin/products");
    revalidatePath("/admin/filaments");
    revalidatePath("/admin");
}
