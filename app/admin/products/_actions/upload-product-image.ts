"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { uploadObject } from "@/lib/storage";

export async function uploadProductImage(formData: FormData) {
    const productId = formData.get("productId") as string;
    const file = formData.get("image") as File | null;
    if (!productId || !file || file.size === 0) return;

    const bytes = Buffer.from(await file.arrayBuffer());
    const key = `products/${productId}/${randomUUID()}-${file.name}`;
    await uploadObject(key, bytes, file.type || "image/jpeg");

    const count = await db.productImage.count({ where: { productId } });
    await db.productImage.create({
        data: { productId, key, alt: file.name, sortOrder: count },
    });

    revalidatePath(`/admin/products/${productId}`);
}
