import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const proxy = auth((req) => {
    const { nextUrl } = req;
    const isAdminRoute = nextUrl.pathname.startsWith("/admin");
    const role = req.auth?.user?.role;

    if (isAdminRoute && role !== "ADMIN") {
        const url = new URL("/signin", nextUrl);
        url.searchParams.set("callbackUrl", nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
});

export default proxy;

export const config = {
    matcher: ["/admin/:path*"],
};
