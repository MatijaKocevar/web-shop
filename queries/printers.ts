import { db } from "@/lib/db";

export async function listPrinters() {
    return db.printer.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
    });
}

export async function listPrintersWithProfiles() {
    return db.printer.findMany({
        include: { profiles: { orderBy: { name: "asc" } } },
        orderBy: { name: "asc" },
    });
}

export async function getPrinterById(id: string) {
    const printer = await db.printer.findUnique({
        where: { id },
        include: { profiles: { orderBy: { name: "asc" } } },
    });

    if (!printer) return null;

    return {
        ...printer,
        profiles: printer.profiles.map((p) => ({
            ...p,
            machineHourRate: Number(p.machineHourRate),
            setupFee: Number(p.setupFee),
        })),
    };
}

export async function getProfileById(id: string) {
    const profile = await db.printerProfile.findUnique({
        where: { id },
        include: { printer: true },
    });

    if (!profile) return null;

    return {
        ...profile,
        machineHourRate: Number(profile.machineHourRate),
        setupFee: Number(profile.setupFee),
    };
}

export async function getDefaultPrinter() {
    return db.printer.findFirst({
        where: { active: true },
        orderBy: { createdAt: "asc" },
    });
}

export async function listProfiles(printerId?: string) {
    const profiles = await db.printerProfile.findMany({
        where: { active: true, ...(printerId ? { printerId } : {}) },
        include: { printer: true },
        orderBy: { name: "asc" },
    });

    return profiles.map((p) => ({
        ...p,
        machineHourRate: Number(p.machineHourRate),
        setupFee: Number(p.setupFee),
    }));
}
