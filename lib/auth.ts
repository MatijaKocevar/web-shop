import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { authConfig } from "@/lib/auth.config";

const providers: NextAuthConfig["providers"] = [...authConfig.providers];

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
    ...authConfig,
    providers,
    adapter: PrismaAdapter(db),
});
