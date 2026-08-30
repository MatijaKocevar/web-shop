export type EstimateInput = {
    volumeMm3: number;
    densityGcm3: number;
    infillPct: number;
    nozzleMm: number;
    layerHeightMm: number;
    speedMmS: number;
};

/** Fraction of the bounding solid actually filled (walls + infill). */
export function solidity(infillPct: number): number {
    const shells = 0.2;
    return shells + (1 - shells) * (infillPct / 100);
}

export function estimateGrams(volumeMm3: number, densityGcm3: number, infillPct: number): number {
    const volumeCm3 = volumeMm3 / 1000;
    return volumeCm3 * densityGcm3 * solidity(infillPct);
}

export function estimateTimeSeconds(input: EstimateInput): number {
    const flowRate = input.nozzleMm * input.layerHeightMm * input.speedMmS;
    if (flowRate <= 0) return 0;
    return (input.volumeMm3 * solidity(input.infillPct)) / flowRate;
}
