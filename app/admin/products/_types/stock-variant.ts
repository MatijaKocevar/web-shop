export type StockVariant = {
    id: string;
    name: string;
    price: number | null;
    stock: number;
    grams: number | null;
    filament: {
        id: string;
        name: string;
        color: string;
        colorHex: string | null;
        stockGrams: number;
    } | null;
};
