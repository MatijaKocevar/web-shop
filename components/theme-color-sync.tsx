"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

const themeColors = {
    light: "#ffffff",
    dark: "#0a0a0a",
};

const themeManifests = {
    light: "/manifest-light.webmanifest",
    dark: "/manifest-dark.webmanifest",
};

export function ThemeColorSync() {
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        if (!resolvedTheme) return;

        const dark = resolvedTheme === "dark";
        const color = dark ? themeColors.dark : themeColors.light;

        document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => meta.remove());

        const meta = document.createElement("meta");

        meta.name = "theme-color";
        meta.content = color;
        document.head.appendChild(meta);

        document.querySelectorAll('link[rel="manifest"]').forEach((link) => link.remove());

        const manifest = document.createElement("link");

        manifest.rel = "manifest";
        manifest.href = dark ? themeManifests.dark : themeManifests.light;
        document.head.appendChild(manifest);
    }, [resolvedTheme]);

    return null;
}
