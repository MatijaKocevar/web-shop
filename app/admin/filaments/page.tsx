import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { listFilaments } from "@/queries/filaments";
import { FilamentTable } from "./_components/filament-table";

export default async function AdminFilamentsPage() {
    const filaments = await listFilaments();
    const t = await getTranslations("admin.filaments");

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-6">
            <div className="flex shrink-0 items-center justify-between">
                <h1 className="text-2xl font-semibold">{t("title")}</h1>
                <Link href="/admin/filaments/new" className={buttonVariants()}>
                    {t("new")}
                </Link>
            </div>
            <FilamentTable filaments={filaments} />
        </div>
    );
}
