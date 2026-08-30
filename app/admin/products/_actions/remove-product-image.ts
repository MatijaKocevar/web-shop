"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function removeProductImage(formData: FormData) {
    const id = formData.get("imageId") as string;
    const productId = formData.get("productId") as string;

    if (id) {
        await db.productImage.delete({ where: { id } });
    }

    revalidatePath(`/admin/products/${productId}`);
}
