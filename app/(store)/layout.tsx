import { getTranslations } from "next-intl/server";
import { getCart } from "@/lib/cart";
import { CartHydrator } from "./_components/cart-hydrator";
import { StoreHeader } from "./_components/store-header";

type StoreLayoutProps = {
    children: React.ReactNode;
};

export default async function StoreLayout({ children }: StoreLayoutProps) {
    const items = await getCart();
    const t = await getTranslations("nav");

    return (
        <div className="flex min-h-dvh flex-col">
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
    );
}
