import { getTranslations } from "next-intl/server";
import { PrinterForm } from "../_components/printer-form";

export default async function NewPrinterPage() {
    const t = await getTranslations("admin.printers");

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <h1 className="mb-6 text-2xl font-semibold">{t("newPrinterTitle")}</h1>
            <PrinterForm />
        </div>
    );
}
