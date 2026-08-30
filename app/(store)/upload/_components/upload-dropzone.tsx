import { Upload } from "lucide-react";
import type { DropzoneState } from "react-dropzone";

type Props = Pick<DropzoneState, "getRootProps" | "getInputProps" | "isDragActive">;

export function UploadDropzone({ getRootProps, getInputProps, isDragActive }: Props) {
    return (
        <div
            {...getRootProps()}
            className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center transition-colors hover:bg-muted/50"
        >
            <input {...getInputProps()} />
            <Upload className="size-8 text-muted-foreground" />
            {isDragActive ? (
                <p>Drop the file here</p>
            ) : (
                <div className="flex flex-col gap-1">
                    <p className="font-medium">Drag &amp; drop a model</p>
                    <p className="text-sm text-muted-foreground">
                        or click to browse · .stl / .3mf
                    </p>
                </div>
            )}
        </div>
    );
}
