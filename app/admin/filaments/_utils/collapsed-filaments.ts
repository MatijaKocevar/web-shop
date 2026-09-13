export const COLLAPSED_FILAMENTS_COOKIE = "filaments-collapsed";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function encodeCollapsed(materials: string[]): string {
    return encodeURIComponent(JSON.stringify(materials));
}

export function decodeCollapsed(raw?: string): string[] {
    if (!raw) return [];

    try {
        const parsed = JSON.parse(decodeURIComponent(raw));

        return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
    } catch {
        return [];
    }
}

export function collapsedCookie(materials: string[]): string {
    const encoded = encodeCollapsed(materials);

    return `${COLLAPSED_FILAMENTS_COOKIE}=${encoded}; path=/; samesite=lax; max-age=${COOKIE_MAX_AGE}`;
}

export function writeCollapsedCookie(materials: string[]) {
    document.cookie = collapsedCookie(materials);
}
