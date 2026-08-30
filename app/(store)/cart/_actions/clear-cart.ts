"use server";

import { revalidatePath } from "next/cache";
import { setCart, type CartItem } from "@/lib/cart";

export async function clearCart(): Promise<CartItem[]> {
    await setCart([]);

    revalidatePath("/", "layout");

    return [];
}
