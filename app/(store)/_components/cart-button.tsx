"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { useCartCount } from "@/app/(store)/cart/_stores/cart-store";

export function CartButton() {
    const count = useCartCount();
    const t = useTranslations("common");

    return (
        <Link
            href="/cart"
            className={buttonVariants({ variant: "ghost", size: "icon", className: "relative" })}
        >
            <ShoppingCart className="size-4" />
            {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {count > 99 ? "99+" : count}
                </span>
            )}
            <span className="sr-only">{t("cart")}</span>
        </Link>
    );
}
