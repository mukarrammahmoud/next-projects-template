import type { Metadata } from "next";
import { LoginForm } from "@/components/modules/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account to continue shopping.",
};

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <LoginForm callbackUrl={callbackUrl ?? "/"} />
    </main>
  );
}
