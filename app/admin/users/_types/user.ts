import type { Role } from "@/generated/prisma/enums";

export type User = {
    id: string;
    name: string | null;
    email: string | null;
    role: Role;
};
