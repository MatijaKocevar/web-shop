import type { calculatePrice } from "@/lib/pricing";

export type Quote = {
    grams: number;
    timeSeconds: number;
    price: ReturnType<typeof calculatePrice>;
} | null;
