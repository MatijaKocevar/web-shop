"use client";

import { useState } from "react";
import { Loader2, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/app/(store)/cart/_actions/add-to-cart";
import { useCartStore } from "@/app/(store)/cart/_stores/cart-store";
import type { Variant } from "../_types/variant";

type AddToCartFormProps = {
    productId: string;
    productName: string;
    basePrice: number | null;
    variants: Variant[];
};

export function AddToCartForm({ productId, productName, basePrice, variants }: AddToCartFormProps) {
    const t = useTranslations("products");
    const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
    const [quantity, setQuantity] = useState(1);
    const [pending, setPending] = useState(false);

    const selectedVariant = variants.find((v) => v.id === variantId);
    const unitPrice = selectedVariant?.price ?? basePrice ?? 0;

    async function handleAdd() {
        setPending(true);

        try {
            const items = await addToCart(
                {
                    type: "READY_MADE",
                    name: selectedVariant
                        ? `${productName} — ${selectedVariant.name}`
                        : productName,
                    unitPrice,
                    productId,
                    variantId: variantId || undefined,
                },
                quantity,
            );

            useCartStore.setState({ items });
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="flex flex-col gap-3">
            {variants.length > 0 && (
                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">{t("variant")}</span>
                    <select
                        className="rounded-md border bg-background px-2 py-1.5"
                        value={variantId}
                        onChange={(e) => setVariantId(e.target.value)}
                    >
                        {variants.map((v) => (
                            <option key={v.id} value={v.id}>
                                {v.name}
                            </option>
                        ))}
                    </select>
                </label>
            )}

            <div className="flex items-center gap-3">
                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">{t("quantity")}</span>
                    <input
                        type="number"
                        min={1}
                        className="w-20 rounded-md border bg-background px-2 py-1.5"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                </label>
                <Button size="lg" className="mt-auto" onClick={handleAdd} disabled={pending}>
                    {pending ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <ShoppingCart className="size-4" />
                    )}
                    {t("addToCart")}
                </Button>
            </div>
        </div>
    );
}
