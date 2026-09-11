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

        document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => meta.remove());

        const meta = document.createElement("meta");

        meta.name = "theme-color";
        meta.content = color;
        document.head.appendChild(meta);
    }, [resolvedTheme]);

    return null;
}
