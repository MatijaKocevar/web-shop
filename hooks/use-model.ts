import { useEffect, useState } from "react";
import { loadModel } from "@/lib/model";
import type { LoadedModel, ModelFormat, ModelStats } from "@/lib/model.types";

type LoadState = {
    src: string;
    format: ModelFormat;
    model: LoadedModel | null;
    error: string | null;
};

export function useModel(src: string, format: ModelFormat, onStats?: (stats: ModelStats) => void) {
    const [result, setResult] = useState<LoadState | null>(null);

    useEffect(() => {
        let cancelled = false;

        loadModel(src, format)
            .then((model) => {
                if (cancelled) return;
                setResult({ src, format, model, error: null });
                onStats?.(model.stats);
            })
            .catch((err) => {
                if (cancelled) return;
                console.error(err);
                setResult({ src, format, model: null, error: "Could not load model." });
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src, format]);

    const model = result && result.src === src && result.format === format ? result.model : null;
    const error = result && result.src === src && result.format === format ? result.error : null;

    return { model, error };
}
