import { notFound } from "next/navigation";

import { getPrinterById } from "@/queries/printers";
import { PrinterForm } from "../_components/printer-form";

export default async function EditPrinterPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const printer = await getPrinterById(id);
    if (!printer) notFound();

    return (
        <div>
            <h1 className="mb-6 text-2xl font-semibold">Edit printer</h1>
            <PrinterForm printer={printer} />
        </div>
    );
}
