import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { saveFilament } from "../_actions/save-filament";
import { deleteFilament } from "../_actions/delete-filament";

const inputClass =
    "rounded-md border bg-background px-3 py-2 text-sm w-full focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

type Filament = {
    id: string;
    name: string;
    material: string;
    color: string;
    density: number;
    costPerGram: number;
    active: boolean;
};

export function FilamentForm({ filament }: { filament?: Filament }) {
    return (
        <div className="max-w-xl">
            <form action={saveFilament} className="flex flex-col gap-4">
                {filament && <input type="hidden" name="id" value={filament.id} />}

                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">Name</span>
                    <input
                        className={inputClass}
                        name="name"
                        defaultValue={filament?.name ?? ""}
                        required
                    />
                </label>

                <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">Material</span>
                        <select
                            className={inputClass}
                            name="material"
                            defaultValue={filament?.material ?? "PLA"}
                        >
                            {["PLA", "PETG", "ABS", "TPU", "ASA", "PC", "PA"].map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">Color</span>
                        <input
                            className={inputClass}
                            name="color"
                            defaultValue={filament?.color ?? ""}
                            required
                        />
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">Density (g/cm³)</span>
                        <input
                            className={inputClass}
                            name="density"
                            type="number"
                            step="0.001"
                            min="0"
                            defaultValue={filament?.density ?? 1.24}
                            required
                        />
                    </label>

                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">Cost per gram (€)</span>
                        <input
                            className={inputClass}
                            name="costPerGram"
                            type="number"
                            step="0.0001"
                            min="0"
                            defaultValue={filament?.costPerGram ?? 0.02}
                            required
                        />
                    </label>
                </div>

                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        name="active"
                        defaultChecked={filament?.active ?? true}
                    />
                    <span>Active</span>
                </label>

                <div className="flex items-center gap-2">
                    <Button type="submit">{filament ? "Save" : "Create filament"}</Button>
                    <Link href="/admin/filaments" className={buttonVariants({ variant: "ghost" })}>
                        Cancel
                    </Link>
                </div>
            </form>

            {filament && (
                <form action={deleteFilament} className="mt-6">
                    <input type="hidden" name="id" value={filament.id} />
                    <Button type="submit" variant="destructive">
                        <Trash2 className="size-4" />
                        Delete
                    </Button>
                </form>
            )}
        </div>
    );
}
