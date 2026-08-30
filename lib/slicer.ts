import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export type SliceOptions = {
    layerHeightMm: number;
    fillDensityPct: number;
    nozzleMm: number;
    printSpeedMmS: number;
    filamentDensityGcm3: number;
    supports: boolean;
};

export type SliceResult = {
    timeSeconds: number;
    grams: number;
    materialMm: number;
};

function parseTime(value: string): number {
    let total = 0;
    const h = value.match(/(\d+(?:\.\d+)?)h/);
    const m = value.match(/(\d+(?:\.\d+)?)m/);
    const s = value.match(/(\d+(?:\.\d+)?)s/);
    if (h) total += parseFloat(h[1]) * 3600;
    if (m) total += parseFloat(m[1]) * 60;
    if (s) total += parseFloat(s[1]);
    return total;
}

export function parseGcodeHeader(gcode: string): SliceResult {
    const timeLine = gcode.match(/estimated printing time \(normal mode\) = ([^\n]+)/);
    const gramsLine = gcode.match(/filament used \[g\] = ([\d.]+)/);
    const mmLine = gcode.match(/filament used \[mm\] = ([\d.]+)/);

    return {
        timeSeconds: timeLine ? parseTime(timeLine[1]) : 0,
        grams: gramsLine ? parseFloat(gramsLine[1]) : 0,
        materialMm: mmLine ? parseFloat(mmLine[1]) : 0,
    };
}

export function slicerBinary(): string {
    return process.env.ORCA_SLICER_BIN ?? "orca-slicer";
}

export async function isSlicerAvailable(): Promise<boolean> {
    try {
        await execFileAsync(slicerBinary(), ["--version"], { timeout: 10_000 });
        return true;
    } catch {
        return false;
    }
}

/**
 * Slice a model headless with OrcaSlicer and parse time/material from the
 * resulting G-code header. Settings are passed as CLI flags so no config
 * bundle is required.
 */
export async function sliceFile(
    inputPath: string,
    outputGcodePath: string,
    options: SliceOptions,
): Promise<SliceResult> {
    const args = [
        "--export-gcode",
        "--output",
        outputGcodePath,
        "--layer-height",
        String(options.layerHeightMm),
        "--fill-density",
        `${options.fillDensityPct}%`,
        "--nozzle-diameter",
        String(options.nozzleMm),
        "--print-speed",
        String(options.printSpeedMmS),
        "--filament-density",
        String(options.filamentDensityGcm3),
        "--support-material",
        options.supports ? "1" : "0",
        inputPath,
    ];

    const { stderr } = await execFileAsync(slicerBinary(), args, {
        timeout: 10 * 60_000,
    });

    if (stderr) {
        console.warn("[slicer]", stderr);
    }

    const gcode = await readFile(outputGcodePath, "utf-8");

    return parseGcodeHeader(gcode);
}
