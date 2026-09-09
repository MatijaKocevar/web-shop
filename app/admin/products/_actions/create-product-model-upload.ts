"use server";

import { presignedUploadUrl } from "@/lib/storage";
import type { ProductModelUploadTarget } from "../_types/product-model-upload";

const MAX_UPLOAD_BYTES = 200 * 1024 * 1024;

export async function createProductModelUpload(
    productId: string,
    hash: string,
    filename: string,
    size: number,
): Promise<ProductModelUploadTarget> {
    if (!productId || !hash || size <= 0 || size > MAX_UPLOAD_BYTES) {
        throw new Error("Invalid upload.");
    }

    const is3mf = filename.toLowerCase().endsWith(".3mf");
    const key = `products/${productId}/${hash}.${is3mf ? "3mf" : "stl"}`;
    const uploadUrl = await presignedUploadUrl(key, is3mf ? "model/3mf" : "model/stl");

    return { uploadUrl, key };
}
