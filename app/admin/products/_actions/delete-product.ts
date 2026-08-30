"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function deleteProduct(formData: FormData) {
    const id = formData.get("id") as string;

    if (id) {
        await db.product.delete({ where: { id } });
    }

    revalidatePath("/admin/products");
    redirect("/admin/products");
}
