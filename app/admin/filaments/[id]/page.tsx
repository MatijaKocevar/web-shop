import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getFilamentById, listFilamentStockLog } from "@/queries/filaments";
import { FilamentForm } from "../_components/filament-form";
import { StockAdjustForm } from "../_components/stock-adjust-form";
import { StockLogList } from "../_components/stock-log-list";

type EditFilamentPageProps = {
    params: Promise<{ id: string }>;
};

export default async function EditFilamentPage({ params }: EditFilamentPageProps) {
    const { id } = await params;
    const [filament, logs] = await Promise.all([getFilamentById(id), listFilamentStockLog(id)]);
    const t = await getTranslations("admin.filaments");

    if (!filament) notFound();

    const lowStock = filament.stockGrams < filament.lowStockThresholdGrams;

    return (
        <div className="min-h-0 flex-1 overflow-y-auto">
            <p className="mb-6 text-sm text-muted-foreground">
                {filament.name} ·{" "}
                <span className={lowStock ? "font-medium text-destructive" : undefined}>
                    {t("inStock", { grams: filament.stockGrams })}
                </span>{" "}
                · {t("lowStockThresholdShort", { grams: filament.lowStockThresholdGrams })}
            </p>

            <FilamentForm filament={filament} />

            <div className="mt-8 flex flex-col gap-6">
                <StockAdjustForm filamentId={filament.id} />
                <StockLogList logs={logs} />
            </div>
        </div>
    );
}
