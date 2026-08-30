import { formatCurrency } from "@/lib/pricing";
import { getHydratedCart } from "@/queries/cart";
import { CheckoutButton } from "./_components/checkout-button";

export default async function CheckoutPage() {
    const { items, subtotal } = await getHydratedCart();

    return (
        <div className="mx-auto max-w-7xl px-4 py-10">
            <h1 className="mb-6 text-2xl font-semibold">Checkout</h1>

            {items.length === 0 ? (
                <p className="text-muted-foreground">Your cart is empty.</p>
            ) : (
                <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-sm font-medium">Order summary</h2>
                        <ul className="flex flex-col divide-y rounded-xl border">
                            {items.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex items-center justify-between px-4 py-3 text-sm"
                                >
                                    <span className="truncate">
                                        {item.name}
                                        <span className="text-muted-foreground">
                                            {" "}
                                            × {item.quantity}
                                        </span>
                                    </span>
                                    <span className="font-medium">
                                        {formatCurrency(item.unitPrice * item.quantity)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <aside className="h-fit rounded-xl border p-5">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Total</span>
                            <span className="text-xl font-semibold">
                                {formatCurrency(subtotal)}
                            </span>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                            You&apos;ll be redirected to Stripe to complete payment. Final price for
                            custom prints is confirmed by slicing before printing.
                        </p>
                        <div className="mt-4">
                            <CheckoutButton />
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}
