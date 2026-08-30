"use server";

import { revalidatePath } from "next/cache";

import { processPrintJobs } from "@/workers/print-jobs";

export async function processQueue() {
    const result = await processPrintJobs();

    revalidatePath("/admin/print-queue");

    return result;
}
