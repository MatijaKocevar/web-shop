export type StockVariant = {
    id: string;
    name: string;
    stock: number;
    grams: number | null;
    filament: { id: string; name: string } | null;
};
