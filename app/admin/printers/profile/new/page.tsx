import { getTranslations } from "next-intl/server";
import { listPrinters } from "@/queries/printers";
import { ProfileForm } from "../../_components/profile-form";

export default async function NewProfilePage() {
    const printers = await listPrinters();
    const t = await getTranslations("admin.printers");

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <h1 className="mb-6 text-2xl font-semibold">{t("newProfileTitle")}</h1>
            <ProfileForm printers={printers} />
        </div>
    );
}
