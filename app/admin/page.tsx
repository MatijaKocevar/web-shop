import { getTranslations } from "next-intl/server";
import { getStoreStats } from "@/queries/stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
    const data = await getStoreStats();
    const t = await getTranslations("admin.dashboard");

    const stats = [
        { label: t("products"), value: data.products },
        { label: t("orders"), value: data.orders },
        { label: t("printJobs"), value: data.printJobs },
        { label: t("users"), value: data.users },
    ];

    return (
        <div>
            <h1 className="mb-6 text-2xl font-semibold">{t("title")}</h1>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold">{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
