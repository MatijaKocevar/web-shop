import { useState } from "react";
import { useCartStore } from "@/app/(store)/cart/_stores/cart-store";
import { addCustomPrintToCart } from "../_actions/add-custom-print-to-cart";
import type { AddCustomPrintArgs } from "../_types/add-custom-print";

export function useAddCustomPrint() {
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);

    async function add(args: AddCustomPrintArgs) {
        setAdding(true);

        try {
            const data = new FormData();

            data.append("file", args.file);
            data.append("format", args.format);
            data.append("profileId", args.profile.id);
            data.append("filamentId", args.filament.id);
            data.append("infill", String(args.infill));
            data.append("supports", String(args.supports));
            data.append("width", String(args.stats.width));
            data.append("depth", String(args.stats.depth));
            data.append("height", String(args.stats.height));
            data.append("volume", String(args.stats.volume));

            const items = await addCustomPrintToCart(data);

            useCartStore.setState({ items });

            setAdded(true);
        } finally {
            setAdding(false);
        }
    }

    return { add, adding, added };
}
