"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import type { AddVariantStockArgs } from "../_types/add-variant-stock";

export async function addVariantStock(args: AddVariantStockArgs) {
    const variant = await db.productVariant.findUnique({ where: { id: args.variantId } });

    if (!variant || !Number.isFinite(args.quantity) || args.quantity <= 0) return;

    const quantity = Math.round(args.quantity);
    const gramsUsed =
        Number.isFinite(args.gramsUsed) && args.gramsUsed > 0 ? Math.round(args.gramsUsed) : 0;

    const operations: Prisma.PrismaPromise<unknown>[] = [
        db.productVariant.update({
            where: { id: variant.id },
            data: { stock: { increment: quantity } },
        }),
    ];

    if (gramsUsed > 0 && variant.filamentId) {
        const filament = await db.filament.findUnique({ where: { id: variant.filamentId } });

        if (filament) {
            const deducted = Math.min(gramsUsed, filament.stockGrams);

            operations.push(
                db.filament.update({
                    where: { id: filament.id },
                    data: { stockGrams: filament.stockGrams - deducted },
                }),
                db.filamentStockLog.create({
                    data: {
                        filamentId: filament.id,
                        deltaGrams: -deducted,
                        reason: "STOCK_PRINT",
                        note: `${quantity}× ${variant.name}`,
                    },
                }),
            );
        }
    }

    await db.$transaction(operations);

    revalidatePath("/admin/stock");
    revalidatePath("/admin");
    revalidatePath("/admin/filaments");
}
