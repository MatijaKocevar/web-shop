"use server";

import { createHash } from "node:crypto";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { uploadObject } from "@/lib/storage";

export async function uploadProductModel(formData: FormData) {
    const productId = formData.get("productId") as string;
    const file = formData.get("model") as File | null;
    if (!productId || !file || file.size === 0) return;

    const is3mf = file.name.toLowerCase().endsWith(".3mf");
    const format = is3mf ? "THREE_MF" : "STL";
    const bytes = Buffer.from(await file.arrayBuffer());
    const hash = createHash("sha256").update(bytes).digest("hex");
    const key = `products/${productId}/${hash}.${is3mf ? "3mf" : "stl"}`;

    const fileRecord = await db.file.upsert({
        where: { hash_format: { hash, format } },
        update: {},
        create: {
            key,
            filename: file.name,
            format,
            size: bytes.length,
            hash,
        },
    });
    await uploadObject(key, bytes, is3mf ? "model/3mf" : "model/stl");

    await db.product.update({
        where: { id: productId },
        data: { modelFileId: fileRecord.id },
    });

    revalidatePath(`/admin/products/${productId}`);
}
