"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { presignedDownloadUrl } from "@/lib/storage";

export async function downloadFile(formData: FormData) {
    const session = await auth();
    if (session?.user.role !== "ADMIN") redirect("/signin");

    const fileId = formData.get("fileId") as string;
    if (!fileId) return;

    const file = await db.file.findUnique({ where: { id: fileId } });
    if (!file) return;

    const url = await presignedDownloadUrl(file.key, file.filename);

    redirect(url);
}
