"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

const NAVIGABLE_SEGMENTS = ["products", "filaments", "printers", "orders", "users", "stock"];

export function AdminBreadcrumbs() {
    const pathname = usePathname();
    const t = useTranslations("admin.nav");
    const tBreadcrumb = useTranslations("admin.breadcrumb");

    const segments = pathname.split("/").filter(Boolean);

    if (segments[0] !== "admin") return null;

    const crumbs = segments.slice(1).map((segment, index) => {
        const href = `/admin/${segments.slice(1, index + 2).join("/")}`;

        let label: string;

        if (segment === "new") {
            label = tBreadcrumb("new");
        } else if (segment === "profile") {
            label = tBreadcrumb("profile");
        } else if (NAVIGABLE_SEGMENTS.includes(segment)) {
            label = t(segment);
        } else {
            label = segment;
        }

        return { href, label, navigable: NAVIGABLE_SEGMENTS.includes(segment) };
    });

    const all = [{ href: "/admin", label: t("dashboard"), navigable: true }, ...crumbs];

    return (
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-sm">
            {all.map((crumb, index) => {
                const isLast = index === all.length - 1;

                return (
                    <span key={crumb.href} className="flex min-w-0 items-center gap-1">
                        {index > 0 && (
                            <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
                        )}
                        {isLast ? (
                            <span className="truncate font-medium">{crumb.label}</span>
                        ) : crumb.navigable ? (
                            <Link
                                href={crumb.href}
                                className="shrink-0 text-muted-foreground hover:text-foreground"
                            >
                                {crumb.label}
                            </Link>
                        ) : (
                            <span className="shrink-0 text-muted-foreground">{crumb.label}</span>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
