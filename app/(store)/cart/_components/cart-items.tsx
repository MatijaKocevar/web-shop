"use client";

import { Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/pricing";
import { publicUrl } from "@/lib/storage";
import { removeFromCart } from "../_actions/remove-from-cart";
import { updateQuantity } from "../_actions/update-quantity";
import { useCartStore } from "../_stores/cart-store";
import type { HydratedCartItem } from "@/queries/cart";

export function CartItems({ items }: { items: HydratedCartItem[] }) {
    const locale = useLocale();
    const t = useTranslations("cart");

    async function handleUpdateQuantity(id: string, quantity: number) {
        const next = await updateQuantity(id, quantity);

        useCartStore.setState({ items: next });
    }

    async function handleRemove(id: string) {
        const next = await removeFromCart(id);

        useCartStore.setState({ items: next });
    }

    return (
        <ul className="flex flex-col divide-y">
            {items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-4">
                    <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                        {item.imageKey ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={publicUrl(item.imageKey)}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-xs text-muted-foreground">3D</span>
                        )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <p className="truncate font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {item.type === "CUSTOM_PRINT"
                                ? [
                                      item.filamentName,
                                      item.profileName,
                                      item.infill ? `${item.infill}%` : null,
                                      item.supports ? t("supports") : null,
                                  ]
                                      .filter(Boolean)
                                      .join(" · ")
                                : t("readyMade")}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                            −
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                            +
                        </Button>
                    </div>

                    <div className="w-20 text-right font-medium">
                        {formatCurrency(item.unitPrice * item.quantity, "EUR", locale)}
                    </div>

                    <Button variant="ghost" size="icon" onClick={() => handleRemove(item.id)}>
                        <Trash2 className="size-4" />
                        <span className="sr-only">{t("remove")}</span>
                    </Button>
                </li>
            ))}
        </ul>
    );
}
