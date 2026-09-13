import type { StockVariant } from "./stock-variant";

export type ProductWithVariants = {
    id: string;
    name: string;
    type: string;
    price: number | null;
    category: { name: string } | null;
    variants: StockVariant[];
};
