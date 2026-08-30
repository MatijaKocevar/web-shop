"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { getHydratedCart } from "@/queries/cart";

export async function createCheckoutSession() {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY.");
    }

    const session = await auth();
    const { items } = await getHydratedCart();

    if (items.length === 0) redirect("/cart");

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:10000";

    const stripeSession = await getStripe().checkout.sessions.create({
        mode: "payment",
        line_items: items.map((item) => ({
            quantity: item.quantity,
            price_data: {
                currency: "eur",
                product_data: { name: item.name },
                unit_amount: Math.round(item.unitPrice * 100),
            },
        })),
        customer_email: session?.user?.email ?? undefined,
        success_url: `${baseUrl}/orders?checkout=success`,
        cancel_url: `${baseUrl}/cart`,
        metadata: {
            items: JSON.stringify(
                items.map((item) => ({
                    type: item.type,
                    name: item.name,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    productId: item.productId ?? null,
                    variantId: item.variantId ?? null,
                    fileId: item.fileId ?? null,
                    profileId: item.profileId ?? null,
                    filamentId: item.filamentId ?? null,
                    infill: item.infill ?? null,
                    supports: item.supports ?? null,
                })),
            ),
        },
    });

    if (!stripeSession.url) {
        throw new Error("Could not create Stripe checkout session.");
    }

    redirect(stripeSession.url);
}
