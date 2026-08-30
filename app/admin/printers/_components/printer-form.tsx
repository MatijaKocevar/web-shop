import Link from "next/link";
import { Trash2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button, buttonVariants } from "@/components/ui/button";
import { savePrinter } from "../_actions/save-printer";
import { deletePrinter } from "../_actions/delete-printer";

const inputClass =
    "rounded-md border bg-background px-3 py-2 text-sm w-full focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

type Printer = {
    id: string;
    name: string;
    make: string;
    buildX: number;
    buildY: number;
    buildZ: number;
    active: boolean;
};

export async function PrinterForm({ printer }: { printer?: Printer }) {
    const t = await getTranslations("admin.printers");
    const tCommon = await getTranslations("admin.common");

    return (
        <div className="max-w-xl">
            <form action={savePrinter} className="flex flex-col gap-4">
                {printer && <input type="hidden" name="id" value={printer.id} />}

                <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">{tCommon("name")}</span>
                        <input
                            className={inputClass}
                            name="name"
                            defaultValue={printer?.name ?? ""}
                            required
                        />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">{t("make")}</span>
                        <input
                            className={inputClass}
                            name="make"
                            defaultValue={printer?.make ?? ""}
                        />
                    </label>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">{t("buildX")}</span>
                        <input
                            className={inputClass}
                            name="buildX"
                            type="number"
                            min="0"
                            defaultValue={printer?.buildX ?? 220}
                            required
                        />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">{t("buildY")}</span>
                        <input
                            className={inputClass}
                            name="buildY"
                            type="number"
                            min="0"
                            defaultValue={printer?.buildY ?? 220}
                            required
                        />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">{t("buildZ")}</span>
                        <input
                            className={inputClass}
                            name="buildZ"
                            type="number"
                            min="0"
                            defaultValue={printer?.buildZ ?? 250}
                            required
                        />
                    </label>
                </div>

                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="active" defaultChecked={printer?.active ?? true} />
                    <span>{tCommon("active")}</span>
                </label>

                <div className="flex items-center gap-2">
                    <Button type="submit">{printer ? tCommon("save") : t("createPrinter")}</Button>
                    <Link href="/admin/printers" className={buttonVariants({ variant: "ghost" })}>
                        {tCommon("cancel")}
                    </Link>
                </div>
            </form>

            {printer && (
                <form action={deletePrinter} className="mt-6">
                    <input type="hidden" name="id" value={printer.id} />
                    <Button type="submit" variant="destructive">
                        <Trash2 className="size-4" />
                        {t("deletePrinter")}
                    </Button>
                </form>
            )}
        </div>
    );
}
