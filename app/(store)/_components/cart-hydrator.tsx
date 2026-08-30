"use client";

import { useEffect, useRef } from "react";

import type { CartItem } from "@/lib/cart";
import { useCartStore } from "@/app/(store)/cart/_stores/cart-store";

export function CartHydrator({ items }: { items: CartItem[] }) {
    const hydrated = useRef(false);

    useEffect(() => {
        if (hydrated.current) return;
        hydrated.current = true;
        useCartStore.setState({ items });
    }, [items]);

    return null;
}
