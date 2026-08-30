import { db } from "@/lib/db";

export async function listFilaments() {
    const filaments = await db.filament.findMany({
        where: { active: true },
        orderBy: [{ material: "asc" }, { color: "asc" }],
    });

    return filaments.map((f) => ({
        ...f,
        density: Number(f.density),
        costPerGram: Number(f.costPerGram),
    }));
}

export async function getFilamentById(id: string) {
    const filament = await db.filament.findUnique({ where: { id } });

    if (!filament) return null;

    return {
        ...filament,
        density: Number(filament.density),
        costPerGram: Number(filament.costPerGram),
    };
}
