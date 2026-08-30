"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Check, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setLocale } from "@/app/_actions/set-locale";

const options = [
    { code: "en", label: "English" },
    { code: "sl", label: "Slovenščina" },
];

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function switchTo(code: string) {
        startTransition(async () => {
            await setLocale(code);
            router.refresh();
        });
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button variant="ghost" size="icon" className="relative" disabled={isPending} />
                }
            >
                <Languages className="size-4" />
                <span className="sr-only">{locale}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {options.map((option) => (
                    <DropdownMenuItem
                        key={option.code}
                        onClick={() => switchTo(option.code)}
                        className="flex items-center justify-between gap-2"
                    >
                        {option.label}
                        {locale === option.code && <Check className="size-4" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
