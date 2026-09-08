"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import type { Session } from "next-auth";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserMenuProps = {
    session: Session | null;
};

export function UserMenu({ session }: UserMenuProps) {
    const t = useTranslations("common");

    if (!session?.user) {
        return (
            <Link href="/signin" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                {t("signIn")}
            </Link>
        );
    }

    const initials =
        session.user.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() ?? session.user.email?.[0]?.toUpperCase();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon" className="rounded-full" />}
            >
                <Avatar className="size-7">
                    <AvatarImage
                        src={session.user.image ?? undefined}
                        alt={session.user.name ?? ""}
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="flex items-center gap-2">
                        <UserIcon className="size-4" />
                        <div className="flex flex-col">
                            <span className="truncate">
                                {session.user.name ?? session.user.email}
                            </span>
                            {session.user.email && (
                                <span className="truncate text-xs font-normal text-muted-foreground">
                                    {session.user.email}
                                </span>
                            )}
                        </div>
                    </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/orders" />}>
                    <Settings className="size-4" />
                    {t("myOrders")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="size-4" />
                    {t("signOut")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
