import type { PriceBreakdown, PricingInput } from "@/lib/pricing.types";

export function calculatePrice(input: PricingInput): PriceBreakdown {
    const materialCost = input.grams * input.costPerGram;
    const machineCost = (input.timeSeconds / 3600) * input.machineHourRate;
    const setupFee = input.setupFee;
    const subtotal = materialCost + machineCost + setupFee;
    const margin = subtotal * (input.marginPct / 100);

    return {
        materialCost: round2(materialCost),
        machineCost: round2(machineCost),
        setupFee: round2(setupFee),
        margin: round2(margin),
        total: round2(subtotal + margin),
    };
}

export function round2(value: number): number {
    return Math.round(value * 100) / 100;
}

export function formatCurrency(value: number, currency = "EUR", locale = "en"): string {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(value);
}

export function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
}
