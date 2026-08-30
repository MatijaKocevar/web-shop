import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPrinterById } from "@/queries/printers";
import { PrinterForm } from "../_components/printer-form";

export default async function EditPrinterPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const printer = await getPrinterById(id);
    const t = await getTranslations("admin.printers");
    if (!printer) notFound();

    return (
        <div>
            <h1 className="mb-6 text-2xl font-semibold">{t("editPrinter")}</h1>
            <PrinterForm printer={printer} />
        </div>
    );
}
