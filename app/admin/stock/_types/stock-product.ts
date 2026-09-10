import type { StockVariant } from "./stock-variant";

export type StockProduct = {
    id: string;
    name: string;
    variants: StockVariant[];
};
