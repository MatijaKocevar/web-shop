"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

const themeColors = {
    light: "#ffffff",
    dark: "#0a0a0a",
};

export function ThemeColorSync() {
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        const color = resolvedTheme === "dark" ? themeColors.dark : themeColors.light;

        document
            .querySelectorAll('meta[name="theme-color"]')
            .forEach((meta) => meta.setAttribute("content", color));
    }, [resolvedTheme]);

    return null;
}
