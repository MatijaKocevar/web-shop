import { db } from "@/lib/db";

export async function listPrintJobs() {
    const jobs = await db.printJob.findMany({
        include: {
            orderItem: { select: { name: true, order: { select: { email: true } } } },
            profile: { select: { name: true } },
        },
        orderBy: { createdAt: "asc" },
        take: 100,
    });

    return jobs;
}
