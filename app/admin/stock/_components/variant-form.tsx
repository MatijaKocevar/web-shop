import Link from "next/link";
import { Trash2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button, buttonVariants } from "@/components/ui/button";
import { deleteVariant } from "../_actions/delete-variant";
import { saveVariant } from "../_actions/save-variant";
import type { Variant, VariantFormFilament } from "../_types/variant";

const inputClass =
    "rounded-md border bg-background px-3 py-2 text-sm w-full focus-visible:ring-2 focus-visible:ring-ring/50 outline-none";

type VariantFormProps = {
    variant?: Variant;
    productId?: string;
    filaments: VariantFormFilament[];
};

export async function VariantForm({ variant, productId, filaments }: VariantFormProps) {
    const t = await getTranslations("admin.stock");
    const tCommon = await getTranslations("admin.common");

    return (
        <form action={saveVariant} className="flex flex-col gap-4">
            {variant && <input type="hidden" name="id" value={variant.id} />}
            <input type="hidden" name="productId" value={variant?.productId ?? productId ?? ""} />

            <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium">{t("filament")}</span>
                <select
                    className={inputClass}
                    name="filamentId"
                    defaultValue={variant?.filamentId ?? ""}
                    required
                >
                    <option value="">{tCommon("none")}</option>
                    {filaments.map((f) => (
                        <option key={f.id} value={f.id}>
                            {f.name}
                        </option>
                    ))}
                </select>
            </label>

            <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">{t("gramsPerUnit")}</span>
                    <input
                        className={inputClass}
                        name="grams"
                        type="number"
                        step="1"
                        min="0"
                        defaultValue={variant?.grams ?? ""}
                    />
                </label>

                <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium">{t("priceDelta")}</span>
                    <input
                        className={inputClass}
                        name="priceDelta"
                        type="number"
                        step="0.01"
                        defaultValue={variant?.priceDelta ?? ""}
                    />
                </label>
            </div>

            <div className="flex items-center justify-between gap-2">
                {variant ? (
                    <Button
                        type="submit"
                        variant="destructive"
                        size="sm"
                        formAction={deleteVariant}
                    >
                        <Trash2 className="size-4" />
                        {t("deleteVariant")}
                    </Button>
                ) : (
                    <span />
                )}
                <div className="flex items-center gap-2">
                    <Link href="/admin/stock" className={buttonVariants({ variant: "ghost" })}>
                        {tCommon("cancel")}
                    </Link>
                    <Button type="submit">{tCommon("save")}</Button>
                </div>
            </div>
        </form>
    );
}
