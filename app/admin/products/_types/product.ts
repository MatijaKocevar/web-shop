export type Product = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number | null;
    type: string;
    active: boolean;
    categoryId: string | null;
};
