import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

type AdminLayoutProps = {
    children: React.ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
    const session = await auth();
    if (session?.user.role !== "ADMIN") redirect("/signin");

    return (
        <SidebarProvider className="h-svh">
            <AppSidebar email={session.user.email} />
            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger />
                </header>
                <div className="flex min-h-0 flex-1 flex-col p-4 lg:p-6">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
