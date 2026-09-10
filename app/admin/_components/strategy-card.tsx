import { cn } from "@/lib/utils";

type StrategyCardProps = {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle?: string;
    accent?: string;
    children: React.ReactNode;
};

export function StrategyCard({
    icon: Icon,
    title,
    subtitle,
    accent = "text-primary",
    children,
}: StrategyCardProps) {
    return (
        <section className="rounded-xl border bg-card p-5">
            <div className="mb-4 flex items-start gap-3">
                <div className={cn("rounded-lg border bg-muted/50 p-2", accent)}>
                    <Icon className="size-5" />
                </div>
                <div>
                    <h2 className="font-semibold">{title}</h2>
                    {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                </div>
            </div>
            {children}
        </section>
    );
}
