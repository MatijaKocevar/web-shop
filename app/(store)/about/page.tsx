import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
    const t = await getTranslations("about");

    return (
        <div className="mx-auto max-w-2xl px-4 py-16">
            <h1 className="mb-6 text-3xl font-semibold">{t("title")}</h1>
            <div className="flex flex-col gap-4 text-muted-foreground">
                <p>{t("p1")}</p>
                <p>{t("p2")}</p>
            </div>
        </div>
    );
}
