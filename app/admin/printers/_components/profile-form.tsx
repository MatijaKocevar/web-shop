import Link from "next/link";
import { Trash2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button, buttonVariants } from "@/components/ui/button";
import { saveProfile } from "../_actions/save-profile";
import { deleteProfile } from "../_actions/delete-profile";
import type { PrinterOption } from "../_types/printer-option";
import type { Profile } from "../_types/profile";

const inputClass =
    "rounded-md border bg-background px-3 py-2 text-sm w-full focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

type ProfileFormProps = {
    profile?: Profile;
    printers: PrinterOption[];
    defaultPrinterId?: string;
};

export async function ProfileForm({ profile, printers, defaultPrinterId }: ProfileFormProps) {
    const t = await getTranslations("admin.printers");
    const tCommon = await getTranslations("admin.common");

    return (
        <div className="max-w-xl">
            <form action={saveProfile} className="flex flex-col gap-4">
                {profile && <input type="hidden" name="id" value={profile.id} />}

                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">{t("printer")}</span>
                    <select
                        className={inputClass}
                        name="printerId"
                        defaultValue={profile?.printerId ?? defaultPrinterId ?? printers[0]?.id}
                        required
                    >
                        {printers.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">{tCommon("name")}</span>
                    <input
                        className={inputClass}
                        name="name"
                        defaultValue={profile?.name ?? ""}
                        required
                    />
                </label>

                <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">{t("nozzle")}</span>
                        <input
                            className={inputClass}
                            name="nozzle"
                            type="number"
                            step="0.05"
                            min="0"
                            defaultValue={profile?.nozzle ?? 0.4}
                            required
                        />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">{t("layerHeight")}</span>
                        <input
                            className={inputClass}
                            name="layerHeight"
                            type="number"
                            step="0.01"
                            min="0.05"
                            defaultValue={profile?.layerHeight ?? 0.2}
                            required
                        />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">{t("infillPct")}</span>
                        <input
                            className={inputClass}
                            name="infill"
                            type="number"
                            min="0"
                            max="100"
                            defaultValue={profile?.infill ?? 15}
                            required
                        />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">{t("speedUnit")}</span>
                        <input
                            className={inputClass}
                            name="speed"
                            type="number"
                            min="0"
                            defaultValue={profile?.speed ?? 200}
                        />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">{t("machineRateEur")}</span>
                        <input
                            className={inputClass}
                            name="machineHourRate"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue={profile?.machineHourRate ?? 5}
                            required
                        />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">{t("setupFee")}</span>
                        <input
                            className={inputClass}
                            name="setupFee"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue={profile?.setupFee ?? 1}
                            required
                        />
                    </label>
                </div>

                <div className="flex items-center gap-4 text-sm">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="supports"
                            defaultChecked={profile?.supports ?? false}
                        />
                        <span>{t("supportsEnabled")}</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="active"
                            defaultChecked={profile?.active ?? true}
                        />
                        <span>{tCommon("active")}</span>
                    </label>
                </div>

                <div className="flex items-center gap-2">
                    <Button type="submit">{profile ? tCommon("save") : t("createProfile")}</Button>
                    <Link href="/admin/printers" className={buttonVariants({ variant: "ghost" })}>
                        {tCommon("cancel")}
                    </Link>
                </div>
            </form>

            {profile && (
                <form action={deleteProfile} className="mt-6">
                    <input type="hidden" name="id" value={profile.id} />
                    <Button type="submit" variant="destructive">
                        <Trash2 className="size-4" />
                        {t("deleteProfile")}
                    </Button>
                </form>
            )}
        </div>
    );
}
