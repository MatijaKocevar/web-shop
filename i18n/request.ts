import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export const locales = ["en", "sl"] as const;
export const defaultLocale: (typeof locales)[number] = "en";

function negotiateFromAcceptLanguage(acceptLanguage: string): (typeof locales)[number] {
    const first = acceptLanguage.split(",")[0].trim().slice(0, 2).toLowerCase();

    if (first === "sl") return "sl";

    return "en";
}

export default getRequestConfig(async () => {
    const store = await cookies();
    const cookieLocale = store.get("NEXT_LOCALE")?.value;

    let locale: (typeof locales)[number] = defaultLocale;

    if (cookieLocale && (locales as readonly string[]).includes(cookieLocale)) {
        locale = cookieLocale as (typeof locales)[number];
    } else {
        const headerStore = await headers();
        const acceptLanguage = headerStore.get("accept-language");
        if (acceptLanguage) locale = negotiateFromAcceptLanguage(acceptLanguage);
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,
    };
});
