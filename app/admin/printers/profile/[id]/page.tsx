import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getProfileById, listPrinters } from "@/queries/printers";
import { ProfileForm } from "../../_components/profile-form";

export default async function EditProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [profile, printers] = await Promise.all([getProfileById(id), listPrinters()]);
    const t = await getTranslations("admin.printers");
    if (!profile) notFound();

    return (
        <div>
            <h1 className="mb-6 text-2xl font-semibold">{t("editProfile")}</h1>
            <ProfileForm profile={profile} printers={printers} />
        </div>
    );
}
