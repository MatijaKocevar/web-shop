"use server";

import { revalidatePath } from "next/cache";
import { setCart } from "@/lib/cart";

export async function clearCart() {
    await setCart([]);

    revalidatePath("/", "layout");
}
