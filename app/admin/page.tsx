import { getStoreStats } from "@/queries/stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
    const data = await getStoreStats();

    const stats = [
        { label: "Products", value: data.products },
        { label: "Orders", value: data.orders },
        { label: "Print jobs", value: data.printJobs },
        { label: "Users", value: data.users },
    ];

    return (
        <div>
            <h1 className="mb-6 text-2xl font-semibold">Dashboard</h1>
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
