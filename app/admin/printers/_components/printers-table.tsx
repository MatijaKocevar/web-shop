"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, CornerDownRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { AdminTable } from "@/components/admin-table";
import type { AdminTableColumn, AdminTableRow } from "@/components/admin-table.types";
import { buttonVariants } from "@/components/ui/button";
import type { PrinterWithProfiles } from "../_types/printer-with-profiles";

type PrintersTableProps = {
    printers: PrinterWithProfiles[];
};

export function PrintersTable({ printers }: PrintersTableProps) {
    const t = useTranslations("admin.printers");
    const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());

    function toggle(id: string) {
        setCollapsed((current) => {
            const next = new Set(current);

            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }

            return next;
        });
    }

    const columns: AdminTableColumn[] = [
        { label: t("printer"), filter: { type: "text" }, className: "w-[32%]" },
        { label: t("layer"), className: "w-[10%]" },
        { label: t("infill"), className: "w-[10%]" },
        { label: t("speed"), className: "w-[13%]" },
        { label: t("machineRate"), className: "w-[13%]" },
        { label: t("actions"), srOnly: true, className: "w-[22%]" },
    ];

    const rows = printers.flatMap((printer) => {
        const isOpen = !collapsed.has(printer.id);

        const printerRow: AdminTableRow = {
            key: printer.id,
            className: "bg-muted/40",
            href: `/admin/printers?id=${printer.id}`,
            cells: [
                {
                    content: (
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                                onClick={() => toggle(printer.id)}
                                title={t("toggleProfiles")}
                            >
                                {isOpen ? (
                                    <ChevronDown className="size-4" />
                                ) : (
                                    <ChevronRight className="size-4" />
                                )}
                            </button>
                            <Link
                                href={`/admin/printers?id=${printer.id}`}
                                className="font-medium hover:underline"
                            >
                                {printer.name}
                            </Link>
                            <span className="text-xs text-muted-foreground">
                                {printer.buildX}×{printer.buildY}×{printer.buildZ} mm
                            </span>
                        </div>
                    ),
                    search: `${printer.name} ${printer.buildX}×${printer.buildY}×${printer.buildZ}`,
                },
                { content: "", colSpan: 4 },
                {
                    content: (
                        <div className="flex justify-end gap-2">
                            <Link
                                href={`/admin/printers?newProfile=1&printer=${printer.id}`}
                                className={buttonVariants({ size: "sm" })}
                            >
                                {t("newProfile")}
                            </Link>
                            <Link
                                href={`/admin/printers?id=${printer.id}`}
                                className={buttonVariants({ variant: "outline", size: "sm" })}
                            >
                                {t("editPrinterLink")}
                            </Link>
                        </div>
                    ),
                },
            ],
        };

        if (!isOpen) return [printerRow];

        const profileRows: AdminTableRow[] = printer.profiles.map((profile) => ({
            key: profile.id,
            href: `/admin/printers?profileId=${profile.id}`,
            cells: [
                {
                    content: (
                        <div className="flex items-center gap-1.5 pl-7">
                            <CornerDownRight className="size-3.5 shrink-0 text-muted-foreground" />
                            <Link
                                href={`/admin/printers?profileId=${profile.id}`}
                                className="font-medium hover:underline"
                            >
                                {profile.name}
                            </Link>
                        </div>
                    ),
                    search: `${printer.name} ${profile.name}`,
                },
                { content: `${profile.layerHeight} mm`, search: String(profile.layerHeight) },
                { content: `${profile.infill}%`, search: String(profile.infill) },
                {
                    content: profile.speed ? `${profile.speed} mm/s` : "—",
                    search: String(profile.speed ?? ""),
                },
                {
                    content: `€${profile.machineHourRate.toFixed(2)}/h`,
                    search: String(profile.machineHourRate),
                },
                {
                    content: (
                        <div className="flex justify-end gap-2">
                            <Link
                                href={`/admin/printers?profileId=${profile.id}`}
                                className={buttonVariants({ variant: "outline", size: "sm" })}
                            >
                                {t("editProfile")}
                            </Link>
                        </div>
                    ),
                },
            ],
        }));

        if (profileRows.length === 0) {
            profileRows.push({
                key: `${printer.id}-empty`,
                cells: [
                    {
                        content: (
                            <span className="flex items-center gap-1.5 pl-7 text-muted-foreground">
                                <CornerDownRight className="size-3.5 shrink-0" />
                                {t("noProfiles")}
                            </span>
                        ),
                        className: "text-muted-foreground",
                        colSpan: 6,
                    },
                ],
            });
        }

        return [printerRow, ...profileRows];
    });

    return (
        <AdminTable
            columns={columns}
            rows={rows}
            layout="fixed"
            counter={
                <span className="text-xs text-muted-foreground">
                    {t("count", { count: printers.length })}
                </span>
            }
            toolbarActions={
                <Link href="/admin/printers?new=1" className={buttonVariants({ size: "sm" })}>
                    {t("newPrinter")}
                </Link>
            }
            fill
        />
    );
}
