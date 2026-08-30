import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createOrderFromCheckout } from "@/queries/orders";

export async function POST(request: Request) {
    const payload = await request.text();
    const signature = request.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret || !signature) {
        return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
        event = getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
        console.error("Stripe webhook signature verification failed.", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object;
            await createOrderFromCheckout(session);
            break;
        }
        default:
            break;
    }

    return NextResponse.json({ received: true });
}
