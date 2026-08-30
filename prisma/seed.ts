import "dotenv/config";

import { db } from "../lib/db";

async function main() {
    // --- Test users (for the dev credentials login) ---
    const testUsers = [
        { email: "admin@test.com", name: "Admin Test", role: "ADMIN" as const },
        { email: "customer@test.com", name: "Customer Test", role: "CUSTOMER" as const },
    ];
    for (const u of testUsers) {
        await db.user.upsert({
            where: { email: u.email },
            update: { role: u.role },
            create: { email: u.email, name: u.name, role: u.role },
        });
    }

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

    await db.product.upsert({
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
