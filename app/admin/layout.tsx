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

import { auth } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/filaments", label: "Filaments", icon: Layers },
    { href: "/admin/printers", label: "Printers", icon: Printer },
    { href: "/admin/orders", label: "Orders", icon: Receipt },
    { href: "/admin/print-queue", label: "Print queue", icon: ListOrdered },
    { href: "/admin/users", label: "Users", icon: Users },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (session?.user.role !== "ADMIN") redirect("/signin");

    return (
        <div className="flex min-h-dvh">
            <aside className="flex w-56 shrink-0 flex-col border-r">
                <div className="flex h-14 items-center gap-2 border-b px-4 font-semibold">
                    Print Shop Admin
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
                    <ThemeToggle />
                </div>
            </aside>
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
