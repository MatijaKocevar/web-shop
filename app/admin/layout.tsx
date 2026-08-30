import Link from "next/link";
import { redirect } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    Printer,
    Layers,
    Receipt,
    ListOrdered,
    Users,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { auth } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (session?.user.role !== "ADMIN") redirect("/signin");

    const t = await getTranslations("admin.nav");
    const tCommon = await getTranslations("admin");

    const nav = [
        { href: "/admin", label: t("dashboard"), icon: LayoutDashboard },
        { href: "/admin/products", label: t("products"), icon: Package },
        { href: "/admin/filaments", label: t("filaments"), icon: Layers },
        { href: "/admin/printers", label: t("printers"), icon: Printer },
        { href: "/admin/orders", label: t("orders"), icon: Receipt },
        { href: "/admin/print-queue", label: t("printQueue"), icon: ListOrdered },
        { href: "/admin/users", label: t("users"), icon: Users },
    ];

    return (
        <div className="flex min-h-dvh">
            <aside className="flex w-56 shrink-0 flex-col border-r">
                <div className="flex h-14 items-center gap-2 border-b px-4 font-semibold">
                    {tCommon("printShopAdmin")}
                </div>
                <nav className="flex flex-col gap-1 p-2">
                    {nav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                            <item.icon className="size-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="mt-auto flex items-center justify-between border-t p-2">
                    <span className="text-sm text-muted-foreground">{session.user.email}</span>
                    <div className="flex items-center gap-1">
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </div>
                </div>
            </aside>
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
