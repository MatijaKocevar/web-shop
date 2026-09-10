import { getTranslations } from "next-intl/server";
import { AdminFormDialog } from "@/components/admin-form-dialog";
import { getPrinterById, getProfileById, listPrintersWithProfiles } from "@/queries/printers";
import { PrinterForm } from "./_components/printer-form";
import { PrintersTable } from "./_components/printers-table";
import { ProfileForm } from "./_components/profile-form";

type AdminPrintersPageProps = {
    searchParams: Promise<{
        id?: string;
        profileId?: string;
        new?: string;
        newProfile?: string;
        printer?: string;
    }>;
};

export default async function AdminPrintersPage({ searchParams }: AdminPrintersPageProps) {
    const {
        id,
        profileId,
        new: isNew,
        newProfile,
        printer: newProfilePrinterId,
    } = await searchParams;
    const [printersRaw, editingPrinter, editingProfile] = await Promise.all([
        listPrintersWithProfiles(),
        id ? getPrinterById(id) : null,
        profileId ? getProfileById(profileId) : null,
    ]);
    const t = await getTranslations("admin.printers");

    const printers = printersRaw.map((printer) => ({
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

    const printerOptions = printersRaw.map((printer) => ({ id: printer.id, name: printer.name }));

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <PrintersTable printers={printers} />

            <AdminFormDialog
                open={Boolean(isNew)}
                onCloseHref="/admin/printers"
                title={t("newPrinterTitle")}
                className="sm:max-w-xl"
            >
                {isNew && <PrinterForm />}
            </AdminFormDialog>

            <AdminFormDialog
                open={Boolean(editingPrinter)}
                onCloseHref="/admin/printers"
                title={t("editPrinter")}
                className="sm:max-w-xl"
            >
                {editingPrinter && (
                    <PrinterForm
                        printer={{
                            id: editingPrinter.id,
                            name: editingPrinter.name,
                            make: editingPrinter.make,
                            buildX: editingPrinter.buildX,
                            buildY: editingPrinter.buildY,
                            buildZ: editingPrinter.buildZ,
                            active: editingPrinter.active,
                        }}
                    />
                )}
            </AdminFormDialog>

            <AdminFormDialog
                open={Boolean(newProfile)}
                onCloseHref="/admin/printers"
                title={t("newProfileTitle")}
                className="sm:max-w-xl"
            >
                {newProfile && (
                    <ProfileForm printers={printerOptions} defaultPrinterId={newProfilePrinterId} />
                )}
            </AdminFormDialog>

            <AdminFormDialog
                open={Boolean(editingProfile)}
                onCloseHref="/admin/printers"
                title={t("editProfile")}
                className="sm:max-w-xl"
            >
                {editingProfile && (
                    <ProfileForm profile={editingProfile} printers={printerOptions} />
                )}
            </AdminFormDialog>
        </div>
    );
}
