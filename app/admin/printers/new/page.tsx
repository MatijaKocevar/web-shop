import { PrinterForm } from "../_components/printer-form";

export default async function NewPrinterPage() {
    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <PrinterForm />
        </div>
    );
}
