import type { CartItem } from "@/lib/cart";

export type CartState = {
    items: CartItem[];
    setItems: (items: CartItem[]) => void;
};
