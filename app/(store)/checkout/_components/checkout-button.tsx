"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "../_actions/create-checkout-session";

export function CheckoutButton() {
    const router = useRouter();
    const [pending, setPending] = useState(false);

    async function handleClick() {
        setPending(true);

        try {
            await createCheckoutSession();
        } catch (err) {
            console.error(err);
            setPending(false);
        }

        // On success the server action redirects; this is a fallback refresh.
        router.refresh();
    }

    return (
        <Button size="lg" className="w-full" onClick={handleClick} disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            Pay with Stripe
        </Button>
    );
}
