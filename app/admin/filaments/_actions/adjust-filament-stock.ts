"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { StockReason } from "@/generated/prisma/client";
import { db } from "@/lib/db";

const VALID_REASONS: StockReason[] = ["ORDER", "STOCK_PRINT", "FAILURE", "RESTOCK", "CORRECTION"];

export async function adjustFilamentStock(formData: FormData) {
    const filamentId = formData.get("filamentId") as string;
    const deltaGrams = Number(formData.get("deltaGrams"));
    const rawReason = formData.get("reason") as string;
    const note = (formData.get("note") as string)?.trim() || null;
    const redirectTo = (formData.get("redirectTo") as string) || "/admin/filaments";

    if (!filamentId || !Number.isFinite(deltaGrams) || deltaGrams === 0) {
        redirect(redirectTo);
    }

    const reason = VALID_REASONS.includes(rawReason as StockReason)
        ? (rawReason as StockReason)
        : "CORRECTION";

    const filament = await db.filament.findUnique({ where: { id: filamentId } });

    if (!filament) {
        redirect(redirectTo);
    }

    const nextStock = Math.max(0, filament.stockGrams + Math.round(deltaGrams));
    const appliedDelta = nextStock - filament.stockGrams;

    await db.$transaction([
        db.filament.update({
            where: { id: filamentId },
            data: { stockGrams: nextStock },
        }),
        db.filamentStockLog.create({
            data: { filamentId, deltaGrams: appliedDelta, reason, note },
        }),
    ]);

    revalidatePath("/admin/filaments");
    revalidatePath(`/admin/filaments/${filamentId}`);
    revalidatePath("/admin");
    redirect(redirectTo);
}
