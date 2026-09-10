import type { OrderStatus } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import type { ProductionStats } from "@/queries/production.types";

const OPEN_STATUSES: OrderStatus[] = ["PAID", "PROCESSING", "PRINTING"];

export async function getProductionStats(): Promise<ProductionStats> {
    const [openOrders, printing, filaments] = await Promise.all([
        db.order.count({ where: { status: { in: OPEN_STATUSES } } }),
        db.order.count({ where: { status: "PRINTING" } }),
        db.filament.findMany({ where: { active: true } }),
    ]);

    const lowStock = filaments.filter((f) => f.stockGrams < f.lowStockThresholdGrams);

    return {
        openOrders,
        printing,
        totalGrams: filaments.reduce((sum, f) => sum + f.stockGrams, 0),
        lowStockCount: lowStock.length,
    };
}
