"use server";

import { revalidatePath } from "next/cache";
import { getCart, setCart } from "@/lib/cart";

export async function removeFromCart(id: string) {
    const items = await getCart();

    await setCart(items.filter((item) => item.id !== id));

    revalidatePath("/", "layout");
}
