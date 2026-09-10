import { getTranslations } from "next-intl/server";
import { FilamentForm } from "../_components/filament-form";

export default async function NewFilamentPage() {
    const t = await getTranslations("admin.filaments");

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <h1 className="mb-6 text-2xl font-semibold">{t("newTitle")}</h1>
            <FilamentForm />
        </div>
    );
}
