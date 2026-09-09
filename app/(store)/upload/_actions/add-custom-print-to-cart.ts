"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { objectExists } from "@/lib/storage";
import { estimateGrams, estimateTimeSeconds } from "@/lib/estimate";
import { calculatePrice, round2 } from "@/lib/pricing";
import { setCart, getCart, type CartItem } from "@/lib/cart";
import type { AddCustomPrintToCartArgs } from "../_types/add-custom-print-to-cart";

export async function addCustomPrintToCart(args: AddCustomPrintToCartArgs): Promise<CartItem[]> {
    const {
        key,
        filename,
        hash,
        format,
        size,
        profileId,
        filamentId,
        infill,
        supports,
        width,
        depth,
        height,
        volume,
    } = args;

    if (!(await objectExists(key))) {
        throw new Error("Upload not found.");
    }

    const fileRecord = await db.file.upsert({
        where: { hash_format: { hash, format: format === "3mf" ? "THREE_MF" : "STL" } },
        update: {},
        create: {
            key,
            filename,
            format: format === "3mf" ? "THREE_MF" : "STL",
            size,
            hash,
            volume,
            width,
            depth,
            height,
        },
    });

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
        name: filename,
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

    return items;
}
