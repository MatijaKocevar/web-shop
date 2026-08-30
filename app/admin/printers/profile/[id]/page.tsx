import { notFound } from "next/navigation";

import { getProfileById, listPrinters } from "@/queries/printers";
import { ProfileForm } from "../../_components/profile-form";

export default async function EditProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [profile, printers] = await Promise.all([getProfileById(id), listPrinters()]);
    if (!profile) notFound();

    return (
        <div>
            <h1 className="mb-6 text-2xl font-semibold">Edit profile</h1>
            <ProfileForm profile={profile} printers={printers} />
        </div>
    );
}
