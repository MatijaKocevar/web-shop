"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button, buttonVariants } from "@/components/ui/button";
import { saveUser } from "../_actions/save-user";
import type { User } from "../_types/user";
import { PasswordInput } from "./password-input";

const inputClass =
    "rounded-md border bg-background px-3 py-2 text-sm w-full focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

type UserFormProps = {
    user: User;
};

export function UserForm({ user }: UserFormProps) {
    const t = useTranslations("admin.users");
    const tCommon = useTranslations("admin.common");
    const tRole = useTranslations("role");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const mismatch = confirm !== "" && password !== confirm;

    return (
        <div>
            <form action={saveUser} className="flex flex-col gap-4">
                <input type="hidden" name="id" value={user.id} />

                <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">{t("name")}</span>
                        <input className={inputClass} name="name" defaultValue={user.name ?? ""} />
                    </label>

                    <label className="flex flex-col gap-1.5 text-sm">
                        <span className="font-medium">{t("email")}</span>
                        <input
                            className={inputClass}
                            name="email"
                            type="email"
                            defaultValue={user.email ?? ""}
                            required
                        />
                    </label>
                </div>

                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">{t("role")}</span>
                    <select className={inputClass} name="role" defaultValue={user.role}>
                        <option value="CUSTOMER">{tRole("CUSTOMER")}</option>
                        <option value="ADMIN">{tRole("ADMIN")}</option>
                    </select>
                </label>

                {user.role === "CUSTOMER" && (
                    <>
                        <label className="flex flex-col gap-1.5 text-sm">
                            <span className="font-medium">{t("password")}</span>
                            <PasswordInput
                                className={inputClass}
                                name="password"
                                value={password}
                                onChange={setPassword}
                                minLength={8}
                                autoComplete="new-password"
                                placeholder={t("passwordHint")}
                            />
                        </label>

                        <label className="flex flex-col gap-1.5 text-sm">
                            <span className="font-medium">{t("passwordConfirm")}</span>
                            <PasswordInput
                                className={inputClass}
                                name="passwordConfirm"
                                value={confirm}
                                onChange={setConfirm}
                                minLength={8}
                                autoComplete="new-password"
                            />
                        </label>

                        {mismatch && (
                            <p className="text-sm text-destructive">{t("passwordMismatch")}</p>
                        )}
                    </>
                )}

                <div className="flex items-center justify-end gap-2">
                    <Link href="/admin/users" className={buttonVariants({ variant: "ghost" })}>
                        {tCommon("cancel")}
                    </Link>
                    <Button type="submit" disabled={mismatch}>
                        {tCommon("save")}
                    </Button>
                </div>
            </form>
        </div>
    );
}
