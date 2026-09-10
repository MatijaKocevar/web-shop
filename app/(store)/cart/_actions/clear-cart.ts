"use server";

import { revalidatePath } from "next/cache";
import { setCart } from "@/lib/cart";
import type { CartItem } from "@/lib/cart.types";

export async function clearCart(): Promise<CartItem[]> {
    await setCart([]);

    revalidatePath("/", "layout");

    return [];
}
