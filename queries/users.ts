import { db } from "@/lib/db";

export async function listUsers() {
    return db.user.findMany({
        include: { _count: { select: { orders: true, files: true } } },
        orderBy: { createdAt: "desc" },
        take: 200,
    });
}

export async function getUserById(id: string) {
    return db.user.findUnique({
        where: { id },
        include: { _count: { select: { orders: true, files: true } } },
    });
}
