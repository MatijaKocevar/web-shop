"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function savePrinter(formData: FormData) {
    const id = (formData.get("id") as string) || null;
    const name = (formData.get("name") as string) ?? "";
    const make = (formData.get("make") as string) ?? "";
    const buildX = Number(formData.get("buildX") ?? 0);
    const buildY = Number(formData.get("buildY") ?? 0);
    const buildZ = Number(formData.get("buildZ") ?? 0);
    const active = formData.get("active") === "on";

    const data = { name, make, buildX, buildY, buildZ, active };

    if (id) {
        await db.printer.update({ where: { id }, data });
    } else {
        await db.printer.create({ data });
    }

    revalidatePath("/admin/printers");
    redirect("/admin/printers");
}
