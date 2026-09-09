import { useState } from "react";
import { useCartStore } from "@/app/(store)/cart/_stores/cart-store";
import { usePresignedUpload } from "@/hooks/use-presigned-upload";
import { addCustomPrintToCart } from "../_actions/add-custom-print-to-cart";
import { createCustomPrintUpload } from "../_actions/create-custom-print-upload";
import type { AddCustomPrintArgs } from "../_types/add-custom-print";

export function useAddCustomPrint() {
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const { upload } = usePresignedUpload();

    async function add(args: AddCustomPrintArgs) {
        setAdding(true);

        try {
            const { key, hash } = await upload(args.file, (fileHash) =>
                createCustomPrintUpload(fileHash, args.format, args.file.size),
            );

            const items = await addCustomPrintToCart({
                key,
                filename: args.file.name,
                hash,
                format: args.format,
                size: args.file.size,
                profileId: args.profile.id,
                filamentId: args.filament.id,
                infill: args.infill,
                supports: args.supports,
                width: args.stats.width,
                depth: args.stats.depth,
                height: args.stats.height,
                volume: args.stats.volume,
            });

            useCartStore.setState({ items });

            setAdded(true);
        } finally {
            setAdding(false);
        }
    }

    return { add, adding, added };
}
