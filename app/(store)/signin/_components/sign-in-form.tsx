"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type SignInFormProps = {
    callbackUrl?: string;
    testLogin?: boolean;
};

export function SignInForm({ callbackUrl, testLogin }: SignInFormProps) {
    const t = useTranslations("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState<"google" | "email" | "credentials" | null>(null);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>{t("subtitle")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Button
                    onClick={() => {
                        setLoading("google");
                        signIn("google", { callbackUrl });
                    }}
                    disabled={loading !== null}
                >
                    {loading === "google" && <Loader2 className="size-4 animate-spin" />}
                    {t("continueGoogle")}
                </Button>

                <div className="flex items-center gap-3">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground">{t("or")}</span>
                    <Separator className="flex-1" />
                </div>

                <form
                    className="flex flex-col gap-3"
                    onSubmit={(e) => {
                        e.preventDefault();
                        setLoading("email");
                        signIn("resend", { email, callbackUrl });
                    }}
                >
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="email">{t("email")}</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder={t("emailPlaceholder")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" variant="outline" disabled={loading !== null}>
                        {loading === "email" && <Loader2 className="size-4 animate-spin" />}
                        {t("emailMeLink")}
                    </Button>
                </form>

                {testLogin && (
                    <>
                        <div className="flex items-center gap-3">
                            <Separator className="flex-1" />
                            <span className="text-xs text-muted-foreground">{t("testLogin")}</span>
                            <Separator className="flex-1" />
                        </div>

                        <form
                            className="flex flex-col gap-3 rounded-lg border border-dashed p-3"
                            onSubmit={(e) => {
                                e.preventDefault();
                                setLoading("credentials");
                                signIn("credentials", { email, password, callbackUrl });
                            }}
                        >
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="test-email">{t("email")}</Label>
                                <Input
                                    id="test-email"
                                    type="email"
                                    placeholder="admin@test.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="test-password">{t("password")}</Label>
                                <Input
                                    id="test-password"
                                    type="password"
                                    placeholder="password123"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" variant="secondary" disabled={loading !== null}>
                                {loading === "credentials" && (
                                    <Loader2 className="size-4 animate-spin" />
                                )}
                                {t("testLoginButton")}
                            </Button>
                            <p className="text-xs text-muted-foreground">{t("testHint")}</p>
                        </form>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
