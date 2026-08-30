"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/pricing";
import { publicUrl } from "@/lib/storage";
import { removeFromCart } from "../_actions/remove-from-cart";
import { updateQuantity } from "../_actions/update-quantity";
import type { HydratedCartItem } from "@/queries/cart";

export function CartItems({ items }: { items: HydratedCartItem[] }) {
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
                                      item.supports ? "supports" : null,
                                  ]
                                      .filter(Boolean)
                                      .join(" · ")
                                : "Ready made"}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                            −
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                            +
                        </Button>
                    </div>

                    <div className="w-20 text-right font-medium">
                        {formatCurrency(item.unitPrice * item.quantity)}
                    </div>

                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="size-4" />
                        <span className="sr-only">Remove</span>
                    </Button>
                </li>
            ))}
        </ul>
    );
}
