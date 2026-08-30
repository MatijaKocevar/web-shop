import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { db } from "@/lib/db";
import type { Role } from "@/generated/prisma/enums";

const providers: NextAuthConfig["providers"] = [
    Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Resend({
        apiKey: process.env.AUTH_RESEND_KEY,
        from: process.env.EMAIL_FROM,
    }),
];

// Dev/test login: enabled only when AUTH_TEST_PASSWORD is set. Lets you sign
// in as any seeded user (see prisma/seed.ts) with a shared password.
if (process.env.AUTH_TEST_PASSWORD) {
    providers.push(
        Credentials({
            id: "credentials",
            name: "Test login",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const email = (credentials?.email as string | undefined)?.toLowerCase();
                const password = credentials?.password as string | undefined;

                if (!email || !password) return null;
                if (password !== process.env.AUTH_TEST_PASSWORD) return null;

                const user = await db.user.findUnique({ where: { email } });
                if (!user) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                };
            },
        }),
    );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    trustHost: true,
    cookies: {
        sessionToken: {
            name: "web-shop.session-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: false,
            },
        },
    },
    providers,
    pages: {
        signIn: "/signin",
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as { role?: Role }).role ?? "CUSTOMER";
            }
            return token;
        },
        session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as Role;
            }
            return session;
        },
    },
});
