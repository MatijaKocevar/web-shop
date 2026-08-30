"use server";

import { createHash, randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { uploadObject } from "@/lib/storage";
import { estimateGrams, estimateTimeSeconds } from "@/lib/estimate";
import { calculatePrice, round2 } from "@/lib/pricing";
import { setCart, getCart } from "@/lib/cart";

function extFor(format: string): string {
    return format === "3mf" ? "3mf" : "stl";
}

export async function addCustomPrintToCart(formData: FormData) {
    const file = formData.get("file") as File | null;
    const format = (formData.get("format") as string) ?? "stl";
    const profileId = (formData.get("profileId") as string) ?? "";
    const filamentId = (formData.get("filamentId") as string) ?? "";
    const infill = Number(formData.get("infill") ?? 15);
    const supports = formData.get("supports") === "true";
    const width = Number(formData.get("width") ?? 0);
    const depth = Number(formData.get("depth") ?? 0);
    const height = Number(formData.get("height") ?? 0);
    const volume = Number(formData.get("volume") ?? 0);

    if (!file) throw new Error("No file provided.");

    const bytes = Buffer.from(await file.arrayBuffer());
    const hash = createHash("sha256").update(bytes).digest("hex");
    const key = `uploads/${hash}.${extFor(format)}`;

    // Persist the file record (deduplicated by hash+format).
    const [fileRecord] = await Promise.all([
        db.file.upsert({
            where: { hash_format: { hash, format: format === "3mf" ? "THREE_MF" : "STL" } },
            update: {},
            create: {
                key,
                filename: file.name,
                format: format === "3mf" ? "THREE_MF" : "STL",
                size: bytes.length,
                hash,
                volume,
                width,
                depth,
                height,
            },
        }),
        uploadObject(key, bytes, format === "3mf" ? "model/3mf" : "model/stl"),
    ]);

    // Authoritative estimate (recomputed server-side).
    const [profile, filament, marginSetting] = await Promise.all([
        db.printerProfile.findUnique({ where: { id: profileId } }),
        db.filament.findUnique({ where: { id: filamentId } }),
        db.setting.findUnique({ where: { key: "marginPct" } }),
    ]);

    const marginPct = Number(marginSetting?.value ?? 30);

    const grams = estimateGrams(volume, Number(filament?.density ?? 1.24), infill);
    const timeSeconds = estimateTimeSeconds({
        volumeMm3: volume,
        densityGcm3: Number(filament?.density ?? 1.24),
        infillPct: infill,
        nozzleMm: profile?.nozzle ?? 0.4,
        layerHeightMm: profile?.layerHeight ?? 0.2,
        speedMmS: profile?.speed ?? 150,
    });

    const price = calculatePrice({
        grams,
        costPerGram: Number(filament?.costPerGram ?? 0.02),
        timeSeconds,
        machineHourRate: Number(profile?.machineHourRate ?? 5),
        setupFee: Number(profile?.setupFee ?? 1) + (supports ? 1 : 0),
        marginPct,
    });

    const items = await getCart();

    items.push({
        id: randomUUID(),
        type: "CUSTOM_PRINT",
        name: file.name,
        unitPrice: round2(price.total),
        quantity: 1,
        fileId: fileRecord.id,
        profileId: profileId || undefined,
        filamentId: filamentId || undefined,
        infill,
        supports,
    });

    await setCart(items);

    revalidatePath("/", "layout");
}
