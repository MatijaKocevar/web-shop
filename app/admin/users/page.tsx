import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listUsers } from "@/queries/users";
import { updateUserRole } from "./_actions/update-user-role";
import { deleteUser } from "./_actions/delete-user";

const selectClass =
    "rounded-md border bg-background px-2 py-1 text-xs focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

export default async function AdminUsersPage() {
    const users = await listUsers();

    return (
        <div>
            <h1 className="mb-6 text-2xl font-semibold">Users</h1>
            <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-left">
                        <tr>
                            <th className="px-4 py-2 font-medium">Name</th>
                            <th className="px-4 py-2 font-medium">Email</th>
                            <th className="px-4 py-2 font-medium">Role</th>
                            <th className="px-4 py-2 font-medium">Orders</th>
                            <th className="px-4 py-2 font-medium">Joined</th>
                            <th className="px-4 py-2 font-medium">Actions</th>
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
                                        {user.role}
                                    </Badge>
                                </td>
                                <td className="px-4 py-2">{user._count.orders}</td>
                                <td className="px-4 py-2 text-muted-foreground">
                                    {user.createdAt.toLocaleDateString()}
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
                                            <option value="CUSTOMER">CUSTOMER</option>
                                            <option value="ADMIN">ADMIN</option>
                                        </select>
                                        <Button type="submit" variant="outline" size="sm">
                                            Set
                                        </Button>
                                    </form>
                                </td>
                                <td className="px-4 py-2">
                                    <form action={deleteUser}>
                                        <input type="hidden" name="id" value={user.id} />
                                        <Button type="submit" variant="ghost" size="icon">
                                            <Trash2 className="size-4" />
                                            <span className="sr-only">Delete user</span>
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
