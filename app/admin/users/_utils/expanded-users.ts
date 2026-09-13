export const EXPANDED_USERS_COOKIE = "users-expanded";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function encodeExpanded(userIds: string[]): string {
    return encodeURIComponent(JSON.stringify(userIds));
}

export function decodeExpanded(raw?: string): string[] {
    if (!raw) return [];

    try {
        const parsed = JSON.parse(decodeURIComponent(raw));

        return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
    } catch {
        return [];
    }
}

export function expandedCookie(userIds: string[]): string {
    const encoded = encodeExpanded(userIds);

    return `${EXPANDED_USERS_COOKIE}=${encoded}; path=/; samesite=lax; max-age=${COOKIE_MAX_AGE}`;
}

export function writeExpandedCookie(userIds: string[]) {
    document.cookie = expandedCookie(userIds);
}
