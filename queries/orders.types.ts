import type { getOrderById } from "./orders";

export type CheckoutItem = {
    type: string;
    name: string;
    quantity: number;
    unitPrice: number;
    productId: string | null;
    variantId: string | null;
    fileId: string | null;
    profileId: string | null;
    filamentId: string | null;
    infill: number | null;
    supports: boolean | null;
};

export type OrderDetail = NonNullable<Awaited<ReturnType<typeof getOrderById>>>;
