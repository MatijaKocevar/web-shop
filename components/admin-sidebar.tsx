"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
    Store,
    LayoutDashboard,
    Package,
    Printer,
    Layers,
    Receipt,
    Users,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { cn } from "@/lib/utils";

type AdminSidebarProps = {
    email: string | null | undefined;
};

const STORAGE_KEY = "admin-sidebar-collapsed";

function subscribe(callback: () => void) {
    window.addEventListener(STORAGE_KEY, callback);

    return () => window.removeEventListener(STORAGE_KEY, callback);
}

function getSnapshot() {
    return localStorage.getItem(STORAGE_KEY) === "true";
}

function getServerSnapshot() {
    return false;
}

export function AdminSidebar({ email }: AdminSidebarProps) {
    const t = useTranslations("admin.nav");
    const tAdmin = useTranslations("admin");
    const pathname = usePathname();
    const collapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    function toggle() {
        localStorage.setItem(STORAGE_KEY, String(!collapsed));
        window.dispatchEvent(new Event(STORAGE_KEY));
    }

    const nav = [
        { href: "/", label: t("store"), icon: Store, exact: true },
        { href: "/admin", label: t("dashboard"), icon: LayoutDashboard, exact: true },
        { href: "/admin/products", label: t("products"), icon: Package, exact: false },
        { href: "/admin/filaments", label: t("filaments"), icon: Layers, exact: false },
        { href: "/admin/printers", label: t("printers"), icon: Printer, exact: false },
        { href: "/admin/orders", label: t("orders"), icon: Receipt, exact: false },
        { href: "/admin/users", label: t("users"), icon: Users, exact: false },
    ];

    function isActive(item: (typeof nav)[number]) {
        return item.exact ? pathname === item.href : pathname.startsWith(item.href);
    }

    return (
        <aside
            className={cn(
                "sticky top-0 flex h-dvh shrink-0 flex-col border-r bg-background",
                collapsed ? "w-14" : "w-56",
            )}
        >
            <div
                className={cn(
                    "flex h-14 shrink-0 items-center border-b",
                    collapsed ? "justify-center px-1" : "justify-between px-2 pl-4",
                )}
            >
                {!collapsed && (
                    <span className="truncate font-semibold">{tAdmin("printShopAdmin")}</span>
                )}
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={toggle}
                    title={collapsed ? t("expand") : t("collapse")}
                >
                    {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
                </Button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
                {nav.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        title={item.label}
                        className={cn(
                            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                            collapsed && "justify-center px-0",
                            isActive(item) && "bg-muted text-foreground",
                        )}
                    >
                        <item.icon className="size-4 shrink-0" />
                        {!collapsed && item.label}
                    </Link>
                ))}
            </nav>
            <div
                className={cn(
                    "flex shrink-0 items-center border-t p-2",
                    collapsed ? "flex-col gap-2" : "justify-between",
                )}
            >
                {!collapsed && (
                    <span className="truncate text-sm text-muted-foreground">{email}</span>
                )}
                <div className="flex items-center gap-1">
                    <LanguageSwitcher />
                    <ThemeToggle />
                </div>
            </div>
        </aside>
    );
}
