import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripe(): Stripe {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY.");
    }

    if (!client) {
        client = new Stripe(process.env.STRIPE_SECRET_KEY, { typescript: true });
    }

    return client;
}
