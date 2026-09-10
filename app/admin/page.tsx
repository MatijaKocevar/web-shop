import {
    CalendarDays,
    CheckCircle2,
    Clock,
    Gauge,
    Inbox,
    Layers,
    Package,
    Printer,
    Receipt,
    ShoppingBag,
    TriangleAlert,
    Users,
    XCircle,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { AdminTable } from "@/components/admin-table";
import { Badge } from "@/components/ui/badge";
import { capacitySection, leadTimeSection, rhythmSection, sellSection } from "@/lib/strategy";
import { listFilaments } from "@/queries/filaments";
import { getProductionStats } from "@/queries/production";
import { getStoreStats } from "@/queries/stats";
import { FilamentStockPanel } from "./_components/filament-stock-panel";
import { StatCards } from "./_components/stat-cards";
import { StrategyCard } from "./_components/strategy-card";

export default async function AdminDashboardPage() {
    const [production, filaments, store] = await Promise.all([
        getProductionStats(),
        listFilaments(),
        getStoreStats(),
    ]);
    const t = await getTranslations("admin.dashboard");
    const tStrategy = await getTranslations("admin.strategy");

    const cards = [
        {
            label: tStrategy("openOrders"),
            value: production.openOrders,
            icon: Inbox,
            accent: "text-primary",
        },
        {
            label: tStrategy("printing"),
            value: production.printing,
            icon: Printer,
            accent: "text-sky-600",
        },
        {
            label: tStrategy("lowStock"),
            value: production.lowStockCount,
            icon: TriangleAlert,
            accent: production.lowStockCount > 0 ? "text-destructive" : "text-green-600",
        },
        {
            label: tStrategy("filamentOnHand"),
            value: `${(production.totalGrams / 1000).toFixed(2)} kg`,
            icon: Layers,
            accent: "text-amber-600",
        },
        { label: t("products"), value: store.products, icon: Package, accent: "text-emerald-600" },
        { label: t("orders"), value: store.orders, icon: Receipt, accent: "text-violet-600" },
        { label: t("users"), value: store.users, icon: Users, accent: "text-rose-600" },
    ];

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">{t("title")}</h1>
                <p className="text-sm text-muted-foreground">{tStrategy("subtitle")}</p>
            </div>

            <div className="mb-4">
                <StatCards cards={cards} />
            </div>

            <div className="grid items-start gap-4 lg:grid-cols-2">
                <FilamentStockPanel filaments={filaments} />

                <StrategyCard
                    icon={ShoppingBag}
                    title={sellSection.title}
                    subtitle={sellSection.subtitle}
                    accent="text-emerald-600"
                >
                    <Badge variant="secondary" className="mb-4">
                        {sellSection.rule}
                    </Badge>
                    <ul className="flex flex-col gap-2">
                        {sellSection.items.map((item) => (
                            <li key={item.text} className="flex items-start gap-2 text-sm">
                                {item.avoid ? (
                                    <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                                ) : (
                                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
                                )}
                                <span className={item.avoid ? "text-muted-foreground" : undefined}>
                                    {item.text}
                                </span>
                            </li>
                        ))}
                    </ul>
                </StrategyCard>

                <StrategyCard
                    icon={CalendarDays}
                    title={rhythmSection.title}
                    subtitle={rhythmSection.subtitle}
                    accent="text-sky-600"
                >
                    <ol className="flex flex-col">
                        {rhythmSection.steps.map((step, index) => (
                            <li
                                key={step.when}
                                className="relative flex gap-3 pb-4 text-sm last:pb-0"
                            >
                                {index < rhythmSection.steps.length - 1 && (
                                    <span className="absolute left-[11px] top-6 h-full w-px bg-border" />
                                )}
                                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-medium">
                                    {index + 1}
                                </span>
                                <div>
                                    <p className="font-medium">{step.when}</p>
                                    <p className="text-muted-foreground">{step.action}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </StrategyCard>

                <StrategyCard
                    icon={Clock}
                    title={leadTimeSection.title}
                    subtitle={leadTimeSection.subtitle}
                    accent="text-violet-600"
                >
                    <AdminTable
                        toolbar={false}
                        rows={leadTimeSection.rows.map((row) => ({
                            key: row.item,
                            cells: [
                                {
                                    content: <span className="font-medium">{row.item}</span>,
                                    className: "px-3 py-2.5",
                                },
                                {
                                    content: <Badge variant="secondary">{row.promise}</Badge>,
                                    className: "px-3 py-2.5",
                                },
                                {
                                    content: row.note,
                                    className:
                                        "px-3 py-2.5 whitespace-normal text-muted-foreground",
                                },
                            ],
                        }))}
                    />
                </StrategyCard>
            </div>

            <div className="mt-4">
                <StrategyCard
                    icon={Gauge}
                    title={capacitySection.title}
                    subtitle={capacitySection.subtitle}
                    accent="text-amber-600"
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        {capacitySection.rules.map((rule) => (
                            <div key={rule.title} className="rounded-lg border bg-muted/30 p-4">
                                <p className="mb-1 text-sm font-medium">{rule.title}</p>
                                <p className="text-sm text-muted-foreground">{rule.text}</p>
                            </div>
                        ))}
                    </div>
                </StrategyCard>
            </div>
        </div>
    );
}
