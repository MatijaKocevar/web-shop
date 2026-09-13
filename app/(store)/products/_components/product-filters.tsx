"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const selectClass =
    "rounded-md border bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

const PRICE_OPTIONS = ["under10", "from10to25", "from25to50", "over50"] as const;

type ProductFiltersProps = {
    categories: { slug: string; name: string }[];
    category: string;
    type: string;
    price: string;
    sort: string;
    q: string;
};

export function ProductFilters({
    categories,
    category,
    type,
    price,
    sort,
    q,
}: ProductFiltersProps) {
    const router = useRouter();
    const t = useTranslations("products");
    const tType = useTranslations("productType");
    const [search, setSearch] = useState(q);
    const [prevQ, setPrevQ] = useState(q);

    if (prevQ !== q) {
        setPrevQ(q);
        setSearch(q);
    }

    const active = Boolean(q || category || type || price || sort);

    function apply(params: Record<string, string>) {
        const next = new URLSearchParams();

        for (const [key, value] of Object.entries(params)) {
            if (value) next.set(key, value);
        }

        const href = next.size > 0 ? `/products?${next.toString()}` : "/products";

        router.replace(href, { scroll: false });
    }

    function update(key: string, value: string) {
        apply({ q, category, type, price, sort, [key]: value });
    }

    function submitSearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        update("q", search.trim());
    }

    function clear() {
        setSearch("");
        apply({});
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            <form onSubmit={submitSearch} className="relative min-w-0 sm:w-64">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    className="w-full pl-8"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={t("search")}
                    aria-label={t("search")}
                />
            </form>

            {categories.length > 0 && (
                <select
                    className={selectClass}
                    value={category}
                    onChange={(event) => update("category", event.target.value)}
                    aria-label={t("category")}
                >
                    <option value="">{t("allCategories")}</option>
                    {categories.map((item) => (
                        <option key={item.slug} value={item.slug}>
                            {item.name}
                        </option>
                    ))}
                </select>
            )}

            <select
                className={selectClass}
                value={type}
                onChange={(event) => update("type", event.target.value)}
                aria-label={t("type")}
            >
                <option value="">{t("allTypes")}</option>
                <option value="READY_MADE">{tType("READY_MADE")}</option>
                <option value="CUSTOM_PRINT">{tType("CUSTOM_PRINT")}</option>
            </select>

            <select
                className={selectClass}
                value={price}
                onChange={(event) => update("price", event.target.value)}
                aria-label={t("price")}
            >
                <option value="">{t("allPrices")}</option>
                {PRICE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                        {t(option)}
                    </option>
                ))}
            </select>

            <div className="ml-auto flex items-center gap-2">
                <select
                    className={selectClass}
                    value={sort}
                    onChange={(event) => update("sort", event.target.value)}
                    aria-label={t("sort")}
                >
                    <option value="">{t("sortNewest")}</option>
                    <option value="priceAsc">{t("priceLowHigh")}</option>
                    <option value="priceDesc">{t("priceHighLow")}</option>
                    <option value="name">{t("nameAsc")}</option>
                </select>

                {active && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={clear}
                        aria-label={t("clearFilters")}
                    >
                        <X className="size-4" />
                        <span className="hidden sm:inline">{t("clearFilters")}</span>
                    </Button>
                )}
            </div>
        </div>
    );
}
