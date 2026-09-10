"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { OrderStatus } from "@/generated/prisma/client";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

const VALID_STATUSES: OrderStatus[] = ["PROCESSING", "PRINTING", "SHIPPED", "DELIVERED"];

export async function recordPrint(formData: FormData) {
    const orderId = formData.get("orderId") as string;
    const rawStatus = formData.get("status") as string;
    const note = (formData.get("note") as string)?.trim() || null;

    if (!orderId) redirect("/admin/orders");

    const items = await db.orderItem.findMany({
        where: { orderId },
        include: { filament: true },
    });

    const filaments = await db.filament.findMany({
        where: { id: { in: items.map((i) => i.filamentId).filter((id): id is string => !!id) } },
    });

    const stockByFilamentId = new Map(filaments.map((f) => [f.id, f.stockGrams]));
    const operations: Prisma.PrismaPromise<unknown>[] = [];

    for (const item of items) {
        const grams = Number(formData.get(`grams-${item.id}`));

        if (!item.filamentId || !Number.isFinite(grams) || grams <= 0) continue;

        const current = stockByFilamentId.get(item.filamentId) ?? 0;
        const next = Math.max(0, current - Math.round(grams));
        const delta = next - current;

        stockByFilamentId.set(item.filamentId, next);

        operations.push(
            db.filament.update({
                where: { id: item.filamentId },
                data: { stockGrams: next },
            }),
        );

        if (delta === 0) continue;

        operations.push(
            db.filamentStockLog.create({
                data: {
                    filamentId: item.filamentId,
                    orderItemId: item.id,
                    deltaGrams: delta,
                    reason: "ORDER",
                    note,
                },
            }),
        );
    }

    const status = VALID_STATUSES.includes(rawStatus as OrderStatus)
        ? (rawStatus as OrderStatus)
        : undefined;

    if (status) {
        operations.push(
            db.order.update({
                where: { id: orderId },
                data: { status },
            }),
        );
    }

    if (operations.length > 0) {
        await db.$transaction(operations);
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/filaments");
    revalidatePath("/admin");
    redirect(`/admin/orders?id=${orderId}`);
}
