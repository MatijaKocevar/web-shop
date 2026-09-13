import Link from "next/link";
import { cookies } from "next/headers";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { AdminFormDialog } from "@/components/admin-form-dialog";
import { buttonVariants } from "@/components/ui/button";
import { getFilamentById, listFilaments, listFilamentStockLog } from "@/queries/filaments";
import { FilamentForm } from "./_components/filament-form";
import { FilamentTable } from "./_components/filament-table";
import { StockLogList } from "./_components/stock-log-list";
import { COLLAPSED_FILAMENTS_COOKIE, decodeCollapsed } from "./_utils/collapsed-filaments";

type AdminFilamentsPageProps = {
    searchParams: Promise<{ id?: string; new?: string; material?: string }>;
};

export default async function AdminFilamentsPage({ searchParams }: AdminFilamentsPageProps) {
    const { id, new: isNew, material } = await searchParams;
    const [filaments, editing, logs, store] = await Promise.all([
        listFilaments(),
        id ? getFilamentById(id) : null,
        id ? listFilamentStockLog(id) : [],
        cookies(),
    ]);
    const initialCollapsed = decodeCollapsed(store.get(COLLAPSED_FILAMENTS_COOKIE)?.value);
    const t = await getTranslations("admin.filaments");

    const lowStock = editing ? editing.stockGrams < editing.lowStockThresholdGrams : false;

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <FilamentTable
                filaments={filaments}
                initialCollapsed={initialCollapsed}
                toolbarActions={
                    <Link
                        href="/admin/filaments?new=1"
                        aria-label={t("new")}
                        className={buttonVariants({ size: "sm" })}
                    >
                        <Plus className="size-4" />
                        <span className="hidden sm:inline">{t("new")}</span>
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
                    <FilamentForm defaultMaterial={material} />
                ) : null}
            </AdminFormDialog>
        </div>
    );
}
