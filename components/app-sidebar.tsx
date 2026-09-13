"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Store, LayoutDashboard, Package, Printer, Layers, Receipt, Users } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";

type AppSidebarProps = {
    email: string | null | undefined;
};

export function AppSidebar({ email }: AppSidebarProps) {
    const t = useTranslations("admin.nav");
    const pathname = usePathname();
    const { setOpenMobile } = useSidebar();

    const closeMobile = () => setOpenMobile(false);

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
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            render={<Link href="/admin" onClick={closeMobile} />}
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <Package className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">Print Shop</span>
                                <span className="truncate text-xs">Admin</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {nav.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        render={<Link href={item.href} onClick={closeMobile} />}
                                        isActive={isActive(item)}
                                        tooltip={item.label}
                                    >
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center justify-between gap-2 px-2 py-1">
                            <span className="truncate text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                                {email}
                            </span>
                            <div className="flex items-center gap-1">
                                <LanguageSwitcher />
                                <ThemeToggle />
                            </div>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
