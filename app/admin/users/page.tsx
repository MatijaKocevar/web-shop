import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { AdminFormDialog } from "@/components/admin-form-dialog";
import { getOrderById } from "@/queries/orders";
import { getUserById, listUsers } from "@/queries/users";
import { OrderDialog } from "../_components/order-dialog";
import { UserForm } from "./_components/user-form";
import { UsersTable } from "./_components/users-table";
import { EXPANDED_USERS_COOKIE, decodeExpanded } from "./_utils/expanded-users";

type AdminUsersPageProps = {
    searchParams: Promise<{ id?: string; orderId?: string }>;
};

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
    const { id, orderId } = await searchParams;
    const [users, editing, order, store] = await Promise.all([
        listUsers(),
        id ? getUserById(id) : null,
        orderId ? getOrderById(orderId) : null,
        cookies(),
    ]);
    const initialExpanded = decodeExpanded(store.get(EXPANDED_USERS_COOKIE)?.value);
    const t = await getTranslations("admin.users");

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <UsersTable users={users} initialExpanded={initialExpanded} />

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

            {order && <OrderDialog order={order} onCloseHref="/admin/users" />}
        </div>
    );
}
