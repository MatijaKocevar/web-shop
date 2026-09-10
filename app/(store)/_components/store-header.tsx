import Link from "next/link";
import { Box } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { CartButton } from "./cart-button";
import { UserMenu } from "./user-menu";

export async function StoreHeader() {
    const session = await auth();
    const isAdmin = session?.user.role === "ADMIN";
    const t = await getTranslations("common");

    return (
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
            <div className="flex h-14 items-center">
                {isAdmin && (
                    <div className="flex h-full shrink-0 items-center pr-2 pl-4">
                        <SidebarTrigger />
                    </div>
                )}
                <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Box className="size-5 text-primary" />
                        <span>Print Shop</span>
                    </Link>

                    <nav className="hidden items-center gap-1 md:flex">
                        <Link
                            href="/products"
                            className={buttonVariants({ variant: "ghost", size: "sm" })}
                        >
                            {t("products")}
                        </Link>
                        <Link
                            href="/upload"
                            className={buttonVariants({ variant: "ghost", size: "sm" })}
                        >
                            {t("uploadModel")}
                        </Link>
                    </nav>

                    <div className="flex items-center gap-1">
                        <ThemeToggle />
                        <LanguageSwitcher />
                        <CartButton />
                        <UserMenu session={session} />
                    </div>
                </div>
            </div>
        </header>
    );
}
