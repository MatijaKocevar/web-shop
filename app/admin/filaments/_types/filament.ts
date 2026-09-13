export type Filament = {
    id: string;
    name: string;
    material: string;
    color: string;
    colorHex: string | null;
    density: number;
    costPerGram: number;
    stockGrams: number;
    lowStockThresholdGrams: number;
    active: boolean;
};

export type FilamentStatus = "empty" | "low" | "ok";
