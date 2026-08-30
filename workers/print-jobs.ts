import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { db } from "@/lib/db";
import { getObject } from "@/lib/storage";
import { sliceFile, type SliceResult } from "@/lib/slicer";
import { calculatePrice, round2 } from "@/lib/pricing";

type ProcessResult = {
    sliced: number;
    failed: number;
    skipped: number;
};

async function getMargin(): Promise<number> {
    const setting = await db.setting.findUnique({ where: { key: "marginPct" } });
    return Number(setting?.value ?? 30);
}

async function sliceOne(jobId: string): Promise<SliceResult> {
    const job = await db.printJob.findUnique({
        where: { id: jobId },
        include: { file: true, profile: true, filament: true },
    });

    if (!job || !job.file || !job.profile || !job.filament) {
        throw new Error("Job is missing file, profile, or filament.");
    }

    const bytes = await getObject(job.file.key);
    const dir = await mkdtemp(join(tmpdir(), "slice-"));
    const ext = job.file.format === "THREE_MF" ? "3mf" : "stl";
    const inputPath = join(dir, `model.${ext}`);
    const outputPath = join(dir, "model.gcode");

    try {
        await writeFile(inputPath, bytes);

        const result = await sliceFile(inputPath, outputPath, {
            layerHeightMm: job.profile.layerHeight,
            fillDensityPct: job.profile.infill,
            nozzleMm: job.profile.nozzle,
            printSpeedMmS: job.profile.speed ?? 150,
            filamentDensityGcm3: Number(job.filament.density),
            supports: job.profile.supports,
        });

        return result;
    } finally {
        await rm(dir, { recursive: true, force: true });
    }
}

export async function processPrintJobs(): Promise<ProcessResult> {
    const jobs = await db.printJob.findMany({
        where: { status: "QUEUED" },
        include: { file: true, profile: true, filament: true },
        take: 20,
        orderBy: { createdAt: "asc" },
    });

    let sliced = 0;
    let failed = 0;
    const skipped = 0;

    for (const job of jobs) {
        if (!job.file || !job.profile || !job.filament) {
            await db.printJob.update({
                where: { id: job.id },
                data: { status: "FAILED", sliceLog: "Missing file, profile, or filament." },
            });
            failed += 1;
            continue;
        }

        try {
            await db.printJob.update({
                where: { id: job.id },
                data: { status: "SLICING" },
            });

            const result = await sliceOne(job.id);

            const price = calculatePrice({
                grams: result.grams,
                costPerGram: Number(job.filament.costPerGram),
                timeSeconds: result.timeSeconds,
                machineHourRate: Number(job.profile.machineHourRate),
                setupFee: Number(job.profile.setupFee),
                marginPct: await getMargin(),
            });

            await db.printJob.update({
                where: { id: job.id },
                data: {
                    status: "SLICED",
                    estimatedSeconds: Math.round(result.timeSeconds),
                    grams: result.grams,
                    price: round2(price.total),
                    sliceLog: null,
                },
            });

            sliced += 1;
        } catch (err) {
            console.error(`[slicer] job ${job.id} failed:`, err);
            await db.printJob.update({
                where: { id: job.id },
                data: { status: "FAILED", sliceLog: String(err) },
            });
            failed += 1;
        }
    }

    return { sliced, failed, skipped };
}
