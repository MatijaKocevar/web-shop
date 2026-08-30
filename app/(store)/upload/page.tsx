import { getTranslations } from "next-intl/server";
import { listFilaments } from "@/queries/filaments";
import { listProfiles } from "@/queries/printers";
import { UploadWizard } from "./_components/upload-wizard";

export default async function UploadPage() {
    const [profiles, filaments] = await Promise.all([listProfiles(), listFilaments()]);
    const t = await getTranslations("upload");

    return (
        <div className="mx-auto max-w-7xl px-4 py-10">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold">{t("title")}</h1>
                <p className="text-muted-foreground">{t("subtitle")}</p>
            </div>
            <UploadWizard profiles={profiles} filaments={filaments} />
        </div>
    );
}
