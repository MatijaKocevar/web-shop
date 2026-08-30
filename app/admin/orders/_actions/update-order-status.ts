"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import type { OrderStatus } from "@/generated/prisma/enums";

const STATUSES: OrderStatus[] = [
    "PENDING",
    "PAID",
    "PROCESSING",
    "PRINTING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
];

export async function updateOrderStatus(formData: FormData) {
    const id = formData.get("id") as string;
    const status = formData.get("status") as string;

    if (id && STATUSES.includes(status as OrderStatus)) {
        await db.order.update({
            where: { id },
            data: { status: status as OrderStatus },
        });
    }

    revalidatePath(`/admin/orders/${id}`);
}
