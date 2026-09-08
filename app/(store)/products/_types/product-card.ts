export type ProductCardProduct = {
    id: string;
    name: string;
    slug: string;
    price: number | null;
    currency: string;
    type: string;
    category: { name: string } | null;
    images: { key: string; alt: string | null }[];
};
