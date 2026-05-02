import type { Metadata } from "next";
import { RegisterForm } from "@/components/modules/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a free account to start shopping.",
};

interface RegisterPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <RegisterForm callbackUrl={callbackUrl ?? "/"} />
    </main>
  );
}
