import { notFound } from "next/navigation";
import { getPrinterById } from "@/queries/printers";
import { PrinterForm } from "../_components/printer-form";

type EditPrinterPageProps = {
    params: Promise<{ id: string }>;
};

export default async function EditPrinterPage({ params }: EditPrinterPageProps) {
    const { id } = await params;
    const printer = await getPrinterById(id);

    if (!printer) notFound();

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <PrinterForm printer={printer} />
        </div>
    );
}
