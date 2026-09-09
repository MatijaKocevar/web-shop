"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { objectExists } from "@/lib/storage";
import type { CommitProductModelArgs } from "../_types/commit-product-model";

export async function uploadProductModel(args: CommitProductModelArgs) {
    const { productId, key, filename, hash, size } = args;
    if (!productId || !key) return;

    if (!(await objectExists(key))) {
        throw new Error("Upload not found.");
    }

    const is3mf = filename.toLowerCase().endsWith(".3mf");
    const format = is3mf ? "THREE_MF" : "STL";

    const fileRecord = await db.file.upsert({
        where: { hash_format: { hash, format } },
        update: {},
        create: { key, filename, format, size, hash },
    });
    await db.product.update({
        where: { id: productId },
        data: { modelFileId: fileRecord.id },
    });

    revalidatePath(`/admin/products/${productId}`);
}
