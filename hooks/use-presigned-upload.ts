"use client";

import { useState } from "react";
import { sha256Hex } from "@/lib/hash";

export type PresignedTarget = {
    uploadUrl: string;
    key: string;
};

export type PresignFn = (hash: string) => Promise<PresignedTarget>;

export type PresignedUploadResult = {
    key: string;
    hash: string;
};

export function usePresignedUpload() {
    const [uploading, setUploading] = useState(false);

    async function upload(file: File, presign: PresignFn): Promise<PresignedUploadResult> {
        setUploading(true);

        try {
            const hash = await sha256Hex(file);
            const target = await presign(hash);

            const response = await fetch(target.uploadUrl, {
                method: "PUT",
                body: file,
                headers: { "Content-Type": file.type || "application/octet-stream" },
            });

            if (!response.ok) {
                throw new Error("Upload failed.");
            }

            return { key: target.key, hash };
        } finally {
            setUploading(false);
        }
    }

    return { upload, uploading };
}
