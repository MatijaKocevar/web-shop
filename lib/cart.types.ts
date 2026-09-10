export type CartItem = {
    id: string;
    type: "READY_MADE" | "CUSTOM_PRINT";
    name: string;
    unitPrice: number;
    quantity: number;
    productId?: string;
    variantId?: string;
    fileId?: string;
    profileId?: string;
    filamentId?: string;
    infill?: number;
    supports?: boolean;
};
