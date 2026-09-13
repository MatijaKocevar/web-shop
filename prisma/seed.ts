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
    const filamentMaterials = [
        { material: "PLA", density: 1.24, cost: 0.02 },
        { material: "PETG", density: 1.27, cost: 0.025 },
        { material: "ABS", density: 1.04, cost: 0.022 },
        { material: "TPU", density: 1.21, cost: 0.035 },
        { material: "ASA", density: 1.07, cost: 0.028 },
        { material: "PC", density: 1.2, cost: 0.04 },
        { material: "PA", density: 1.15, cost: 0.045 },
        { material: "PLA-CF", density: 1.3, cost: 0.038 },
        { material: "PETG-CF", density: 1.3, cost: 0.042 },
    ];

    const filamentColors = [
        "Black",
        "White",
        "Gray",
        "Red",
        "Orange",
        "Yellow",
        "Green",
        "Blue",
        "Purple",
        "Pink",
        "Brown",
        "Transparent",
        "Silk Gold",
        "Silk Silver",
        "Matte Black",
        "Black CF",
    ];

    const stockPattern = [0, 320, 640, 905, 1250, 2000, 3200, 4805];

    const filaments = filamentMaterials.flatMap(({ material, density, cost }, materialIndex) =>
        filamentColors.map((color, colorIndex) => ({
            id: `${material.toLowerCase()}-${color.toLowerCase().replace(/\s+/g, "-")}`,
            material,
            color,
            density,
            cost,
            stockGrams: stockPattern[(materialIndex + colorIndex) % stockPattern.length],
            lowStockThresholdGrams: (materialIndex + colorIndex) % 3 === 0 ? 1000 : 500,
        })),
    );

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
                stockGrams: f.stockGrams,
                lowStockThresholdGrams: f.lowStockThresholdGrams,
            },
        });
    }

    // --- Settings ---
    await db.setting.upsert({
        where: { key: "marginPct" },
        update: {},
        create: { key: "marginPct", value: "30" },
    });

    // --- Categories ---
    const categoryData = [
        { slug: "home", name: "Home" },
        { slug: "office", name: "Office" },
        { slug: "kitchen", name: "Kitchen" },
        { slug: "decor", name: "Decor" },
        { slug: "toys", name: "Toys & Games" },
        { slug: "tools", name: "Tools" },
        { slug: "garden", name: "Garden" },
        { slug: "gadgets", name: "Gadgets" },
    ];
    const categoryIds = new Map<string, string>();

    for (const category of categoryData) {
        const row = await db.category.upsert({
            where: { slug: category.slug },
            update: {},
            create: category,
        });

        categoryIds.set(category.slug, row.id);
    }

    // --- Tags ---
    const tagData = [
        "functional",
        "decorative",
        "gift",
        "organizer",
        "minimal",
        "desk",
        "wall-mount",
        "storage",
        "puzzle",
        "flexible",
        "articulated",
        "planter",
        "holder",
        "stand",
        "clip",
        "box",
        "vase",
        "lamp",
        "coaster",
        "gadget",
        "home",
    ];
    const tagIds = new Map<string, string>();

    for (const slug of tagData) {
        const row = await db.tag.upsert({
            where: { slug },
            update: {},
            create: { slug, name: slug.replace(/-/g, " ") },
        });

        tagIds.set(slug, row.id);
    }

    // --- Sample product ---
    const product = await db.product.upsert({
        where: { slug: "desk-organizer" },
        update: {},
        create: {
            name: "Desk Organizer",
            slug: "desk-organizer",
            description: "A modular desk organizer for pens, tools, and small parts.",
            type: "READY_MADE",
            price: 12.5,
            categoryId: categoryIds.get("home"),
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

    // --- More products ---
    const productTemplates: {
        name: string;
        category: string;
        price: number | null;
        grams: number;
        type?: ProductType;
    }[] = [
        { name: "Wall Hook Set", category: "home", price: 8.5, grams: 30 },
        { name: "Toothbrush Holder", category: "home", price: 7, grams: 25 },
        { name: "Soap Dish", category: "home", price: 6.5, grams: 20 },
        { name: "Key Holder", category: "home", price: 9, grams: 28 },
        { name: "Coat Hook", category: "home", price: 11, grams: 55 },
        { name: "Door Stopper", category: "home", price: 5.5, grams: 35 },
        { name: "Pen Cup", category: "office", price: 8, grams: 30 },
        { name: "Monitor Stand", category: "office", price: 24, grams: 120 },
        { name: "Cable Clip Set", category: "office", price: 6, grams: 18 },
        { name: "Phone Stand", category: "office", price: 9.5, grams: 35 },
        { name: "Document Tray", category: "office", price: 16, grams: 90 },
        { name: "Headphone Stand", category: "office", price: 18, grams: 85 },
        { name: "Webcam Cover", category: "office", price: 4.5, grams: 8 },
        { name: "USB Drive Holder", category: "office", price: 10, grams: 40 },
        { name: "Business Card Holder", category: "office", price: 7.5, grams: 26 },
        { name: "Bag Clip Set", category: "kitchen", price: 5.5, grams: 15 },
        { name: "Spice Rack", category: "kitchen", price: 19, grams: 110 },
        { name: "Chip Clip", category: "kitchen", price: 4, grams: 10 },
        { name: "Fruit Bowl", category: "kitchen", price: 22, grams: 140 },
        { name: "Coaster Set", category: "kitchen", price: 9, grams: 60 },
        { name: "Utensil Holder", category: "kitchen", price: 14, grams: 75 },
        { name: "Bottle Opener", category: "kitchen", price: 6.5, grams: 22 },
        { name: "Fridge Magnet Set", category: "kitchen", price: 7, grams: 24 },
        { name: "Spiral Vase", category: "decor", price: 17, grams: 95 },
        { name: "Geometric Planter", category: "decor", price: 15, grams: 80 },
        { name: "Picture Frame", category: "decor", price: 13, grams: 50 },
        { name: "Candle Holder", category: "decor", price: 11.5, grams: 45 },
        { name: "Wall Art Panel", category: "decor", price: 21, grams: 120 },
        { name: "Minimalist Clock", category: "decor", price: 25, grams: 105 },
        { name: "Bookend Pair", category: "decor", price: 19.5, grams: 150 },
        { name: "Abstract Sculpture", category: "decor", price: 28, grams: 180 },
        { name: "Puzzle Cube", category: "toys", price: 12, grams: 55 },
        { name: "Fidget Spinner", category: "toys", price: 7.5, grams: 25 },
        { name: "Articulated Dragon", category: "toys", price: 16.5, grams: 70 },
        { name: "Chess Set", category: "toys", price: 34, grams: 220 },
        { name: "Toy Car", category: "toys", price: 9, grams: 40 },
        { name: "Stacking Rings", category: "toys", price: 14.5, grams: 65 },
        { name: "Marble Run Piece", category: "toys", price: 8, grams: 32 },
        { name: "Drill Bit Holder", category: "tools", price: 13, grams: 60 },
        { name: "Wrench Organizer", category: "tools", price: 15.5, grams: 85 },
        { name: "Screw Sorter", category: "tools", price: 11, grams: 50 },
        { name: "Bit Driver Handle", category: "tools", price: 9.5, grams: 38 },
        { name: "Sanding Block", category: "tools", price: 6, grams: 30 },
        { name: "Clamp Set", category: "tools", price: 17, grams: 95 },
        { name: "Tool Box Divider", category: "tools", price: 12.5, grams: 70 },
        { name: "Seed Starter Tray", category: "garden", price: 12, grams: 65 },
        { name: "Plant Label Set", category: "garden", price: 6.5, grams: 20 },
        { name: "Trellis Clip", category: "garden", price: 7, grams: 22 },
        { name: "Herb Marker", category: "garden", price: 8.5, grams: 26 },
        { name: "Pot Feet", category: "garden", price: 9, grams: 45 },
        { name: "Bird Feeder", category: "garden", price: 18.5, grams: 130 },
        { name: "GoPro Mount", category: "gadgets", price: 10, grams: 35 },
        { name: "Raspberry Pi Case", category: "gadgets", price: 11.5, grams: 42 },
        { name: "Cable Winder", category: "gadgets", price: 5, grams: 14 },
        { name: "Smart Watch Stand", category: "gadgets", price: 12, grams: 48 },
        { name: "AirTag Holder", category: "gadgets", price: 6, grams: 12 },
        { name: "Battery Organizer", category: "gadgets", price: 14, grams: 72 },
        {
            name: "Custom Name Plate",
            category: "office",
            price: null,
            grams: 30,
            type: "CUSTOM_PRINT",
        },
        { name: "Custom Bracket", category: "tools", price: null, grams: 45, type: "CUSTOM_PRINT" },
        {
            name: "Custom Phone Case",
            category: "gadgets",
            price: null,
            grams: 25,
            type: "CUSTOM_PRINT",
        },
        { name: "Custom Vase", category: "decor", price: null, grams: 90, type: "CUSTOM_PRINT" },
        { name: "Custom Signage", category: "home", price: null, grams: 70, type: "CUSTOM_PRINT" },
        {
            name: "Custom Enclosure",
            category: "gadgets",
            price: null,
            grams: 80,
            type: "CUSTOM_PRINT",
        },
    ];

    const categoryTags: Record<string, string[]> = {
        home: ["functional", "storage", "holder"],
        office: ["desk", "organizer", "functional"],
        kitchen: ["functional", "holder", "coaster"],
        decor: ["decorative", "gift", "vase"],
        toys: ["puzzle", "gift", "flexible"],
        tools: ["functional", "storage", "holder"],
        garden: ["planter", "decorative", "functional"],
        gadgets: ["gadget", "desk", "holder"],
    };

    const variantOptions = [
        { filamentId: "pla-black", label: "PLA · Black" },
        { filamentId: "pla-white", label: "PLA · White" },
        { filamentId: "pla-red", label: "PLA · Red" },
        { filamentId: "pla-blue", label: "PLA · Blue" },
        { filamentId: "petg-black", label: "PETG · Black" },
        { filamentId: "petg-blue", label: "PETG · Blue" },
    ];

    const slugify = (value: string) =>
        value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

    for (const [index, template] of productTemplates.entries()) {
        const slug = slugify(template.name);
        const type = template.type ?? "READY_MADE";
        const tagSlugs = [...new Set(categoryTags[template.category] ?? [])];

        const row = await db.product.upsert({
            where: { slug },
            update: {},
            create: {
                name: template.name,
                slug,
                description: `${template.name} — precision 3D printed on demand in our workshop.`,
                type,
                price: template.price,
                categoryId: categoryIds.get(template.category),
                tags: { connect: tagSlugs.map((tag) => ({ id: tagIds.get(tag)! })) },
            },
        });

        if (type !== "READY_MADE") continue;

        const variantCount = 1 + (index % 3);

        for (let v = 0; v < variantCount; v++) {
            const option = variantOptions[(index + v) % variantOptions.length];
            const variantPrice =
                template.price != null
                    ? template.price + (option.filamentId.startsWith("petg") ? 2 : 0)
                    : null;

            await db.productVariant.upsert({
                where: { productId_name: { productId: row.id, name: option.label } },
                update: { price: variantPrice },
                create: {
                    name: option.label,
                    sku: `${slug}-${option.filamentId}`.toUpperCase(),
                    stock: (index * 3 + v * 5) % 15,
                    grams: template.grams,
                    price: variantPrice,
                    filamentId: option.filamentId,
                    productId: row.id,
                },
            });
        }
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
