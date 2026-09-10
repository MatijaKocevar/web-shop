import type Stripe from "stripe";
import { db } from "@/lib/db";
import { round2 } from "@/lib/pricing";
import type { CheckoutItem } from "@/queries/orders.types";

export async function listOrders() {
    const orders = await db.order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
        take: 100,
    });

    return orders.map((o) => ({
        ...o,
        subtotal: Number(o.subtotal),
        shipping: Number(o.shipping),
        total: Number(o.total),
        items: o.items.map((i) => ({ ...i, unitPrice: Number(i.unitPrice) })),
    }));
}

export async function getOrderById(id: string) {
    const order = await db.order.findUnique({
        where: { id },
        include: {
            items: { include: { file: true } },
            payments: true,
        },
    });

    if (!order) return null;

    return {
        ...order,
        subtotal: Number(order.subtotal),
        shipping: Number(order.shipping),
        total: Number(order.total),
        items: order.items.map((i) => ({ ...i, unitPrice: Number(i.unitPrice) })),
        payments: order.payments.map((p) => ({ ...p, amount: Number(p.amount) })),
    };
}

export async function listOrdersForUser(userId: string) {
    const orders = await db.order.findMany({
        where: { userId },
        include: { items: true },
        orderBy: { createdAt: "desc" },
    });

    return orders.map((o) => ({
        ...o,
        subtotal: Number(o.subtotal),
        shipping: Number(o.shipping),
        total: Number(o.total),
        items: o.items.map((i) => ({ ...i, unitPrice: Number(i.unitPrice) })),
    }));
}

export async function createOrderFromCheckout(session: Stripe.Checkout.Session) {
    const rawItems = session.metadata?.items;
    if (!rawItems) return null;

    let items: CheckoutItem[];
    try {
        items = JSON.parse(rawItems);
    } catch {
        return null;
    }

    const email =
        session.customer_details?.email ?? session.customer_email ?? "unknown@example.com";
    const total = round2((session.amount_total ?? 0) / 100);

    const user = email ? await db.user.findUnique({ where: { email } }) : null;

    const order = await db.order.create({
        data: {
            email,
            status: "PAID",
            currency: (session.currency ?? "eur").toUpperCase(),
            subtotal: total,
            shipping: 0,
            total,
            stripeSessionId: session.id,
            userId: user?.id,
            items: {
                create: items.map((item) => ({
                    name: item.name,
                    type: item.type === "CUSTOM_PRINT" ? "CUSTOM_PRINT" : "READY_MADE",
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    productId: item.productId,
                    variantId: item.variantId,
                    fileId: item.fileId,
                    profileId: item.profileId,
                    filamentId: item.filamentId,
                })),
            },
        },
    });

    const paymentIntent =
        typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id;

    if (paymentIntent) {
        await db.payment.create({
            data: {
                orderId: order.id,
                stripeId: paymentIntent,
                amount: total,
                status: session.payment_status ?? "paid",
            },
        });
    }

    return order;
}
