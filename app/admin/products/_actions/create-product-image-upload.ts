"use server";

import { randomUUID } from "node:crypto";
import { presignedUploadUrl } from "@/lib/storage";
import type { ProductImageUploadTarget } from "../_types/product-image-upload";

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export async function createProductImageUpload(
    productId: string,
    filename: string,
    contentType: string,
    size: number,
): Promise<ProductImageUploadTarget> {
    if (!productId || size <= 0 || size > MAX_UPLOAD_BYTES) {
        throw new Error("Invalid upload.");
    }

    const key = `products/${productId}/${randomUUID()}-${filename}`;
    const uploadUrl = await presignedUploadUrl(key, contentType || "image/jpeg");

    return { uploadUrl, key };
}
