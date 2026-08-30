"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

export async function saveProfile(formData: FormData) {
    const id = (formData.get("id") as string) || null;
    const printerId = formData.get("printerId") as string;
    const name = (formData.get("name") as string) ?? "";
    const nozzle = Number(formData.get("nozzle") ?? 0.4);
    const layerHeight = Number(formData.get("layerHeight") ?? 0.2);
    const infill = Number(formData.get("infill") ?? 15);
    const speedRaw = formData.get("speed") as string;
    const speed = speedRaw ? Number(speedRaw) : null;
    const machineHourRate = Number(formData.get("machineHourRate") ?? 5);
    const setupFee = Number(formData.get("setupFee") ?? 1);
    const supports = formData.get("supports") === "on";
    const active = formData.get("active") === "on";

    const data = {
        printerId,
        name,
        nozzle,
        layerHeight,
        infill,
        speed,
        machineHourRate,
        setupFee,
        supports,
        active,
    };

    if (id) {
        await db.printerProfile.update({ where: { id }, data });
    } else {
        await db.printerProfile.create({ data });
    }

    revalidatePath("/admin/printers");
    redirect("/admin/printers");
}
