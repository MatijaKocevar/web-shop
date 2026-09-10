import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import type { CartItem } from "@/lib/cart.types";

const CART_COOKIE = "cart";

function encode(items: CartItem[]): string {
    return Buffer.from(JSON.stringify(items)).toString("base64url");
}

function decode(raw: string): CartItem[] {
    try {
        const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf-8"));
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export async function getCart(): Promise<CartItem[]> {
    const store = await cookies();
    const raw = store.get(CART_COOKIE)?.value;

    return raw ? decode(raw) : [];
}

export async function setCart(items: CartItem[]) {
    const store = await cookies();
    if (items.length === 0) {
        store.delete(CART_COOKIE);
    } else {
        store.set(CART_COOKIE, encode(items), {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        });
    }
}

function itemKey(item: Omit<CartItem, "id" | "quantity">): string {
    return [
        item.type,
        item.productId ?? "",
        item.variantId ?? "",
        item.fileId ?? "",
        item.profileId ?? "",
        item.filamentId ?? "",
        String(item.infill ?? ""),
        String(item.supports ?? ""),
    ].join("|");
}

export function addItemToCart(
    items: CartItem[],
    incoming: Omit<CartItem, "id" | "quantity">,
    quantity: number,
): CartItem[] {
    const key = itemKey(incoming);
    const existing = items.find((item) => itemKey(item) === key);

    if (existing) {
        return items.map((item) =>
            item === existing ? { ...item, quantity: item.quantity + quantity } : item,
        );
    }

    return [...items, { ...incoming, id: randomUUID(), quantity }];
}
