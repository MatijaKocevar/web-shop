import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listPrintJobs } from "@/queries/print-jobs";
import { isSlicerAvailable } from "@/lib/slicer";
import { formatCurrency } from "@/lib/pricing";
import { ProcessQueueButton } from "./_components/process-queue-button";
import { updatePrintJobStatus } from "./_actions/update-print-job-status";

const selectClass =
    "rounded-md border bg-background px-2 py-1 text-xs focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

export default async function AdminPrintQueuePage() {
    const jobs = await listPrintJobs();
    const slicerAvailable = await isSlicerAvailable();
    const queued = jobs.filter((j) => j.status === "QUEUED").length;

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Print queue</h1>
                <ProcessQueueButton hasQueued={queued > 0} />
            </div>

            {!slicerAvailable && (
                <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm">
                    OrcaSlicer is not available on this machine. Install it (or set{" "}
                    <code className="font-mono">ORCA_SLICER_BIN</code>) to slice jobs.
                </div>
            )}

            {jobs.length === 0 ? (
                <p className="text-muted-foreground">No print jobs yet.</p>
            ) : (
                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-2 font-medium">Item</th>
                                <th className="px-4 py-2 font-medium">Profile</th>
                                <th className="px-4 py-2 font-medium">Est. time</th>
                                <th className="px-4 py-2 font-medium">Material</th>
                                <th className="px-4 py-2 font-medium">Price</th>
                                <th className="px-4 py-2 font-medium">Status</th>
                                <th className="px-4 py-2 font-medium">Update</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {jobs.map((job) => (
                                <tr key={job.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-2 font-medium">{job.orderItem?.name}</td>
                                    <td className="px-4 py-2 text-muted-foreground">
                                        {job.profile?.name ?? "—"}
                                    </td>
                                    <td className="px-4 py-2 text-muted-foreground">
                                        {job.estimatedSeconds != null
                                            ? formatSeconds(job.estimatedSeconds)
                                            : "—"}
                                    </td>
                                    <td className="px-4 py-2 text-muted-foreground">
                                        {job.grams != null ? `${job.grams.toFixed(1)} g` : "—"}
                                    </td>
                                    <td className="px-4 py-2 text-muted-foreground">
                                        {job.price != null
                                            ? formatCurrency(Number(job.price))
                                            : "—"}
                                    </td>
                                    <td className="px-4 py-2">
                                        <Badge variant="secondary">{job.status}</Badge>
                                        {job.sliceLog && (
                                            <p
                                                className="mt-1 max-w-xs truncate text-xs text-destructive"
                                                title={job.sliceLog}
                                            >
                                                {job.sliceLog}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        <form
                                            action={updatePrintJobStatus}
                                            className="flex items-center gap-1"
                                        >
                                            <input type="hidden" name="id" value={job.id} />
                                            <select
                                                className={selectClass}
                                                name="status"
                                                defaultValue={job.status}
                                            >
                                                {[
                                                    "QUEUED",
                                                    "SLICING",
                                                    "SLICED",
                                                    "PRINTING",
                                                    "DONE",
                                                    "FAILED",
                                                ].map((s) => (
                                                    <option key={s} value={s}>
                                                        {s}
                                                    </option>
                                                ))}
                                            </select>
                                            <Button type="submit" variant="outline" size="sm">
                                                Set
                                            </Button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function formatSeconds(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
