import "dotenv/config";

import { db } from "@/lib/db";

const email = process.argv[2];

if (!email) {
    console.error("Usage: pnpm db:admin <email>");
    process.exit(1);
}

async function main() {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
        console.error(`No user found with email ${email}. Sign in first.`);
        process.exit(1);
    }

    await db.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
    console.log(`Promoted ${email} to ADMIN.`);
}

main()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
