"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function saveVariant(formData: FormData) {
    const id = (formData.get("id") as string) || null;
    const productId = formData.get("productId") as string;
    const filamentId = (formData.get("filamentId") as string) || null;
    const gramsRaw = formData.get("grams") as string;
    const grams = gramsRaw ? Number(gramsRaw) : null;
    const priceDeltaRaw = formData.get("priceDelta") as string;
    const priceDelta = priceDeltaRaw ? Number(priceDeltaRaw) : null;

    if (!productId) redirect("/admin/stock");

    const filament = filamentId
        ? await db.filament.findUnique({ where: { id: filamentId } })
        : null;

    if (id) {
        await db.productVariant.update({
            where: { id },
            data: {
                filamentId,
                grams: grams && grams > 0 ? grams : null,
                priceDelta,
            },
        });
    } else {
        await db.productVariant.create({
            data: {
                productId,
                name: filament?.name ?? "Variant",
                filamentId,
                grams: grams && grams > 0 ? grams : null,
                priceDelta,
            },
        });
    }

    revalidatePath("/admin/stock");
    redirect("/admin/stock");
}
