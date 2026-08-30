import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { saveProfile } from "../_actions/save-profile";
import { deleteProfile } from "../_actions/delete-profile";

const inputClass =
    "rounded-md border bg-background px-3 py-2 text-sm w-full focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

type Printer = { id: string; name: string };
type Profile = {
    id: string;
    printerId: string;
    name: string;
    nozzle: number;
    layerHeight: number;
    infill: number;
    speed: number | null;
    machineHourRate: number;
    setupFee: number;
    supports: boolean;
    active: boolean;
};

export function ProfileForm({ profile, printers }: { profile?: Profile; printers: Printer[] }) {
    return (
        <div className="max-w-xl">
            <form action={saveProfile} className="flex flex-col gap-4">
                {profile && <input type="hidden" name="id" value={profile.id} />}

                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">Printer</span>
                    <select
                        className={inputClass}
                        name="printerId"
                        defaultValue={profile?.printerId ?? printers[0]?.id}
                        required
                    >
                        {printers.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">Name</span>
                    <input
                        className={inputClass}
                        name="name"
                        defaultValue={profile?.name ?? ""}
                        required
                    />
                </label>

                <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">Nozzle (mm)</span>
                        <input
                            className={inputClass}
                            name="nozzle"
                            type="number"
                            step="0.05"
                            min="0"
                            defaultValue={profile?.nozzle ?? 0.4}
                            required
                        />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">Layer height (mm)</span>
                        <input
                            className={inputClass}
                            name="layerHeight"
                            type="number"
                            step="0.01"
                            min="0.05"
                            defaultValue={profile?.layerHeight ?? 0.2}
                            required
                        />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">Infill (%)</span>
                        <input
                            className={inputClass}
                            name="infill"
                            type="number"
                            min="0"
                            max="100"
                            defaultValue={profile?.infill ?? 15}
                            required
                        />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">Speed (mm/s)</span>
                        <input
                            className={inputClass}
                            name="speed"
                            type="number"
                            min="0"
                            defaultValue={profile?.speed ?? 200}
                        />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">Machine rate (€/h)</span>
                        <input
                            className={inputClass}
                            name="machineHourRate"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue={profile?.machineHourRate ?? 5}
                            required
                        />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">Setup fee (€)</span>
                        <input
                            className={inputClass}
                            name="setupFee"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue={profile?.setupFee ?? 1}
                            required
                        />
                    </label>
                </div>

                <div className="flex items-center gap-4 text-sm">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="supports"
                            defaultChecked={profile?.supports ?? false}
                        />
                        <span>Supports enabled</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="active"
                            defaultChecked={profile?.active ?? true}
                        />
                        <span>Active</span>
                    </label>
                </div>

                <div className="flex items-center gap-2">
                    <Button type="submit">{profile ? "Save" : "Create profile"}</Button>
                    <Link href="/admin/printers" className={buttonVariants({ variant: "ghost" })}>
                        Cancel
                    </Link>
                </div>
            </form>

            {profile && (
                <form action={deleteProfile} className="mt-6">
                    <input type="hidden" name="id" value={profile.id} />
                    <Button type="submit" variant="destructive">
                        <Trash2 className="size-4" />
                        Delete profile
                    </Button>
                </form>
            )}
        </div>
    );
}
