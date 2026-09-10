"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type PasswordInputProps = {
    name: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    minLength?: number;
    autoComplete?: string;
};

export function PasswordInput({
    name,
    placeholder,
    value,
    onChange,
    className,
    minLength,
    autoComplete,
}: PasswordInputProps) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <input
                className={cn(className, "pr-10")}
                name={name}
                type={visible ? "text" : "password"}
                value={value}
                minLength={minLength}
                autoComplete={autoComplete}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
            />
            <button
                type="button"
                className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setVisible((v) => !v)}
            >
                {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
        </div>
    );
}
