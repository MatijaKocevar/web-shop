import { NextRequest, NextResponse } from "next/server";
import { getObjectStream } from "@/lib/storage";

type FilesRouteProps = {
    params: Promise<{ key: string[] }>;
};

export async function GET(_request: NextRequest, { params }: FilesRouteProps) {
    const { key } = await params;
    const object = await getObjectStream(key.join("/"));

    if (!object) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return new Response(object.stream, {
        headers: {
            "Content-Type": object.contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    });
}
