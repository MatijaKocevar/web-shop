"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ChevronDown,
    ChevronRight,
    ChevronsUpDown,
    CornerDownRight,
    ExternalLink,
    Trash2,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { AdminTable } from "@/components/admin-table";
import type { AdminTableColumn, AdminTableRow } from "@/components/admin-table.types";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatCurrency } from "@/lib/pricing";
import { updateUserRole } from "../_actions/update-user-role";
import { deleteUser } from "../_actions/delete-user";
import { writeExpandedCookie } from "../_utils/expanded-users";
import type { UserWithOrders } from "../_types/user-with-orders";

const selectClass =
    "rounded-md border bg-background px-2 py-1 text-xs focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

type UsersTableProps = {
    users: UserWithOrders[];
    initialExpanded?: string[];
};

export function UsersTable({ users, initialExpanded = [] }: UsersTableProps) {
    const t = useTranslations("admin.users");
    const tCommon = useTranslations("common");
    const tRole = useTranslations("role");
    const tStatus = useTranslations("status.order");
    const locale = useLocale();
    const [expanded, setExpanded] = useState<Set<string>>(() => new Set(initialExpanded));

    function toggle(id: string) {
        const next = new Set(expanded);

        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }

        setExpanded(next);
        writeExpandedCookie([...next]);
    }

    const allExpanded = users.length > 0 && expanded.size >= users.length;

    function toggleAll() {
        const next = allExpanded ? new Set<string>() : new Set(users.map((user) => user.id));

        setExpanded(next);
        writeExpandedCookie([...next]);
    }

    const columns: AdminTableColumn[] = [
        { label: t("name"), sortable: true, filter: { type: "text" } },
        { label: t("email"), sortable: true, filter: { type: "text" } },
        {
            label: t("role"),
            sortable: true,
            filter: {
                type: "select",
                key: "role",
                options: [
                    { value: "CUSTOMER", label: tRole("CUSTOMER") },
                    { value: "ADMIN", label: tRole("ADMIN") },
                ],
            },
        },
        { label: t("orders"), sortable: true },
        { label: t("joined"), sortable: true, filter: { type: "text" } },
        { label: t("actions") },
    ];

    const rows: AdminTableRow[] = users.flatMap((user) => {
        const isOpen = expanded.has(user.id);
        const name = user.name ?? "";
        const email = user.email ?? "";
        const joined = user.createdAt.toLocaleDateString(locale);

        const userRow: AdminTableRow = {
            key: user.id,
            className: "bg-muted/40",
            href: `/admin/users?id=${user.id}`,
            filterValues: { role: user.role },
            cells: [
                {
                    content: (
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                                onClick={() => toggle(user.id)}
                                title={t("toggleOrders")}
                            >
                                {isOpen ? (
                                    <ChevronDown className="size-4" />
                                ) : (
                                    <ChevronRight className="size-4" />
                                )}
                            </button>
                            <Link
                                href={`/admin/users?id=${user.id}`}
                                className="font-medium hover:underline"
                            >
                                {user.name ?? "—"}
                            </Link>
                        </div>
                    ),
                    search: name,
                    sort: name,
                },
                {
                    content: user.email ?? "—",
                    className: "text-muted-foreground",
                    search: email,
                    sort: email,
                },
                {
                    content: (
                        <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                            {tRole(user.role)}
                        </Badge>
                    ),
                    search: tRole(user.role),
                    sort: user.role,
                },
                { content: user.ordersCount, sort: user.ordersCount },
                {
                    content: joined,
                    className: "text-muted-foreground",
                    search: joined,
                    sort: user.createdAt.getTime(),
                },
                {
                    content: (
                        <div className="flex items-center gap-1">
                            <form action={updateUserRole} className="flex items-center gap-1">
                                <input type="hidden" name="id" value={user.id} />
                                <select
                                    className={selectClass}
                                    name="role"
                                    defaultValue={user.role}
                                >
                                    <option value="CUSTOMER">{tRole("CUSTOMER")}</option>
                                    <option value="ADMIN">{tRole("ADMIN")}</option>
                                </select>
                                <Button type="submit" variant="outline" size="sm">
                                    {tCommon("set")}
                                </Button>
                            </form>
                            <form action={deleteUser}>
                                <input type="hidden" name="id" value={user.id} />
                                <Button type="submit" variant="ghost" size="icon">
                                    <Trash2 className="size-4" />
                                    <span className="sr-only">{t("deleteUser")}</span>
                                </Button>
                            </form>
                        </div>
                    ),
                },
            ],
        };

        if (!isOpen) return [userRow];

        const orderRows: AdminTableRow[] = user.orders.map((order) => ({
            key: order.id,
            parentKey: user.id,
            href: `/admin/users?orderId=${order.id}`,
            filterValues: { role: user.role },
            cells: [
                {
                    content: (
                        <div className="flex items-center gap-1.5 pl-7">
                            <CornerDownRight className="size-3.5 shrink-0 text-muted-foreground" />
                            <Link
                                href={`/admin/users?orderId=${order.id}`}
                                className="text-muted-foreground hover:underline"
                            >
                                {order.createdAt.toLocaleDateString(locale)}
                            </Link>
                        </div>
                    ),
                    search: `${name} ${email} ${order.createdAt.toLocaleDateString(locale)}`,
                    sort: name,
                },
                {
                    content: <Badge variant="secondary">{tStatus(order.status)}</Badge>,
                    search: `${email} ${tStatus(order.status)}`,
                    sort: email,
                },
                { content: "", sort: user.role },
                { content: order.itemsCount, sort: user.ordersCount },
                {
                    content: formatCurrency(order.total, order.currency, locale),
                    sort: user.createdAt.getTime(),
                },
                {
                    content: (
                        <div className="flex justify-end">
                            <Link
                                href={`/admin/users?orderId=${order.id}`}
                                aria-label={t("viewOrder")}
                                className={buttonVariants({ variant: "outline", size: "sm" })}
                            >
                                <ExternalLink className="size-4" />
                                <span className="hidden sm:inline">{t("viewOrder")}</span>
                            </Link>
                        </div>
                    ),
                },
            ],
        }));

        if (orderRows.length === 0) {
            orderRows.push({
                key: `${user.id}-empty`,
                parentKey: user.id,
                filterValues: { role: user.role },
                cells: [
                    {
                        content: (
                            <span className="flex items-center gap-1.5 pl-7 text-muted-foreground">
                                <CornerDownRight className="size-3.5 shrink-0" />
                                {t("noOrders")}
                            </span>
                        ),
                        className: "text-muted-foreground",
                        colSpan: 6,
                    },
                ],
            });
        }

        return [userRow, ...orderRows];
    });

    return (
        <AdminTable
            columns={columns}
            rows={rows}
            toolbarActions={
                users.length > 0 && (
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={toggleAll}
                        aria-label={allExpanded ? t("collapseAll") : t("expandAll")}
                    >
                        <ChevronsUpDown className="size-4" />
                        <span className="hidden sm:inline">
                            {allExpanded ? t("collapseAll") : t("expandAll")}
                        </span>
                    </Button>
                )
            }
            fill
        />
    );
}
