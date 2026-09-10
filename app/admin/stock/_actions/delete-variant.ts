"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function deleteVariant(formData: FormData) {
    const id = formData.get("id") as string;

    if (id) {
        await db.productVariant.delete({ where: { id } });
    }

    revalidatePath("/admin/stock");
    redirect("/admin/stock");
}
