import { db } from "@/lib/db";
import type { ProductCard, ProductListParams } from "@/queries/products.types";

const PRICE_RANGES: Record<string, { min?: number; max?: number }> = {
    under10: { max: 10 },
    from10to25: { min: 10, max: 25 },
    from25to50: { min: 25, max: 50 },
    over50: { min: 50 },
};

export async function listProducts(params?: ProductListParams): Promise<ProductCard[]> {
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
    if (params?.type) {
        where.type = params.type;
    }
    const range = params?.price ? PRICE_RANGES[params.price] : undefined;
    if (range) {
        where.price = {
            ...(range.min != null ? { gte: range.min } : {}),
            ...(range.max != null ? { lt: range.max } : {}),
        };
    }

    const orderBy =
        params?.sort === "priceAsc"
            ? [{ price: "asc" as const }]
            : params?.sort === "priceDesc"
              ? [{ price: "desc" as const }]
              : params?.sort === "name"
                ? [{ name: "asc" as const }]
                : [{ createdAt: "desc" as const }];

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
        orderBy,
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
            price: v.price ? Number(v.price) : null,
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

export async function listProductsWithVariants() {
    const products = await db.product.findMany({
        include: {
            category: { select: { name: true } },
            variants: {
                include: { filament: true },
                orderBy: { createdAt: "asc" },
            },
        },
        orderBy: { name: "asc" },
    });

    return products.map((product) => ({
        id: product.id,
        name: product.name,
        type: product.type,
        price: product.price ? Number(product.price) : null,
        category: product.category,
        variants: product.variants.map((variant) => ({
            id: variant.id,
            name: variant.name,
            price: variant.price ? Number(variant.price) : null,
            stock: variant.stock,
            grams: variant.grams,
            filament: variant.filament
                ? {
                      id: variant.filament.id,
                      name: variant.filament.name,
                      color: variant.filament.color,
                      colorHex: variant.filament.colorHex,
                      stockGrams: variant.filament.stockGrams,
                  }
                : null,
        })),
    }));
}

export async function getVariantById(id: string) {
    const variant = await db.productVariant.findUnique({
        where: { id },
        include: { filament: true },
    });

    if (!variant) return null;

    return {
        id: variant.id,
        name: variant.name,
        productId: variant.productId,
        filamentId: variant.filamentId,
        grams: variant.grams,
        price: variant.price ? Number(variant.price) : null,
    };
}
