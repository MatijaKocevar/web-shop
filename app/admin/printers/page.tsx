import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { listPrintersWithProfiles } from "@/queries/printers";

export default async function AdminPrintersPage() {
    const printers = await listPrintersWithProfiles();

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Printers & profiles</h1>
                <div className="flex gap-2">
                    <Link
                        href="/admin/printers/profile/new"
                        className={buttonVariants({ variant: "outline" })}
                    >
                        New profile
                    </Link>
                    <Link href="/admin/printers/new" className={buttonVariants()}>
                        New printer
                    </Link>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {printers.map((printer) => (
                    <div key={printer.id} className="rounded-lg border">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <div className="flex items-center gap-3">
                                <Link
                                    href={`/admin/printers/${printer.id}`}
                                    className="font-semibold hover:underline"
                                >
                                    {printer.name}
                                </Link>
                                <span className="text-sm text-muted-foreground">
                                    {printer.buildX}×{printer.buildY}×{printer.buildZ} mm
                                </span>
                            </div>
                            <Link
                                href={`/admin/printers/${printer.id}`}
                                className="text-sm text-muted-foreground hover:underline"
                            >
                                Edit printer
                            </Link>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-left">
                                <tr>
                                    <th className="px-4 py-2 font-medium">Profile</th>
                                    <th className="px-4 py-2 font-medium">Layer</th>
                                    <th className="px-4 py-2 font-medium">Infill</th>
                                    <th className="px-4 py-2 font-medium">Speed</th>
                                    <th className="px-4 py-2 font-medium">Machine rate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {printer.profiles.map((p) => (
                                    <tr key={p.id} className="hover:bg-muted/30">
                                        <td className="px-4 py-2">
                                            <Link
                                                href={`/admin/printers/profile/${p.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {p.name}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-2">{p.layerHeight} mm</td>
                                        <td className="px-4 py-2">{p.infill}%</td>
                                        <td className="px-4 py-2">{p.speed ?? "—"} mm/s</td>
                                        <td className="px-4 py-2">
                                            €{Number(p.machineHourRate).toFixed(2)}/h
                                        </td>
                                    </tr>
                                ))}
                                {printer.profiles.length === 0 && (
                                    <tr>
                                        <td className="px-4 py-2 text-muted-foreground" colSpan={5}>
                                            No profiles yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
}
