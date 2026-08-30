import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslations } from "next-intl";
import type { ModelFormat, ModelStats } from "@/hooks/use-model";
import { detectFormat } from "../_utils/detect-format";

export function useUpload() {
    const t = useTranslations("upload");
    const [file, setFile] = useState<File | null>(null);
    const [objectUrl, setObjectUrl] = useState<string | null>(null);
    const [format, setFormat] = useState<ModelFormat | null>(null);
    const [stats, setStats] = useState<ModelStats | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (accepted) => {
            const dropped = accepted[0];
            if (!dropped) return;

            const fmt = detectFormat(dropped);
            if (!fmt) {
                setError(t("unsupportedFile"));
                return;
            }

            setError(null);
            setStats(null);
            setFile(dropped);
            setFormat(fmt);
            setObjectUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return URL.createObjectURL(dropped);
            });
        },
        accept: {
            "model/stl": [".stl"],
            "model/3mf": [".3mf"],
        },
        maxFiles: 1,
    });

    function reset() {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        setFile(null);
        setObjectUrl(null);
        setFormat(null);
        setStats(null);
        setError(null);
    }

    return {
        file,
        objectUrl,
        format,
        stats,
        error,
        setStats,
        dropzone: { getRootProps, getInputProps, isDragActive },
        reset,
    };
}
