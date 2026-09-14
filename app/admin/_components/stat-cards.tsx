import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
        <div className="grid grid-cols-2 gap-2 sm:gap-4 xl:grid-cols-4">
            {cards.map((card) => (
                <Card key={card.label} size="sm">
                    <CardHeader className="flex-row items-center justify-between space-y-0 pb-1">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {card.label}
                        </CardTitle>
                        <card.icon className={cn("size-4 shrink-0", card.accent)} />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold sm:text-3xl">{card.value}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
