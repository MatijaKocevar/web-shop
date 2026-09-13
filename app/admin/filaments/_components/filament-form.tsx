import Link from "next/link";
import { Trash2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button, buttonVariants } from "@/components/ui/button";
import { saveFilament } from "../_actions/save-filament";
import { deleteFilament } from "../_actions/delete-filament";
import type { Filament } from "../_types/filament";
import { FilamentColorField } from "./filament-color-field";

const inputClass =
    "rounded-md border bg-background px-3 py-2 text-sm w-full focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

type FilamentFormProps = {
    filament?: Filament;
    defaultMaterial?: string;
};

export async function FilamentForm({ filament, defaultMaterial }: FilamentFormProps) {
    const t = await getTranslations("admin.filaments");
    const tCommon = await getTranslations("admin.common");

    return (
        <div>
            <form action={saveFilament} className="flex flex-col gap-4">
                {filament && <input type="hidden" name="id" value={filament.id} />}

                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">{tCommon("name")}</span>
                    <input
                        className={inputClass}
                        name="name"
                        defaultValue={filament?.name ?? ""}
                        required
                    />
                </label>

                <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">{tCommon("material")}</span>
                        <select
                            className={inputClass}
                            name="material"
                            defaultValue={filament?.material ?? defaultMaterial ?? "PLA"}
                        >
                            {["PLA", "PETG", "ABS", "TPU", "ASA", "PC", "PA"].map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </label>

                    <FilamentColorField
                        defaultName={filament?.color}
                        defaultHex={filament?.colorHex}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">{t("density")}</span>
                        <input
                            className={inputClass}
                            name="density"
                            type="number"
                            step="0.001"
                            min="0"
                            defaultValue={filament?.density ?? 1.24}
                            required
                        />
                    </label>

                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">{t("costPerGram")}</span>
                        <input
                            className={inputClass}
                            name="costPerGram"
                            type="number"
                            step="0.0001"
                            min="0"
                            defaultValue={filament?.costPerGram ?? 0.02}
                            required
                        />
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">{t("stockGrams")}</span>
                        <input
                            className={inputClass}
                            name="stockGrams"
                            type="number"
                            step="1"
                            min="0"
                            defaultValue={filament?.stockGrams ?? 0}
                            required
                        />
                    </label>

                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">{t("lowStockThreshold")}</span>
                        <input
                            className={inputClass}
                            name="lowStockThresholdGrams"
                            type="number"
                            step="1"
                            min="0"
                            defaultValue={filament?.lowStockThresholdGrams ?? 500}
                            required
                        />
                    </label>
                </div>

                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        name="active"
                        defaultChecked={filament?.active ?? true}
                    />
                    <span>{tCommon("active")}</span>
                </label>

                <div className="mt-6 flex items-center justify-between gap-2">
                    {filament ? (
                        <Button
                            type="submit"
                            variant="destructive"
                            size="sm"
                            formAction={deleteFilament}
                        >
                            <Trash2 className="size-4" />
                            {t("deleteFilament")}
                        </Button>
                    ) : (
                        <span />
                    )}
                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/filaments"
                            className={buttonVariants({ variant: "ghost" })}
                        >
                            {tCommon("cancel")}
                        </Link>
                        <Button type="submit">
                            {filament ? tCommon("save") : t("createFilament")}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
