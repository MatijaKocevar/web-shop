import type { ModelFormat } from "@/lib/model";

export type AddCustomPrintToCartArgs = {
    key: string;
    filename: string;
    hash: string;
    format: ModelFormat;
    size: number;
    profileId: string;
    filamentId: string;
    infill: number;
    supports: boolean;
    width: number;
    depth: number;
    height: number;
    volume: number;
};
