import { db } from "@/lib/db";
import { getCart, type CartItem } from "@/lib/cart";

export type HydratedCartItem = CartItem & {
    imageKey?: string;
    filamentName?: string;
    profileName?: string;
};

export async function getHydratedCart(): Promise<{
    items: HydratedCartItem[];
    subtotal: number;
}> {
    const items = await getCart();

    const productIds = items.map((i) => i.productId).filter((x): x is string => Boolean(x));
    const filamentIds = items.map((i) => i.filamentId).filter((x): x is string => Boolean(x));
    const profileIds = items.map((i) => i.profileId).filter((x): x is string => Boolean(x));

    const [products, filaments, profiles] = await Promise.all([
        db.product.findMany({
            where: { id: { in: productIds } },
            select: {
                id: true,
                images: { select: { key: true }, orderBy: { sortOrder: "asc" }, take: 1 },
            },
        }),
        db.filament.findMany({
            where: { id: { in: filamentIds } },
            select: { id: true, name: true },
        }),
        db.printerProfile.findMany({
            where: { id: { in: profileIds } },
            select: { id: true, name: true },
        }),
    ]);

    const imageByProduct = new Map(products.map((p) => [p.id, p.images[0]?.key]));
    const filamentById = new Map(filaments.map((f) => [f.id, f.name]));
    const profileById = new Map(profiles.map((p) => [p.id, p.name]));

    const hydrated: HydratedCartItem[] = items.map((item) => ({
        ...item,
        imageKey: item.productId ? imageByProduct.get(item.productId) : undefined,
        filamentName: item.filamentId ? filamentById.get(item.filamentId) : undefined,
        profileName: item.profileId ? profileById.get(item.profileId) : undefined,
    }));

    const subtotal = hydrated.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    return { items: hydrated, subtotal };
}
