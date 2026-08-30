"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function saveProduct(formData: FormData) {
    const id = (formData.get("id") as string) || null;
    const name = (formData.get("name") as string) ?? "";
    const slug = (formData.get("slug") as string) || slugify(name);
    const description = (formData.get("description") as string) || null;
    const priceRaw = formData.get("price") as string;
    const price = priceRaw ? Number(priceRaw) : null;
    const type = (formData.get("type") as string) || "READY_MADE";
    const active = formData.get("active") === "on";
    const categoryId = (formData.get("categoryId") as string) || null;
    const newCategory = (formData.get("newCategory") as string) || null;

    let resolvedCategoryId = categoryId;
    if (newCategory && !resolvedCategoryId) {
        const category = await db.category.create({
            data: { name: newCategory, slug: slugify(newCategory) },
        });
        resolvedCategoryId = category.id;
    }

    const data = {
        name,
        slug,
        description,
        price,
        type: type as "READY_MADE" | "CUSTOM_PRINT",
        active,
        categoryId: resolvedCategoryId,
    };

    if (id) {
        await db.product.update({ where: { id }, data });
    } else {
        await db.product.create({ data });
    }

    revalidatePath("/admin/products");
    redirect("/admin/products");
}
