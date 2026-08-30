"use server";

import { revalidatePath } from "next/cache";

import { getCart, setCart } from "@/lib/cart";

export async function updateQuantity(id: string, quantity: number) {
    const items = await getCart();

    if (quantity <= 0) {
        await setCart(items.filter((item) => item.id !== id));
    } else {
        await setCart(items.map((item) => (item.id === id ? { ...item, quantity } : item)));
    }

    revalidatePath("/", "layout");
}
