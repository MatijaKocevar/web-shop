import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin-sidebar";

type AdminLayoutProps = {
    children: React.ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
    const session = await auth();
    if (session?.user.role !== "ADMIN") redirect("/signin");

    return (
        <div className="flex min-h-dvh">
            <AdminSidebar email={session.user.email} />
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
