export type PriceBreakdown = {
    materialCost: number;
    machineCost: number;
    setupFee: number;
    margin: number;
    total: number;
};

export type PricingInput = {
    grams: number;
    costPerGram: number;
    timeSeconds: number;
    machineHourRate: number;
    setupFee: number;
    marginPct: number;
};
