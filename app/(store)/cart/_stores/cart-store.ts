"use client";

import { create } from "zustand";

import type { CartItem } from "@/lib/cart";

type CartState = {
    items: CartItem[];
    setItems: (items: CartItem[]) => void;
};

export const useCartStore = create<CartState>((set) => ({
    items: [],
    setItems: (items) => set({ items }),
}));

export function useCartCount() {
    return useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));
}
