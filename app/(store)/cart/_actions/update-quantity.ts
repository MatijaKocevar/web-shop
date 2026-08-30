"use server";

import { revalidatePath } from "next/cache";
import { getCart, setCart, type CartItem } from "@/lib/cart";

export async function updateQuantity(id: string, quantity: number): Promise<CartItem[]> {
    const items = await getCart();

    const next =
        quantity <= 0
            ? items.filter((item) => item.id !== id)
            : items.map((item) => (item.id === id ? { ...item, quantity } : item));
    await setCart(next);

    revalidatePath("/", "layout");

    return next;
}
