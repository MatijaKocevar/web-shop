import type { CartItem } from "@/lib/cart.types";

export type HydratedCartItem = CartItem & {
    imageKey?: string;
    filamentName?: string;
    profileName?: string;
};
