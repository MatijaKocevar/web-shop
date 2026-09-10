"use client";

import { useRef } from "react";
import type { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { usePresignedUpload } from "@/hooks/use-presigned-upload";
import { createProductModelUpload } from "../_actions/create-product-model-upload";
import { uploadProductModel } from "../_actions/upload-product-model";

const inputClass =
    "rounded-md border bg-background px-3 py-2 text-sm w-full focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

type ProductModelUploadFormProps = {
    productId: string;
};

export function ProductModelUploadForm({ productId }: ProductModelUploadFormProps) {
    const tCommon = useTranslations("admin.common");
    const { upload, uploading } = usePresignedUpload();
    const inputRef = useRef<HTMLInputElement>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const input = inputRef.current;
        const file = input?.files?.[0];
        if (!input || !file) return;

        try {
            const { key, hash } = await upload(file, (fileHash) =>
                createProductModelUpload(productId, fileHash, file.name, file.size),
            );

            await uploadProductModel({
                productId,
                key,
                filename: file.name,
                hash,
                size: file.size,
            });

            input.value = "";
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input ref={inputRef} type="file" accept=".stl,.3mf" className={inputClass} />
            <Button type="submit" variant="outline" disabled={uploading}>
                {tCommon("upload")}
            </Button>
        </form>
    );
}
