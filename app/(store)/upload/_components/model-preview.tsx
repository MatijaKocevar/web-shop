import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ModelViewer } from "@/components/model-viewer";
import type { ModelFormat, ModelStats } from "@/lib/model.types";

type ModelPreviewProps = {
    objectUrl: string;
    format: ModelFormat;
    stats: ModelStats | null;
    buildVolumeOk: boolean;
    printerName?: string;
    onStats: (stats: ModelStats) => void;
    onReset: () => void;
};

export function ModelPreview({
    objectUrl,
    format,
    stats,
    buildVolumeOk,
    printerName,
    onStats,
    onReset,
}: ModelPreviewProps) {
    const t = useTranslations("upload");

    return (
        <div className="flex flex-col gap-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted/30">
                <ModelViewer
                    src={objectUrl}
                    format={format}
                    onStats={onStats}
                    className="h-full w-full"
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={onReset}
                >
                    <X className="size-4" />
                    <span className="sr-only">{t("removeModel")}</span>
                </Button>
            </div>

            {stats && (
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span className="rounded-md border px-2 py-1">
                        {stats.width.toFixed(1)} × {stats.depth.toFixed(1)} ×{" "}
                        {stats.height.toFixed(1)} mm
                    </span>
                    <span className="rounded-md border px-2 py-1">
                        {Math.round(stats.volume / 1000)} cm³
                    </span>
                    {!buildVolumeOk && (
                        <span className="rounded-md border border-destructive px-2 py-1 text-destructive">
                            {t("tooLarge", { printer: printerName ?? "" })}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
