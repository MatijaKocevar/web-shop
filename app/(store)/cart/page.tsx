import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { getHydratedCart } from "@/queries/cart";
import { CartItems } from "./_components/cart-items";
import { CartSummary } from "./_components/cart-summary";

export default async function CartPage() {
    const { items, subtotal } = await getHydratedCart();

    if (items.length === 0) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-20 text-center">
                <h1 className="mb-4 text-2xl font-semibold">Your cart is empty</h1>
                <p className="mb-6 text-muted-foreground">
                    Add some products or upload a model to get started.
                </p>
                <Link href="/products" className={buttonVariants()}>
                    Browse products
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-10">
            <h1 className="mb-6 text-2xl font-semibold">Cart</h1>
            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                <CartItems items={items} />
                <aside className="h-fit rounded-xl border p-5">
                    <CartSummary subtotal={subtotal} />
                </aside>
            </div>
        </div>
    );
}
