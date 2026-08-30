import { listPrinters } from "@/queries/printers";
import { ProfileForm } from "../../_components/profile-form";

export default async function NewProfilePage() {
    const printers = await listPrinters();

    return (
        <div>
            <h1 className="mb-6 text-2xl font-semibold">New profile</h1>
            <ProfileForm printers={printers} />
        </div>
    );
}
