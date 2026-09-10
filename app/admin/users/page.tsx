import Link from "next/link";
import { Trash2 } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { AdminFormDialog } from "@/components/admin-form-dialog";
import { AdminTable } from "@/components/admin-table";
import type { AdminTableColumn } from "@/components/admin-table.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUserById, listUsers } from "@/queries/users";
import { updateUserRole } from "./_actions/update-user-role";
import { deleteUser } from "./_actions/delete-user";
import { UserForm } from "./_components/user-form";

const selectClass =
    "rounded-md border bg-background px-2 py-1 text-xs focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

type AdminUsersPageProps = {
    searchParams: Promise<{ id?: string }>;
};

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
    const { id } = await searchParams;
    const [users, editing] = await Promise.all([listUsers(), id ? getUserById(id) : null]);
    const locale = await getLocale();
    const t = await getTranslations("admin.users");
    const tCommon = await getTranslations("common");
    const tRole = await getTranslations("role");

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

    const rows = users.map((user) => ({
        key: user.id,
        href: `/admin/users?id=${user.id}`,
        filterValues: { role: user.role },
        cells: [
            {
                content: (
                    <Link
                        href={`/admin/users?id=${user.id}`}
                        className="font-medium hover:underline"
                    >
                        {user.name ?? "—"}
                    </Link>
                ),
                search: user.name ?? "",
            },
            {
                content: user.email ?? "—",
                className: "text-muted-foreground",
                search: user.email ?? "",
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
            { content: user._count.orders, sort: user._count.orders },
            {
                content: user.createdAt.toLocaleDateString(locale),
                className: "text-muted-foreground",
                search: user.createdAt.toLocaleDateString(locale),
                sort: user.createdAt.getTime(),
            },
            {
                content: (
                    <div className="flex items-center gap-1">
                        <form action={updateUserRole} className="flex items-center gap-1">
                            <input type="hidden" name="id" value={user.id} />
                            <select className={selectClass} name="role" defaultValue={user.role}>
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
    }));

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <AdminTable columns={columns} rows={rows} fill />

            <AdminFormDialog
                open={Boolean(editing)}
                onCloseHref="/admin/users"
                title={t("edit")}
                className="sm:max-w-xl"
            >
                {editing && (
                    <UserForm
                        user={{
                            id: editing.id,
                            name: editing.name,
                            email: editing.email,
                            role: editing.role,
                        }}
                    />
                )}
            </AdminFormDialog>
        </div>
    );
}
