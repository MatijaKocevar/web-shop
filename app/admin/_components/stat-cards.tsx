import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatCardItem = {
    label: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    accent: string;
};

type StatCardsProps = {
    cards: StatCardItem[];
};

export function StatCards({ cards }: StatCardsProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <Card key={card.label}>
                    <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {card.label}
                        </CardTitle>
                        <card.icon className={card.accent} />
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold">{card.value}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
