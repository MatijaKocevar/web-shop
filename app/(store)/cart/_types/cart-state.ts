import type { CartItem } from "@/lib/cart.types";

export type CartState = {
    items: CartItem[];
    setItems: (items: CartItem[]) => void;
};
