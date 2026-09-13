"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { filamentColorHex } from "../_utils/filament-color";

const inputClass =
    "w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

type FilamentColorFieldProps = {
    defaultName?: string;
    defaultHex?: string | null;
};

export function FilamentColorField({ defaultName = "", defaultHex }: FilamentColorFieldProps) {
    const t = useTranslations("admin.filaments");
    const tCommon = useTranslations("admin.common");
    const [name, setName] = useState(defaultName);
    const [hex, setHex] = useState(defaultHex ?? filamentColorHex(defaultName || "black"));
    const [manual, setManual] = useState(Boolean(defaultHex));

    function handleName(value: string) {
        setName(value);

        if (!manual) setHex(filamentColorHex(value || "black"));
    }

    function handleHex(value: string) {
        setHex(value);
        setManual(true);
    }

    return (
        <div className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">{tCommon("color")}</span>
            <div className="flex items-center gap-2">
                <input
                    className={inputClass}
                    name="color"
                    value={name}
                    onChange={(event) => handleName(event.target.value)}
                    required
                />
                <input
                    type="color"
                    name="colorHex"
                    value={hex}
                    onChange={(event) => handleHex(event.target.value)}
                    aria-label={t("pickColor")}
                    title={t("pickColor")}
                    className="h-9 w-12 shrink-0 cursor-pointer rounded-md border bg-background p-1"
                />
            </div>
        </div>
    );
}
