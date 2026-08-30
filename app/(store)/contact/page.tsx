import { getTranslations } from "next-intl/server";

export default async function ContactPage() {
    const t = await getTranslations("contact");
    const email = t("email");

    return (
        <div className="mx-auto max-w-2xl px-4 py-16">
            <h1 className="mb-6 text-3xl font-semibold">{t("title")}</h1>
            <p className="text-muted-foreground">
                {t("body")}{" "}
                <a href={`mailto:${email}`} className="text-primary hover:underline">
                    {email}
                </a>
                .
            </p>
        </div>
    );
}
