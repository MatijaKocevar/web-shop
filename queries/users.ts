import { db } from "@/lib/db";

export async function listUsers() {
    const users = await db.user.findMany({
        include: {
            _count: { select: { orders: true, files: true } },
            orders: {
                orderBy: { createdAt: "desc" },
                take: 50,
                select: {
                    id: true,
                    status: true,
                    currency: true,
                    total: true,
                    createdAt: true,
                    _count: { select: { items: true } },
                },
            },
        },
        orderBy: { createdAt: "desc" },
        take: 200,
    });

    return users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        ordersCount: user._count.orders,
        orders: user.orders.map((order) => ({
            id: order.id,
            status: order.status,
            currency: order.currency,
            total: Number(order.total),
            createdAt: order.createdAt,
            itemsCount: order._count.items,
        })),
    }));
}

export async function getUserById(id: string) {
    return db.user.findUnique({
        where: { id },
        include: { _count: { select: { orders: true, files: true } } },
    });
}
