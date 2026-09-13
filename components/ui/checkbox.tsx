"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon, MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function Checkbox({ className, indeterminate, ...props }: CheckboxPrimitive.Root.Props) {
    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            indeterminate={indeterminate}
            className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-sm border border-foreground/25 bg-background shadow-xs transition-[color,box-shadow] outline-none hover:border-foreground/50 data-checked:border-foreground data-checked:bg-foreground data-checked:text-background data-indeterminate:border-foreground data-indeterminate:bg-foreground data-indeterminate:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50",
                className,
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator className="flex text-current">
                {indeterminate ? (
                    <MinusIcon className="size-3" strokeWidth={3} />
                ) : (
                    <CheckIcon className="size-3" strokeWidth={3} />
                )}
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}

export { Checkbox };
