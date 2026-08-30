import { db } from "@/lib/db";

export async function getStoreStats() {
    const [products, orders, printJobs, users] = await Promise.all([
        db.product.count(),
        db.order.count(),
        db.printJob.count(),
        db.user.count(),
    ]);

    return { products, orders, printJobs, users };
}
