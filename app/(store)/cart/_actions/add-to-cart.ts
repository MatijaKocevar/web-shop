"use server";

import { revalidatePath } from "next/cache";
import { addItemToCart, getCart, setCart } from "@/lib/cart";
import type { CartItem } from "@/lib/cart.types";

export async function addToCart(
    incoming: Omit<CartItem, "id" | "quantity">,
    quantity = 1,
): Promise<CartItem[]> {
    const items = await getCart();

    const next = addItemToCart(items, incoming, quantity);
    await setCart(next);

    revalidatePath("/", "layout");

    return next;
}
