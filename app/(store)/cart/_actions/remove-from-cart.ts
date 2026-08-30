"use server";

import { revalidatePath } from "next/cache";
import { getCart, setCart, type CartItem } from "@/lib/cart";

export async function removeFromCart(id: string): Promise<CartItem[]> {
    const items = await getCart();

    const next = items.filter((item) => item.id !== id);
    await setCart(next);

    revalidatePath("/", "layout");

    return next;
}
