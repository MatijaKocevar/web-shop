"use server";

import { revalidatePath } from "next/cache";
import { getCart, setCart } from "@/lib/cart";
import type { CartItem } from "@/lib/cart.types";

export async function removeFromCart(id: string): Promise<CartItem[]> {
    const items = await getCart();

    const next = items.filter((item) => item.id !== id);
    await setCart(next);

    revalidatePath("/", "layout");

    return next;
}
