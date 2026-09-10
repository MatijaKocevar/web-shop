import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AdminTable } from "@/components/admin-table";
import { buttonVariants } from "@/components/ui/button";
import { listPrintersWithProfiles } from "@/queries/printers";

export default async function AdminPrintersPage() {
    const printers = await listPrintersWithProfiles();
    const t = await getTranslations("admin.printers");

    const columns = [
        { label: t("profile") },
        { label: t("layer") },
        { label: t("infill") },
        { label: t("speed") },
        { label: t("machineRate") },
    ];

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto">
            <div className="flex shrink-0 items-center justify-between">
                <h1 className="text-2xl font-semibold">{t("title")}</h1>
                <div className="flex gap-2">
                    <Link
                        href="/admin/printers/profile/new"
                        className={buttonVariants({ variant: "outline" })}
                    >
                        {t("newProfile")}
                    </Link>
                    <Link href="/admin/printers/new" className={buttonVariants()}>
                        {t("newPrinter")}
                    </Link>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {printers.map((printer) => {
                    const rows = printer.profiles.map((profile) => ({
                        key: profile.id,
                        cells: [
                            {
                                content: (
                                    <Link
                                        href={`/admin/printers/profile/${profile.id}`}
                                        className="font-medium hover:underline"
                                    >
                                        {profile.name}
                                    </Link>
                                ),
                            },
                            { content: `${profile.layerHeight} mm` },
                            { content: `${profile.infill}%` },
                            { content: `${profile.speed ?? "—"} mm/s` },
                            { content: `€${Number(profile.machineHourRate).toFixed(2)}/h` },
                        ],
                    }));

                    return (
                        <div key={printer.id} className="overflow-hidden rounded-lg border">
                            <div className="flex items-center justify-between border-b px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={`/admin/printers/${printer.id}`}
                                        className="font-semibold hover:underline"
                                    >
                                        {printer.name}
                                    </Link>
                                    <span className="text-sm text-muted-foreground">
                                        {printer.buildX}×{printer.buildY}×{printer.buildZ} mm
                                    </span>
                                </div>
                                <Link
                                    href={`/admin/printers/${printer.id}`}
                                    className="text-sm text-muted-foreground hover:underline"
                                >
                                    {t("editPrinterLink")}
                                </Link>
                            </div>
                            <AdminTable
                                columns={columns}
                                rows={rows}
                                empty={t("noProfiles")}
                                frameless
                                toolbar={false}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
