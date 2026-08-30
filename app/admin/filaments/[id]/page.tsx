import { notFound } from "next/navigation";
import { getFilamentById } from "@/queries/filaments";
import { FilamentForm } from "../_components/filament-form";

export default async function EditFilamentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const filament = await getFilamentById(id);

    if (!filament) notFound();

    return (
        <div>
            <h1 className="mb-6 text-2xl font-semibold">Edit filament</h1>
            <FilamentForm filament={filament} />
        </div>
    );
}
