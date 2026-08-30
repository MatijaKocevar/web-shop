"use server";

import { cookies } from "next/headers";

export async function setLocale(locale: string) {
    const store = await cookies();

    store.set("NEXT_LOCALE", locale, {
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
    });
}
