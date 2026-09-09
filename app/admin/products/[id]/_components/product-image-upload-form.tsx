"use client";

import { useRef } from "react";
import type { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { usePresignedUpload } from "@/hooks/use-presigned-upload";
import { createProductImageUpload } from "../../_actions/create-product-image-upload";
import { uploadProductImage } from "../../_actions/upload-product-image";

const inputClass =
    "rounded-md border bg-background px-3 py-2 text-sm w-full focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

type ProductImageUploadFormProps = {
    productId: string;
};

export function ProductImageUploadForm({ productId }: ProductImageUploadFormProps) {
    const tCommon = useTranslations("admin.common");
    const { upload, uploading } = usePresignedUpload();
    const inputRef = useRef<HTMLInputElement>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const input = inputRef.current;
        const file = input?.files?.[0];
        if (!input || !file) return;

        try {
            const { key } = await upload(file, () =>
                createProductImageUpload(productId, file.name, file.type, file.size),
            );

            await uploadProductImage({ productId, key, alt: file.name });

            input.value = "";
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-4 flex items-center gap-2">
            <input ref={inputRef} type="file" accept="image/*" className={inputClass} />
            <Button type="submit" variant="outline" disabled={uploading}>
                {tCommon("upload")}
            </Button>
        </form>
    );
}
