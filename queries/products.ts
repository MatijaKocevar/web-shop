import { db } from "@/lib/db";
import type { ProductCard } from "@/queries/products.types";

export async function listProducts(params?: {
    category?: string;
    tag?: string;
    query?: string;
}): Promise<ProductCard[]> {
    const where: Record<string, unknown> = { active: true };

    if (params?.category) {
        where.category = { slug: params.category };
    }
    if (params?.tag) {
        where.tags = { some: { slug: params.tag } };
    }
    if (params?.query) {
        where.OR = [
            { name: { contains: params.query, mode: "insensitive" } },
            { description: { contains: params.query, mode: "insensitive" } },
        ];
    }

    const products = await db.product.findMany({
        where,
        select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            currency: true,
            type: true,
            category: { select: { name: true } },
            images: { select: { key: true, alt: true }, orderBy: { sortOrder: "asc" } },
        },
        orderBy: { createdAt: "desc" },
    });

    return products.map((p) => ({
        ...p,
        price: p.price ? Number(p.price) : null,
    }));
}

export async function getProductById(id: string) {
    const product = await db.product.findUnique({
        where: { id },
        include: {
            category: true,
            images: { orderBy: { sortOrder: "asc" } },
            modelFile: true,
        },
    });

    if (!product) return null;

    return {
        ...product,
        price: product.price ? Number(product.price) : null,
    };
}

export async function getProductBySlug(slug: string) {
    const product = await db.product.findUnique({
        where: { slug },
        include: {
            category: true,
            tags: true,
            images: { orderBy: { sortOrder: "asc" } },
            modelFile: true,
            variants: {
                include: { filament: true },
                orderBy: { name: "asc" },
            },
        },
    });

    if (!product) return null;

    return {
        ...product,
        price: product.price ? Number(product.price) : null,
        variants: product.variants.map((v) => ({
            ...v,
            priceDelta: v.priceDelta ? Number(v.priceDelta) : null,
            filament: v.filament
                ? {
                      ...v.filament,
                      density: Number(v.filament.density),
                      costPerGram: Number(v.filament.costPerGram),
                  }
                : null,
        })),
    };
}
