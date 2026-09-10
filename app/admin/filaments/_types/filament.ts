export type Filament = {
    id: string;
    name: string;
    material: string;
    color: string;
    density: number;
    costPerGram: number;
    stockGrams: number;
    lowStockThresholdGrams: number;
    active: boolean;
};
