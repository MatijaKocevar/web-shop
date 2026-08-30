"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

export async function deletePrinter(formData: FormData) {
    const id = formData.get("id") as string;

    if (id) {
        await db.printer.delete({ where: { id } });
    }

    revalidatePath("/admin/printers");
    redirect("/admin/printers");
}
