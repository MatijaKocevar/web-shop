"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function saveFilament(formData: FormData) {
    const id = (formData.get("id") as string) || null;
    const name = (formData.get("name") as string) ?? "";
    const material = (formData.get("material") as string) ?? "PLA";
    const color = (formData.get("color") as string) ?? "";
    const density = Number(formData.get("density") ?? 1.24);
    const costPerGram = Number(formData.get("costPerGram") ?? 0.02);
    const stockGrams = Math.max(0, Math.round(Number(formData.get("stockGrams") ?? 0)));
    const lowStockThresholdGrams = Math.max(
        0,
        Math.round(Number(formData.get("lowStockThresholdGrams") ?? 500)),
    );
    const active = formData.get("active") === "on";

    const data = {
        name,
        material,
        color,
        density,
        costPerGram,
        stockGrams,
        lowStockThresholdGrams,
        active,
    };

    if (id) {
        await db.filament.update({ where: { id }, data });
    } else {
        await db.filament.create({ data });
    }

    revalidatePath("/admin/filaments");
    redirect("/admin/filaments");
}
