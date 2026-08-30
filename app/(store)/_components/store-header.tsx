import Link from "next/link";
import { Box } from "lucide-react";
import { auth } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { CartButton } from "./cart-button";
import { UserMenu } from "./user-menu";

export async function StoreHeader() {
    const session = await auth();

    return (
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Box className="size-5 text-primary" />
                    <span>Print Shop</span>
                </Link>

                <nav className="hidden items-center gap-1 md:flex">
                    <Link
                        href="/products"
                        className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                        Products
                    </Link>
                    <Link
                        href="/upload"
                        className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                        Upload a model
                    </Link>
                </nav>

                <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <CartButton />
                    <UserMenu session={session} />
                </div>
            </div>
        </header>
    );
}
