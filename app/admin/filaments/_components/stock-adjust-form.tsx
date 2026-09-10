import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { adjustFilamentStock } from "../_actions/adjust-filament-stock";

const inputClass =
    "rounded-md border bg-background px-3 py-2 text-sm w-full focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

type StockAdjustFormProps = {
    filamentId: string;
};

export async function StockAdjustForm({ filamentId }: StockAdjustFormProps) {
    const t = await getTranslations("admin.filaments");
    const tReason = await getTranslations("stockReason");

    const reasons = ["RESTOCK", "ORDER", "STOCK_PRINT", "FAILURE", "CORRECTION"] as const;

    return (
        <form action={adjustFilamentStock} className="flex flex-col gap-3 rounded-lg border p-4">
            <p className="font-medium">{t("adjustStock")}</p>

            <input type="hidden" name="filamentId" value={filamentId} />
            <input type="hidden" name="redirectTo" value={`/admin/filaments/${filamentId}`} />

            <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="text-muted-foreground">{t("deltaGrams")}</span>
                    <input
                        className={inputClass}
                        name="deltaGrams"
                        type="number"
                        step="1"
                        required
                    />
                </label>

                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="text-muted-foreground">{t("reason")}</span>
                    <select className={inputClass} name="reason" defaultValue="RESTOCK">
                        {reasons.map((r) => (
                            <option key={r} value={r}>
                                {tReason(r)}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-muted-foreground">{t("note")}</span>
                <input className={inputClass} name="note" placeholder={t("notePlaceholder")} />
            </label>

            <div>
                <Button type="submit" variant="outline" size="sm">
                    {t("applyAdjustment")}
                </Button>
            </div>
        </form>
    );
}
