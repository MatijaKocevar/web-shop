"use server";

import { revalidatePath } from "next/cache";
import { addItemToCart, getCart, setCart, type CartItem } from "@/lib/cart";

export async function addToCart(incoming: Omit<CartItem, "id" | "quantity">, quantity = 1) {
    const items = await getCart();

    await setCart(addItemToCart(items, incoming, quantity));

    revalidatePath("/", "layout");
}
