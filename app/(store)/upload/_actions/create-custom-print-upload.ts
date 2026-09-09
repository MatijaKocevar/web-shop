"use server";

import { presignedUploadUrl } from "@/lib/storage";
import type { CustomPrintUploadTarget } from "../_types/custom-print-upload";

const MAX_UPLOAD_BYTES = 200 * 1024 * 1024;

export async function createCustomPrintUpload(
    hash: string,
    format: string,
    size: number,
): Promise<CustomPrintUploadTarget> {
    if (!hash || size <= 0 || size > MAX_UPLOAD_BYTES) {
        throw new Error("Invalid upload.");
    }

    const is3mf = format === "3mf";
    const key = `uploads/${hash}.${is3mf ? "3mf" : "stl"}`;
    const uploadUrl = await presignedUploadUrl(key, is3mf ? "model/3mf" : "model/stl");

    return { uploadUrl, key };
}
