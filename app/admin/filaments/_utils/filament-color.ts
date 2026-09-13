const COLOR_KEYWORDS: [string, string][] = [
    ["black", "#1f2937"],
    ["white", "#ffffff"],
    ["gray", "#9ca3af"],
    ["red", "#ef4444"],
    ["orange", "#f97316"],
    ["yellow", "#eab308"],
    ["green", "#22c55e"],
    ["blue", "#3b82f6"],
    ["purple", "#a855f7"],
    ["pink", "#ec4899"],
    ["brown", "#92400e"],
    ["gold", "#d4af37"],
    ["silver", "#c0c0c0"],
    ["transparent", "#e5e7eb"],
];

function hueFromString(value: string): number {
    let hash = 0;

    for (const char of value) {
        hash = (hash * 31 + char.charCodeAt(0)) % 360;
    }

    return hash;
}

function hslToHex(hue: number, saturation: number, lightness: number): string {
    const s = saturation / 100;
    const l = lightness / 100;
    const chroma = (1 - Math.abs(2 * l - 1)) * s;
    const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = l - chroma / 2;
    let r = 0;
    let g = 0;
    let b = 0;

    if (hue < 60) {
        r = chroma;
        g = x;
    } else if (hue < 120) {
        r = x;
        g = chroma;
    } else if (hue < 180) {
        g = chroma;
        b = x;
    } else if (hue < 240) {
        g = x;
        b = chroma;
    } else if (hue < 300) {
        r = x;
        b = chroma;
    } else {
        r = chroma;
        b = x;
    }

    const channel = (value: number) =>
        Math.round((value + m) * 255)
            .toString(16)
            .padStart(2, "0");

    return `#${channel(r)}${channel(g)}${channel(b)}`;
}

export function filamentColorHex(color: string): string {
    const normalized = color.trim().toLowerCase();

    for (const [keyword, hex] of COLOR_KEYWORDS) {
        if (normalized.includes(keyword)) return hex;
    }

    return hslToHex(hueFromString(normalized), 65, 50);
}
