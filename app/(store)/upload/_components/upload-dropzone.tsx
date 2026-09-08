import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import type { DropzoneState } from "react-dropzone";

type UploadDropzoneProps = Pick<DropzoneState, "getRootProps" | "getInputProps" | "isDragActive">;

export function UploadDropzone({ getRootProps, getInputProps, isDragActive }: UploadDropzoneProps) {
    const t = useTranslations("upload");

    return (
        <div
            {...getRootProps()}
            className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center transition-colors hover:bg-muted/50"
        >
            <input {...getInputProps()} />
            <Upload className="size-8 text-muted-foreground" />
            {isDragActive ? (
                <p>{t("dropHere")}</p>
            ) : (
                <div className="flex flex-col gap-1">
                    <p className="font-medium">{t("dragDrop")}</p>
                    <p className="text-sm text-muted-foreground">{t("browseHint")}</p>
                </div>
            )}
        </div>
    );
}
