import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listPrintJobs } from "@/queries/print-jobs";
import { isSlicerAvailable } from "@/lib/slicer";
import { formatCurrency } from "@/lib/pricing";
import { ProcessQueueButton } from "./_components/process-queue-button";
import { updatePrintJobStatus } from "./_actions/update-print-job-status";

const selectClass =
    "rounded-md border bg-background px-2 py-1 text-xs focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

const printJobStatuses = ["QUEUED", "SLICING", "SLICED", "PRINTING", "DONE", "FAILED"];

export default async function AdminPrintQueuePage() {
    const jobs = await listPrintJobs();
    const slicerAvailable = await isSlicerAvailable();
    const locale = await getLocale();
    const t = await getTranslations("admin.printQueue");
    const tStatus = await getTranslations("status.printJob");
    const queued = jobs.filter((j) => j.status === "QUEUED").length;

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">{t("title")}</h1>
                <ProcessQueueButton hasQueued={queued > 0} />
            </div>

            {!slicerAvailable && (
                <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm">
                    {t.rich("slicerNotAvailable", {
                        code: (chunks) => <code className="font-mono">{chunks}</code>,
                    })}
                </div>
            )}

            {jobs.length === 0 ? (
                <p className="text-muted-foreground">{t("noJobs")}</p>
            ) : (
                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-2 font-medium">{t("item")}</th>
                                <th className="px-4 py-2 font-medium">{t("profile")}</th>
                                <th className="px-4 py-2 font-medium">{t("estTime")}</th>
                                <th className="px-4 py-2 font-medium">{t("material")}</th>
                                <th className="px-4 py-2 font-medium">{t("price")}</th>
                                <th className="px-4 py-2 font-medium">{t("status")}</th>
                                <th className="px-4 py-2 font-medium">{t("update")}</th>
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
                                            ? formatCurrency(Number(job.price), "EUR", locale)
                                            : "—"}
                                    </td>
                                    <td className="px-4 py-2">
                                        <Badge variant="secondary">{tStatus(job.status)}</Badge>
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
                                                {printJobStatuses.map((s) => (
                                                    <option key={s} value={s}>
                                                        {tStatus(s)}
                                                    </option>
                                                ))}
                                            </select>
                                            <Button type="submit" variant="outline" size="sm">
                                                {t("update")}
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
