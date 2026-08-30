"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

export async function deleteFilament(formData: FormData) {
    const id = formData.get("id") as string;

    if (id) {
        await db.filament.delete({ where: { id } });
    }

    revalidatePath("/admin/filaments");
    redirect("/admin/filaments");
}
