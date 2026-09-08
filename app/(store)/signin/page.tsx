import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignInForm } from "./_components/sign-in-form";

type SignInPageProps = {
    searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
    const session = await auth();
    if (session) redirect("/");

    const { callbackUrl } = await searchParams;

    return (
        <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-20">
            <SignInForm
                callbackUrl={callbackUrl}
                testLogin={Boolean(process.env.AUTH_TEST_PASSWORD)}
            />
        </div>
    );
}
