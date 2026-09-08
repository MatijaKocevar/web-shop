"use client";

import { useEffect, useRef } from "react";
import type { CartItem } from "@/lib/cart";
import { useCartStore } from "@/app/(store)/cart/_stores/cart-store";

type CartHydratorProps = {
    items: CartItem[];
};

export function CartHydrator({ items }: CartHydratorProps) {
    const hydrated = useRef(false);

    useEffect(() => {
        if (hydrated.current) return;
        hydrated.current = true;
        useCartStore.setState({ items });
    }, [items]);

    return null;
}
