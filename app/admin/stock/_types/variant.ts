export type Variant = {
    id: string;
    name: string;
    productId: string;
    filamentId: string | null;
    grams: number | null;
    priceDelta: number | null;
};

export type VariantFormFilament = {
    id: string;
    name: string;
};
