"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModelPreview } from "./model-preview";
import { PrintSettings } from "./print-settings";
import { QuoteSummary } from "./quote-summary";
import { UploadDropzone } from "./upload-dropzone";
import { useAddCustomPrint } from "../_hooks/use-add-custom-print";
import { usePrintSettings } from "../_hooks/use-print-settings";
import { useQuote } from "../_hooks/use-quote";
import { useUpload } from "../_hooks/use-upload";
import type { Filament } from "../_types/filament";
import type { Profile } from "../_types/profile";

type UploadWizardProps = {
    profiles: Profile[];
    filaments: Filament[];
};

export function UploadWizard({ profiles, filaments }: UploadWizardProps) {
    const t = useTranslations("upload");
    const upload = useUpload();
    const settings = usePrintSettings(profiles, filaments);
    const { quote, buildVolumeOk } = useQuote({
        stats: upload.stats,
        profile: settings.profile,
        filament: settings.filament,
        infill: settings.infill,
        supports: settings.supports,
    });
    const { add, adding, added } = useAddCustomPrint();

    function handleAdd() {
        if (
            !upload.file ||
            !upload.format ||
            !upload.stats ||
            !settings.profile ||
            !settings.filament
        ) {
            return;
        }

        add({
            file: upload.file,
            format: upload.format,
            stats: upload.stats,
            profile: settings.profile,
            filament: settings.filament,
            infill: settings.infill,
            supports: settings.supports,
        });
    }

    return (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="flex flex-col gap-4">
                {!upload.file ? (
                    <UploadDropzone {...upload.dropzone} />
                ) : (
                    <ModelPreview
                        objectUrl={upload.objectUrl ?? ""}
                        format={upload.format ?? "stl"}
                        stats={upload.stats}
                        buildVolumeOk={buildVolumeOk}
                        printerName={settings.profile?.printer.name}
                        onStats={upload.setStats}
                        onReset={upload.reset}
                    />
                )}

                {upload.error && <p className="text-sm text-destructive">{upload.error}</p>}
            </div>

            <Card className="h-fit">
                <CardHeader>
                    <CardTitle>{t("printSettings")}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <PrintSettings profiles={profiles} filaments={filaments} settings={settings} />
                    <QuoteSummary
                        quote={quote}
                        buildVolumeOk={buildVolumeOk}
                        adding={adding}
                        added={added}
                        onAdd={handleAdd}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
