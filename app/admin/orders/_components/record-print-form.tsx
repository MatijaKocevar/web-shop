import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { recordPrint } from "../_actions/record-print";

const inputClass =
    "rounded-md border bg-background px-3 py-2 text-sm w-full focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

type RecordPrintItem = {
    id: string;
    name: string;
    quantity: number;
    filament: { id: string; name: string } | null;
    estimatedGrams: number | null;
};

type RecordPrintFormProps = {
    orderId: string;
    items: RecordPrintItem[];
};

export async function RecordPrintForm({ orderId, items }: RecordPrintFormProps) {
    const t = await getTranslations("admin.orders");
    const tStatus = await getTranslations("status.order");

    const printable = items.filter((i) => i.filament);

    return (
        <form action={recordPrint} className="flex flex-col gap-3 rounded-lg border p-4">
            <p className="font-medium">{t("recordPrint")}</p>
            <p className="text-sm text-muted-foreground">{t("recordPrintHint")}</p>

            <input type="hidden" name="orderId" value={orderId} />

            {printable.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("noFilamentItems")}</p>
            ) : (
                printable.map((item) => (
                    <label key={item.id} className="flex flex-col gap-1.5 text-sm">
                        <span>
                            {item.name} · {item.filament?.name}
                        </span>
                        <div className="flex items-center gap-2">
                            <input
                                className={inputClass}
                                name={`grams-${item.id}`}
                                type="number"
                                step="1"
                                min="0"
                                defaultValue={
                                    item.estimatedGrams
                                        ? Math.round(item.estimatedGrams * item.quantity)
                                        : undefined
                                }
                                placeholder={t("gramsUsed")}
                            />
                            <span className="text-muted-foreground">g</span>
                        </div>
                    </label>
                ))
            )}

            <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-muted-foreground">{t("note")}</span>
                <input className={inputClass} name="note" placeholder={t("notePlaceholder")} />
            </label>

            <div className="flex items-center gap-2">
                <select className={inputClass} name="status" defaultValue="">
                    <option value="">{t("keepStatus")}</option>
                    {["PROCESSING", "PRINTING", "SHIPPED", "DELIVERED"].map((s) => (
                        <option key={s} value={s}>
                            {tStatus(s)}
                        </option>
                    ))}
                </select>
                <Button type="submit" variant="outline">
                    {t("recordPrintSubmit")}
                </Button>
            </div>
        </form>
    );
}
