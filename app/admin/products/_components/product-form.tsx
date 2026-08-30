import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { saveProduct } from "../_actions/save-product";

const inputClass =
    "rounded-md border bg-background px-3 py-2 text-sm w-full focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

type Category = { id: string; name: string };
type Product = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number | null;
    type: string;
    active: boolean;
    categoryId: string | null;
};

export function ProductForm({
    product,
    categories,
}: {
    product?: Product;
    categories: Category[];
}) {
    return (
        <form action={saveProduct} className="flex max-w-xl flex-col gap-4">
            {product && <input type="hidden" name="id" value={product.id} />}

            <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium">Name</span>
                <input
                    className={inputClass}
                    name="name"
                    defaultValue={product?.name ?? ""}
                    required
                />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium">Slug</span>
                <input
                    className={inputClass}
                    name="slug"
                    defaultValue={product?.slug ?? ""}
                    placeholder="auto-generated from name"
                />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium">Description</span>
                <textarea
                    className={inputClass}
                    name="description"
                    rows={4}
                    defaultValue={product?.description ?? ""}
                />
            </label>

            <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">Price (EUR)</span>
                    <input
                        className={inputClass}
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={product?.price ?? ""}
                    />
                </label>

                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">Type</span>
                    <select
                        className={inputClass}
                        name="type"
                        defaultValue={product?.type ?? "READY_MADE"}
                    >
                        <option value="READY_MADE">Ready made</option>
                        <option value="CUSTOM_PRINT">Custom print</option>
                    </select>
                </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">Category</span>
                    <select
                        className={inputClass}
                        name="categoryId"
                        defaultValue={product?.categoryId ?? ""}
                    >
                        <option value="">None</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">New category</span>
                    <input
                        className={inputClass}
                        name="newCategory"
                        placeholder="create a new category"
                    />
                </label>
            </div>

            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="active" defaultChecked={product?.active ?? true} />
                <span>Active</span>
            </label>

            <div className="flex items-center gap-2">
                <Button type="submit">{product ? "Save" : "Create product"}</Button>
                <Link href="/admin/products" className={buttonVariants({ variant: "ghost" })}>
                    Cancel
                </Link>
            </div>
        </form>
    );
}
