import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getFilamentById } from "@/queries/filaments";
import { FilamentForm } from "../_components/filament-form";

export default async function EditFilamentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const filament = await getFilamentById(id);
    const t = await getTranslations("admin.filaments");

    if (!filament) notFound();

    return (
        <div>
            <h1 className="mb-6 text-2xl font-semibold">{t("edit")}</h1>
            <FilamentForm filament={filament} />
        </div>
    );
}
