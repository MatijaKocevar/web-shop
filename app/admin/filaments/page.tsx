import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AdminFormDialog } from "@/components/admin-form-dialog";
import { buttonVariants } from "@/components/ui/button";
import { getFilamentById, listFilaments, listFilamentStockLog } from "@/queries/filaments";
import { FilamentForm } from "./_components/filament-form";
import { FilamentTable } from "./_components/filament-table";
import { StockLogList } from "./_components/stock-log-list";

type AdminFilamentsPageProps = {
    searchParams: Promise<{ id?: string; new?: string }>;
};

export default async function AdminFilamentsPage({ searchParams }: AdminFilamentsPageProps) {
    const { id, new: isNew } = await searchParams;
    const [filaments, editing, logs] = await Promise.all([
        listFilaments(),
        id ? getFilamentById(id) : null,
        id ? listFilamentStockLog(id) : [],
    ]);
    const t = await getTranslations("admin.filaments");

    const lowStock = editing ? editing.stockGrams < editing.lowStockThresholdGrams : false;

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <FilamentTable
                filaments={filaments}
                toolbarActions={
                    <Link href="/admin/filaments?new=1" className={buttonVariants({ size: "sm" })}>
                        {t("new")}
                    </Link>
                }
            />

            <AdminFormDialog
                open={Boolean(isNew) || Boolean(editing)}
                onCloseHref="/admin/filaments"
                title={editing ? t("edit") : t("newTitle")}
                description={
                    editing
                        ? `${editing.name} · ${lowStock ? "⚠ " : ""}${t("inStock", {
                              grams: editing.stockGrams,
                          })} · ${t("lowStockThresholdShort", {
                              grams: editing.lowStockThresholdGrams,
                          })}`
                        : undefined
                }
                className="sm:max-w-2xl lg:max-w-3xl"
            >
                {editing ? (
                    <>
                        <FilamentForm filament={editing} />
                        <div className="mt-8 flex flex-col gap-6">
                            <StockLogList logs={logs} />
                        </div>
                    </>
                ) : isNew ? (
                    <FilamentForm />
                ) : null}
            </AdminFormDialog>
        </div>
    );
}
