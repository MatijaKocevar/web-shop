import { db } from "@/lib/db";

export async function getStoreStats() {
    const [products, orders, users] = await Promise.all([
        db.product.count(),
        db.order.count(),
        db.user.count(),
    ]);

    return { products, orders, users };
}
