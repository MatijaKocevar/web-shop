import type { ModelFormat } from "@/lib/model.types";

const ACCEPTED = {
    "model/stl": "stl",
    "application/sla": "stl",
    "model/3mf": "3mf",
    "application/vnd.ms-package.3dmanufacturing-3dmodel+xml": "3mf",
} as const;

export function detectFormat(file: File): ModelFormat | null {
    if (file.name.toLowerCase().endsWith(".stl")) return "stl";
    if (file.name.toLowerCase().endsWith(".3mf")) return "3mf";

    return ACCEPTED[file.type as keyof typeof ACCEPTED] ?? null;
}
