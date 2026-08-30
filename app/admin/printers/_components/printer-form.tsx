import Link from "next/link";
import { Trash2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { savePrinter } from "../_actions/save-printer";
import { deletePrinter } from "../_actions/delete-printer";

const inputClass =
    "rounded-md border bg-background px-3 py-2 text-sm w-full focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

type Printer = {
    id: string;
    name: string;
    make: string;
    buildX: number;
    buildY: number;
    buildZ: number;
    active: boolean;
};

export function PrinterForm({ printer }: { printer?: Printer }) {
    return (
        <div className="max-w-xl">
            <form action={savePrinter} className="flex flex-col gap-4">
                {printer && <input type="hidden" name="id" value={printer.id} />}

                <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">Name</span>
                        <input
                            className={inputClass}
                            name="name"
                            defaultValue={printer?.name ?? ""}
                            required
                        />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">Make</span>
                        <input
                            className={inputClass}
                            name="make"
                            defaultValue={printer?.make ?? ""}
                        />
                    </label>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">Build X (mm)</span>
                        <input
                            className={inputClass}
                            name="buildX"
                            type="number"
                            min="0"
                            defaultValue={printer?.buildX ?? 220}
                            required
                        />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">Build Y (mm)</span>
                        <input
                            className={inputClass}
                            name="buildY"
                            type="number"
                            min="0"
                            defaultValue={printer?.buildY ?? 220}
                            required
                        />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">Build Z (mm)</span>
                        <input
                            className={inputClass}
                            name="buildZ"
                            type="number"
                            min="0"
                            defaultValue={printer?.buildZ ?? 250}
                            required
                        />
                    </label>
                </div>

                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="active" defaultChecked={printer?.active ?? true} />
                    <span>Active</span>
                </label>

                <div className="flex items-center gap-2">
                    <Button type="submit">{printer ? "Save" : "Create printer"}</Button>
                    <Link href="/admin/printers" className={buttonVariants({ variant: "ghost" })}>
                        Cancel
                    </Link>
                </div>
            </form>

            {printer && (
                <form action={deletePrinter} className="mt-6">
                    <input type="hidden" name="id" value={printer.id} />
                    <Button type="submit" variant="destructive">
                        <Trash2 className="size-4" />
                        Delete printer
                    </Button>
                </form>
            )}
        </div>
    );
}
