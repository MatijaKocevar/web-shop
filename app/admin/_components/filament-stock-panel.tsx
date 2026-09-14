import { Layers } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import type { listFilaments } from "@/queries/filaments";

type FilamentStockPanelProps = {
    filaments: Awaited<ReturnType<typeof listFilaments>>;
};

function hueFromString(value: string): number {
    let hash = 0;

    for (const char of value) {
        hash = (hash * 31 + char.charCodeAt(0)) % 360;
    }

    return hash;
}

export async function FilamentStockPanel({ filaments }: FilamentStockPanelProps) {
    const t = await getTranslations("admin.strategy");

    return (
        <section className="min-w-0 rounded-xl border bg-card p-5">
            <div className="mb-4 flex items-start gap-3">
                <div className="rounded-lg border bg-muted/50 p-2 text-amber-600">
                    <Layers className="size-5" />
                </div>
                <div>
                    <h2 className="font-semibold">{t("filamentStock")}</h2>
                    <p className="text-sm text-muted-foreground">{t("filamentStockHint")}</p>
                </div>
            </div>

            <div className="flex max-h-64 flex-col gap-4 overflow-y-auto pr-2 lg:max-h-[480px]">
                {filaments.map((f) => {
                    const pct = Math.min(
                        100,
                        Math.round((f.stockGrams / f.lowStockThresholdGrams) * 100),
                    );
                    const low = f.stockGrams < f.lowStockThresholdGrams;

                    return (
                        <div key={f.id} className="flex flex-col gap-1.5">
                            <div className="flex min-w-0 items-center justify-between gap-2 text-sm">
                                <span className="flex min-w-0 items-center gap-2 font-medium">
                                    <span
                                        className="size-2.5 shrink-0 rounded-full"
                                        style={{
                                            backgroundColor: `hsl(${hueFromString(f.color)} 70% 45%)`,
                                        }}
                                    />
                                    <span className="truncate">{f.name}</span>
                                </span>
                                <span
                                    className={cn(
                                        "shrink-0 tabular-nums",
                                        low && "font-medium text-destructive",
                                    )}
                                >
                                    {f.stockGrams} g
                                    <span className="text-muted-foreground">
                                        {" "}
                                        / {t("threshold", { grams: f.lowStockThresholdGrams })}
                                    </span>
                                </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-muted">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all",
                                        low ? "bg-destructive" : "bg-green-500",
                                    )}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
