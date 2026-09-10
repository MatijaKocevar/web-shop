import type { Key, MouseEventHandler, ReactNode } from "react";

export type AdminTableColumnFilter =
    | { type: "select"; key: string; options?: { value: string; label: string }[] }
    | { type: "text" };

export type AdminTableColumn = {
    label?: ReactNode;
    srOnly?: boolean;
    className?: string;
    sortable?: boolean;
    filter?: AdminTableColumnFilter;
};

export type AdminTableCell = {
    content: ReactNode;
    className?: string;
    colSpan?: number;
    search?: string;
    sort?: string | number;
};

export type AdminTableRow = {
    key?: Key;
    cells: AdminTableCell[];
    className?: string;
    title?: string;
    href?: string;
    onDoubleClick?: MouseEventHandler<HTMLTableRowElement>;
    filterValues?: Record<string, string>;
};
