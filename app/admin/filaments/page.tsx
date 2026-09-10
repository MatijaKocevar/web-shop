import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { listFilaments } from "@/queries/filaments";
import { FilamentTable } from "./_components/filament-table";

export default async function AdminFilamentsPage() {
    const filaments = await listFilaments();
    const t = await getTranslations("admin.filaments");

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <FilamentTable
                filaments={filaments}
                toolbarActions={
                    <Link href="/admin/filaments/new" className={buttonVariants({ size: "sm" })}>
                        {t("new")}
                    </Link>
                }
            />
        </div>
    );
}
