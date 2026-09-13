"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function setVariantStock(args: { variantId: string; stock: number }) {
    if (!Number.isFinite(args.stock) || args.stock < 0) return;

    await db.productVariant.update({
        where: { id: args.variantId },
        data: { stock: Math.round(args.stock) },
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin");
}
