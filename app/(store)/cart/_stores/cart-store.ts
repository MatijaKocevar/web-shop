"use client";

import { create } from "zustand";

import type { CartState } from "../_types/cart-state";

export const useCartStore = create<CartState>((set) => ({
    items: [],
    setItems: (items) => set({ items }),
}));

export function useCartCount() {
    return useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));
}
