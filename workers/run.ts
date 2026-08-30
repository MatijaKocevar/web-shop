import "dotenv/config";

import { db } from "@/lib/db";
import { processPrintJobs } from "./print-jobs";

processPrintJobs()
    .then((result) => {
        console.log("Print queue processed:", result);
    })
    .catch((err) => {
        console.error("Failed to process print queue:", err);
        process.exitCode = 1;
    })
    .finally(async () => {
        await db.$disconnect();
    });
