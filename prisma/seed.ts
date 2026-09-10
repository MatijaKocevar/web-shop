import "dotenv/config";
import type { OrderStatus, ProductType } from "../generated/prisma/enums";
import { db } from "../lib/db";
import { hashPassword } from "../lib/password";

async function main() {
    const adminPassword = process.env.AUTH_ADMIN_PASSWORD || "admin123";

    await db.user.upsert({
        where: { email: "admin@test.com" },
        update: { role: "ADMIN", passwordHash: await hashPassword(adminPassword) },
        create: {
            email: "admin@test.com",
            name: "Admin Test",
            role: "ADMIN",
            passwordHash: await hashPassword(adminPassword),
        },
    });

    const customer = await db.user.upsert({
        where: { email: "customer@test.com" },
        update: { role: "CUSTOMER" },
        create: { email: "customer@test.com", name: "Customer Test", role: "CUSTOMER" },
    });

    // --- Printer: Creality K1C ---
    const printer = await db.printer.upsert({
        where: { id: "k1c" },
        update: {},
        create: {
            id: "k1c",
            name: "Creality K1C",
            make: "Creality",
            buildX: 220,
            buildY: 220,
            buildZ: 250,
        },
    });

    // --- Profiles ---
    const profiles = [
        {
            id: "k1c-standard",
            name: "K1C · 0.20mm · Standard",
            nozzle: 0.4,
            layerHeight: 0.2,
            infill: 15,
            speed: 200,
            machineHourRate: 5,
            setupFee: 1,
        },
        {
            id: "k1c-fine",
            name: "K1C · 0.12mm · Fine",
            nozzle: 0.4,
            layerHeight: 0.12,
            infill: 15,
            speed: 150,
            machineHourRate: 6,
            setupFee: 1,
        },
        {
            id: "k1c-draft",
            name: "K1C · 0.28mm · Draft",
            nozzle: 0.4,
            layerHeight: 0.28,
            infill: 10,
            speed: 250,
            machineHourRate: 4,
            setupFee: 0.5,
        },
    ];

    for (const profile of profiles) {
        await db.printerProfile.upsert({
            where: { id: profile.id },
            update: {},
            create: {
                id: profile.id,
                name: profile.name,
                nozzle: profile.nozzle,
                layerHeight: profile.layerHeight,
                infill: profile.infill,
                speed: profile.speed,
                supports: false,
                machineHourRate: profile.machineHourRate,
                setupFee: profile.setupFee,
                printerId: printer.id,
            },
        });
    }

    // --- Filaments ---
    const filaments = [
        { id: "pla-black", material: "PLA", color: "Black", density: 1.24, cost: 0.02 },
        { id: "pla-white", material: "PLA", color: "White", density: 1.24, cost: 0.02 },
        { id: "pla-gray", material: "PLA", color: "Gray", density: 1.24, cost: 0.02 },
        { id: "petg-black", material: "PETG", color: "Black", density: 1.27, cost: 0.025 },
        { id: "petg-white", material: "PETG", color: "White", density: 1.27, cost: 0.025 },
    ];

    for (const f of filaments) {
        await db.filament.upsert({
            where: { id: f.id },
            update: {},
            create: {
                id: f.id,
                name: `${f.material} ${f.color}`,
                material: f.material,
                color: f.color,
                density: f.density,
                costPerGram: f.cost,
            },
        });
    }

    // --- Settings ---
    await db.setting.upsert({
        where: { key: "marginPct" },
        update: {},
        create: { key: "marginPct", value: "30" },
    });

    // --- Sample category + product ---
    const category = await db.category.upsert({
        where: { slug: "home" },
        update: {},
        create: { name: "Home", slug: "home" },
    });

    const product = await db.product.upsert({
        where: { slug: "desk-organizer" },
        update: {},
        create: {
            name: "Desk Organizer",
            slug: "desk-organizer",
            description: "A modular desk organizer for pens, tools, and small parts.",
            type: "READY_MADE",
            price: 12.5,
            categoryId: category.id,
        },
    });

    // --- Variants ---
    const variants = [
        { id: "desk-org-pla-black", filamentId: "pla-black", grams: 42, stock: 6 },
        { id: "desk-org-pla-white", filamentId: "pla-white", grams: 42, stock: 3 },
        { id: "desk-org-petg-black", filamentId: "petg-black", grams: 45, stock: 0 },
    ];

    for (const variant of variants) {
        await db.productVariant.upsert({
            where: { id: variant.id },
            update: {},
            create: {
                id: variant.id,
                name: `${product.name} · ${variant.filamentId.toUpperCase()}`,
                stock: variant.stock,
                grams: variant.grams,
                filamentId: variant.filamentId,
                productId: product.id,
            },
        });
    }

    // --- Sample orders ---
    type SeedOrderItem = {
        name: string;
        type: ProductType;
        quantity: number;
        unitPrice: number;
        productId?: string;
        filamentId?: string;
        profileId?: string;
    };

    type SeedOrder = {
        id: string;
        status: OrderStatus;
        subtotal: number;
        shipping: number;
        total: number;
        createdAt: Date;
        paid: boolean;
        items: SeedOrderItem[];
    };

    const daysAgo = (days: number, hours = 0) =>
        new Date(Date.now() - days * 86400000 - hours * 3600000);

    const seedOrders: SeedOrder[] = [
        {
            id: "seed-order-1",
            status: "DELIVERED",
            subtotal: 25,
            shipping: 3.5,
            total: 28.5,
            createdAt: daysAgo(14),
            paid: true,
            items: [
                {
                    name: "Desk Organizer",
                    type: "READY_MADE",
                    quantity: 2,
                    unitPrice: 12.5,
                    productId: product.id,
                },
            ],
        },
        {
            id: "seed-order-2",
            status: "DELIVERED",
            subtotal: 18.2,
            shipping: 3.5,
            total: 21.7,
            createdAt: daysAgo(10),
            paid: true,
            items: [
                {
                    name: "Spiral vase (custom)",
                    type: "CUSTOM_PRINT",
                    quantity: 1,
                    unitPrice: 18.2,
                    filamentId: "pla-white",
                    profileId: "k1c-standard",
                },
            ],
        },
        {
            id: "seed-order-3",
            status: "SHIPPED",
            subtotal: 37.4,
            shipping: 3.5,
            total: 40.9,
            createdAt: daysAgo(5),
            paid: true,
            items: [
                {
                    name: "Desk Organizer",
                    type: "READY_MADE",
                    quantity: 1,
                    unitPrice: 12.5,
                    productId: product.id,
                },
                {
                    name: "Cable clip set (custom)",
                    type: "CUSTOM_PRINT",
                    quantity: 3,
                    unitPrice: 8.3,
                    filamentId: "pla-gray",
                    profileId: "k1c-draft",
                },
            ],
        },
        {
            id: "seed-order-4",
            status: "PRINTING",
            subtotal: 14.6,
            shipping: 3.5,
            total: 18.1,
            createdAt: daysAgo(1, 6),
            paid: true,
            items: [
                {
                    name: "Bracket replacement (custom)",
                    type: "CUSTOM_PRINT",
                    quantity: 2,
                    unitPrice: 7.3,
                    filamentId: "petg-black",
                    profileId: "k1c-standard",
                },
            ],
        },
        {
            id: "seed-order-5",
            status: "PROCESSING",
            subtotal: 9.9,
            shipping: 3.5,
            total: 13.4,
            createdAt: daysAgo(0, 5),
            paid: true,
            items: [
                {
                    name: "Name plate (custom)",
                    type: "CUSTOM_PRINT",
                    quantity: 1,
                    unitPrice: 9.9,
                    filamentId: "pla-black",
                    profileId: "k1c-fine",
                },
            ],
        },
        {
            id: "seed-order-6",
            status: "PAID",
            subtotal: 12.5,
            shipping: 3.5,
            total: 16,
            createdAt: daysAgo(2),
            paid: true,
            items: [
                {
                    name: "Desk Organizer",
                    type: "READY_MADE",
                    quantity: 1,
                    unitPrice: 12.5,
                    productId: product.id,
                },
            ],
        },
        {
            id: "seed-order-7",
            status: "PENDING",
            subtotal: 25.2,
            shipping: 3.5,
            total: 28.7,
            createdAt: daysAgo(0, 1),
            paid: false,
            items: [
                {
                    name: "Phone stand (custom)",
                    type: "CUSTOM_PRINT",
                    quantity: 2,
                    unitPrice: 12.6,
                    filamentId: "pla-white",
                    profileId: "k1c-standard",
                },
            ],
        },
    ];

    for (const order of seedOrders) {
        await db.order.upsert({
            where: { id: order.id },
            update: {},
            create: {
                id: order.id,
                email: customer.email!,
                status: order.status,
                subtotal: order.subtotal,
                shipping: order.shipping,
                total: order.total,
                createdAt: order.createdAt,
                userId: customer.id,
                items: { create: order.items },
                ...(order.paid
                    ? {
                          payments: {
                              create: {
                                  stripeId: `seed-${order.id}`,
                                  amount: order.total,
                                  status: "succeeded",
                                  createdAt: order.createdAt,
                              },
                          },
                      }
                    : {}),
            },
        });
    }

    console.log("Seed complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
