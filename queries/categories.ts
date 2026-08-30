import { db } from "@/lib/db";

export async function listCategories() {
    return db.category.findMany({ orderBy: { name: "asc" } });
}
