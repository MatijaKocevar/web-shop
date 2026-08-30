import { getTranslations } from "next-intl/server";

export default async function FaqPage() {
    const t = await getTranslations("faq");

    const faqs = [
        { q: t("q1"), a: t("a1") },
        { q: t("q2"), a: t("a2") },
        { q: t("q3"), a: t("a3") },
        { q: t("q4"), a: t("a4") },
    ];

    return (
        <div className="mx-auto max-w-2xl px-4 py-16">
            <h1 className="mb-6 text-3xl font-semibold">{t("title")}</h1>
            <div className="flex flex-col gap-6">
                {faqs.map((faq) => (
                    <div key={faq.q}>
                        <h2 className="mb-1 font-medium">{faq.q}</h2>
                        <p className="text-muted-foreground">{faq.a}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
