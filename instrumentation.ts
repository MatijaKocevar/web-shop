export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs" && process.env.SLICER_AUTO_PROCESS === "1") {
        const { processPrintJobs } = await import("./workers/print-jobs");
        const interval = Number(process.env.SLICER_INTERVAL_MS ?? 60_000);

        setInterval(() => {
            processPrintJobs().catch((err) => {
                console.error("[slicer] auto-process failed:", err);
            });
        }, interval);

        console.log(`[slicer] auto-processing queue every ${interval}ms`);
    }
}
