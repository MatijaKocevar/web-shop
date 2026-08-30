import { Trash2 } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listUsers } from "@/queries/users";
import { updateUserRole } from "./_actions/update-user-role";
import { deleteUser } from "./_actions/delete-user";

const selectClass =
    "rounded-md border bg-background px-2 py-1 text-xs focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

export default async function AdminUsersPage() {
    const users = await listUsers();
    const locale = await getLocale();
    const t = await getTranslations("admin.users");
    const tCommon = await getTranslations("common");
    const tRole = await getTranslations("role");

    return (
        <div>
            <h1 className="mb-6 text-2xl font-semibold">{t("title")}</h1>
            <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-left">
                        <tr>
                            <th className="px-4 py-2 font-medium">{t("name")}</th>
                            <th className="px-4 py-2 font-medium">{t("email")}</th>
                            <th className="px-4 py-2 font-medium">{t("role")}</th>
                            <th className="px-4 py-2 font-medium">{t("orders")}</th>
                            <th className="px-4 py-2 font-medium">{t("joined")}</th>
                            <th className="px-4 py-2 font-medium">{t("actions")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-muted/30">
                                <td className="px-4 py-2 font-medium">{user.name ?? "—"}</td>
                                <td className="px-4 py-2 text-muted-foreground">
                                    {user.email ?? "—"}
                                </td>
                                <td className="px-4 py-2">
                                    <Badge
                                        variant={user.role === "ADMIN" ? "default" : "secondary"}
                                    >
                                        {tRole(user.role)}
                                    </Badge>
                                </td>
                                <td className="px-4 py-2">{user._count.orders}</td>
                                <td className="px-4 py-2 text-muted-foreground">
                                    {user.createdAt.toLocaleDateString(locale)}
                                </td>
                                <td className="px-4 py-2">
                                    <form
                                        action={updateUserRole}
                                        className="flex items-center gap-1"
                                    >
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
                                </td>
                                <td className="px-4 py-2">
                                    <form action={deleteUser}>
                                        <input type="hidden" name="id" value={user.id} />
                                        <Button type="submit" variant="ghost" size="icon">
                                            <Trash2 className="size-4" />
                                            <span className="sr-only">{t("deleteUser")}</span>
                                        </Button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
