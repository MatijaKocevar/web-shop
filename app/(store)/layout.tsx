import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { getCart } from "@/lib/cart";
import { AdminSidebar } from "@/components/admin-sidebar";
import { CartHydrator } from "./_components/cart-hydrator";
import { StoreHeader } from "./_components/store-header";

type StoreLayoutProps = {
    children: React.ReactNode;
};

export default async function StoreLayout({ children }: StoreLayoutProps) {
    const items = await getCart();
    const t = await getTranslations("nav");
    const session = await auth();
    const isAdmin = session?.user.role === "ADMIN";

    return (
        <div className="flex min-h-dvh">
            {isAdmin && <AdminSidebar email={session.user.email} />}
            <div className="flex min-h-dvh flex-1 flex-col">
                <CartHydrator items={items} />
                <StoreHeader />
                <main className="flex-1">{children}</main>
                <footer className="border-t py-10">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row">
                        <p>© {new Date().getFullYear()} 3D Print Shop</p>
                        <nav className="flex gap-4">
                            <a href="/about" className="hover:text-foreground">
                                {t("about")}
                            </a>
                            <a href="/faq" className="hover:text-foreground">
                                {t("faq")}
                            </a>
                            <a href="/contact" className="hover:text-foreground">
                                {t("contact")}
                            </a>
                        </nav>
                    </div>
                </footer>
            </div>
        </div>
    );
}
