"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import type { Role } from "@/generated/prisma/enums";

export async function updateUserRole(formData: FormData) {
    const id = formData.get("id") as string;
    const role = formData.get("role") as string;

    if (id && (role === "CUSTOMER" || role === "ADMIN")) {
        await db.user.update({
            where: { id },
            data: { role: role as Role },
        });
    }

    revalidatePath("/admin/users");
}
