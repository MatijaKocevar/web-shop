import { listPrintersWithProfiles } from "@/queries/printers";
import { PrintersTable } from "./_components/printers-table";

export default async function AdminPrintersPage() {
    const printers = (await listPrintersWithProfiles()).map((printer) => ({
        id: printer.id,
        name: printer.name,
        buildX: printer.buildX,
        buildY: printer.buildY,
        buildZ: printer.buildZ,
        profiles: printer.profiles.map((profile) => ({
            id: profile.id,
            name: profile.name,
            layerHeight: profile.layerHeight,
            infill: profile.infill,
            speed: profile.speed,
            machineHourRate: Number(profile.machineHourRate),
        })),
    }));

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <PrintersTable printers={printers} />
        </div>
    );
}
