import { useMemo } from "react";

import type { ModelStats } from "@/hooks/use-model";
import { estimateGrams, estimateTimeSeconds } from "@/lib/estimate";
import { calculatePrice } from "@/lib/pricing";
import type { Filament, Profile } from "../_utils/types";

export type Quote = {
    grams: number;
    timeSeconds: number;
    price: ReturnType<typeof calculatePrice>;
} | null;

export function useQuote({
    stats,
    profile,
    filament,
    infill,
    supports,
}: {
    stats: ModelStats | null;
    profile: Profile | undefined;
    filament: Filament | undefined;
    infill: number;
    supports: boolean;
}) {
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
