import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { listFilaments } from "@/queries/filaments";

export default async function AdminFilamentsPage() {
    const filaments = await listFilaments();
    const t = await getTranslations("admin.filaments");
    const tCommon = await getTranslations("admin.common");

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">{t("title")}</h1>
                <Link href="/admin/filaments/new" className={buttonVariants()}>
                    {t("new")}
                </Link>
            </div>
            <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-left">
                        <tr>
                            <th className="px-4 py-2 font-medium">{tCommon("name")}</th>
                            <th className="px-4 py-2 font-medium">{tCommon("material")}</th>
                            <th className="px-4 py-2 font-medium">{tCommon("color")}</th>
                            <th className="px-4 py-2 font-medium">{t("density")}</th>
                            <th className="px-4 py-2 font-medium">{t("costPerGramShort")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filaments.map((f) => (
                            <tr key={f.id} className="hover:bg-muted/30">
                                <td className="px-4 py-2">
                                    <Link
                                        href={`/admin/filaments/${f.id}`}
                                        className="font-medium hover:underline"
                                    >
                                        {f.name}
                                    </Link>
                                </td>
                                <td className="px-4 py-2">{f.material}</td>
                                <td className="px-4 py-2">{f.color}</td>
                                <td className="px-4 py-2">{f.density} g/cm³</td>
                                <td className="px-4 py-2">€{f.costPerGram.toFixed(4)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
