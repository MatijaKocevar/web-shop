"use client";

import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type AdminFormDialogProps = {
    open: boolean;
    onCloseHref: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    className?: string;
    children: React.ReactNode;
};

export function AdminFormDialog({
    open,
    onCloseHref,
    title,
    description,
    className,
    children,
}: AdminFormDialogProps) {
    const router = useRouter();

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!next) router.replace(onCloseHref);
            }}
        >
            <DialogContent className={cn("max-h-[85dvh] overflow-y-auto p-6", className)}>
                {(title || description) && (
                    <DialogHeader>
                        {title && <DialogTitle>{title}</DialogTitle>}
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>
                )}
                {children}
            </DialogContent>
        </Dialog>
    );
}
