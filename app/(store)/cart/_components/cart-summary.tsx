import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/pricing";

export function CartSummary({ subtotal }: { subtotal: number }) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            <Link href="/checkout" className={buttonVariants({ size: "lg" })}>
                Checkout
            </Link>
        </div>
    );
}
