import type { ModelFormat, ModelStats } from "@/lib/model";
import type { Filament } from "./filament";
import type { Profile } from "./profile";

export type AddCustomPrintArgs = {
    file: File;
    format: ModelFormat;
    stats: ModelStats;
    profile: Profile;
    filament: Filament;
    infill: number;
    supports: boolean;
};
