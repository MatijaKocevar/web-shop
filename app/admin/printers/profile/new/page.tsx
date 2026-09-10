import { listPrinters } from "@/queries/printers";
import { ProfileForm } from "../../_components/profile-form";

type NewProfilePageProps = {
    searchParams: Promise<{ printer?: string }>;
};

export default async function NewProfilePage({ searchParams }: NewProfilePageProps) {
    const { printer } = await searchParams;
    const printers = await listPrinters();

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <ProfileForm printers={printers} defaultPrinterId={printer} />
        </div>
    );
}
