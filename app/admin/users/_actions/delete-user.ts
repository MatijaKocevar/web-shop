"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";

export async function deleteUser(formData: FormData) {
    const id = formData.get("id") as string;

    if (id) {
        await db.user.delete({ where: { id } });
    }

    revalidatePath("/admin/users");
}
