import { notFound } from "next/navigation";
import { getProfileById, listPrinters } from "@/queries/printers";
import { ProfileForm } from "../../_components/profile-form";

type EditProfilePageProps = {
    params: Promise<{ id: string }>;
};

export default async function EditProfilePage({ params }: EditProfilePageProps) {
    const { id } = await params;
    const [profile, printers] = await Promise.all([getProfileById(id), listPrinters()]);

    if (!profile) notFound();

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <ProfileForm profile={profile} printers={printers} />
        </div>
    );
}
