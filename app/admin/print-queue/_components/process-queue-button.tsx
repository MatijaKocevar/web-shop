"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { processQueue } from "../_actions/process-queue";

export function ProcessQueueButton({ hasQueued }: { hasQueued: boolean }) {
    const t = useTranslations("admin.printQueue");
    const [pending, setPending] = useState(false);
    const [result, setResult] = useState<{ sliced: number; failed: number } | null>(null);

    async function handleClick() {
        setPending(true);
        setResult(null);

        try {
            const res = await processQueue();

            setResult(res);
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="flex items-center gap-3">
            <Button onClick={handleClick} disabled={pending || !hasQueued}>
                {pending && <Loader2 className="size-4 animate-spin" />}
                {t("processQueue")}
            </Button>
            {result && (
                <span className="text-sm text-muted-foreground">
                    {t("slicedFailed", { sliced: result.sliced, failed: result.failed })}
                </span>
            )}
        </div>
    );
}
