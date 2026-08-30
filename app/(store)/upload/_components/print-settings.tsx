import { useTranslations } from "next-intl";
import type { Filament, Profile } from "../_utils/types";
import type { PrintSettings } from "../_hooks/use-print-settings";

type Props = {
    profiles: Profile[];
    filaments: Filament[];
    settings: PrintSettings;
};

export function PrintSettings({ profiles, filaments, settings }: Props) {
    const t = useTranslations("upload");

    return (
        <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium">{t("printerProfile")}</span>
                <select
                    className="rounded-md border bg-background px-2 py-1.5"
                    value={settings.profile?.id ?? ""}
                    onChange={(e) => settings.setProfileId(e.target.value)}
                >
                    {profiles.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium">{t("filament")}</span>
                <select
                    className="rounded-md border bg-background px-2 py-1.5"
                    value={settings.filament?.id ?? ""}
                    onChange={(e) => settings.setFilamentId(e.target.value)}
                >
                    {filaments.map((f) => (
                        <option key={f.id} value={f.id}>
                            {f.material} · {f.color}
                        </option>
                    ))}
                </select>
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium">{t("infill", { value: settings.infill })}</span>
                <input
                    type="range"
                    min={5}
                    max={100}
                    step={5}
                    value={settings.infill}
                    onChange={(e) => settings.setInfill(Number(e.target.value))}
                />
            </label>

            <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    checked={settings.supports}
                    onChange={(e) => settings.setSupports(e.target.checked)}
                />
                <span>{t("supports")}</span>
            </label>
        </div>
    );
}
