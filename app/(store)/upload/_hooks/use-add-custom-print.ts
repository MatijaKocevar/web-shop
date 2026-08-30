import { useState } from "react";
import type { ModelFormat, ModelStats } from "@/hooks/use-model";
import { addCustomPrintToCart } from "../_actions/add-custom-print-to-cart";
import type { Filament, Profile } from "../_utils/types";

type AddArgs = {
    file: File;
    format: ModelFormat;
    stats: ModelStats;
    profile: Profile;
    filament: Filament;
    infill: number;
    supports: boolean;
};

export function useAddCustomPrint() {
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);

    async function add(args: AddArgs) {
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

            await addCustomPrintToCart(data);

            setAdded(true);
        } finally {
            setAdding(false);
        }
    }

    return { add, adding, added };
}
