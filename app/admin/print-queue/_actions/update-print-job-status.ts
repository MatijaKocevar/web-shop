"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { PrintJobStatus } from "@/generated/prisma/enums";

const STATUSES: PrintJobStatus[] = ["QUEUED", "SLICING", "SLICED", "PRINTING", "DONE", "FAILED"];

export async function updatePrintJobStatus(formData: FormData) {
    const id = formData.get("id") as string;
    const status = formData.get("status") as string;

    if (id && STATUSES.includes(status as PrintJobStatus)) {
        const data: Record<string, unknown> = { status: status as PrintJobStatus };
        if (status === "PRINTING") data.startedAt = new Date();
        if (status === "DONE") data.finishedAt = new Date();
        await db.printJob.update({ where: { id }, data });
    }

    revalidatePath("/admin/print-queue");
}
