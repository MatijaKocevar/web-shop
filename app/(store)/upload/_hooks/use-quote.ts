import { useMemo } from "react";
import type { ModelStats } from "@/lib/model.types";
import { estimateGrams, estimateTimeSeconds } from "@/lib/estimate";
import { calculatePrice } from "@/lib/pricing";
import type { Filament } from "../_types/filament";
import type { Profile } from "../_types/profile";
import type { Quote } from "../_types/quote";

type UseQuoteArgs = {
    stats: ModelStats | null;
    profile: Profile | undefined;
    filament: Filament | undefined;
    infill: number;
    supports: boolean;
};

export function useQuote({ stats, profile, filament, infill, supports }: UseQuoteArgs) {
    const buildVolumeOk = useMemo(() => {
        if (!stats || !profile) return true;

        const { buildX, buildY, buildZ } = profile.printer;

        return stats.width <= buildX && stats.depth <= buildY && stats.height <= buildZ;
    }, [stats, profile]);

    const quote = useMemo<Quote>(() => {
        if (!stats || !profile || !filament) return null;

        const grams = estimateGrams(stats.volume, filament.density, infill);
        const timeSeconds = estimateTimeSeconds({
            volumeMm3: stats.volume,
            densityGcm3: filament.density,
            infillPct: infill,
            nozzleMm: profile.nozzle,
            layerHeightMm: profile.layerHeight,
            speedMmS: profile.speed ?? 150,
        });

        return {
            grams,
            timeSeconds,
            price: calculatePrice({
                grams,
                costPerGram: filament.costPerGram,
                timeSeconds,
                machineHourRate: profile.machineHourRate,
                setupFee: supports ? profile.setupFee + 1 : profile.setupFee,
                marginPct: 30,
            }),
        };
    }, [stats, profile, filament, infill, supports]);

    return { quote, buildVolumeOk };
}
