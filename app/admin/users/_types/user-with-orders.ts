import type { OrderStatus, Role } from "@/generated/prisma/enums";

export type UserOrder = {
    id: string;
    status: OrderStatus;
    currency: string;
    total: number;
    createdAt: Date;
    itemsCount: number;
};

export type UserWithOrders = {
    id: string;
    name: string | null;
    email: string | null;
    role: Role;
    createdAt: Date;
    ordersCount: number;
    orders: UserOrder[];
};
