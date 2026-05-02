import "server-only";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import type { Session, User } from "@/lib/auth";

/**
 * Data Access Layer (DAL) — server-side session utilities.
 *
 * Call these from Server Components, Server Actions, or middleware.
 * NEVER import this file in Client Components.
 */

/**
 * Returns the current session, or null if the user is unauthenticated.
 */
export async function getServerSession(): Promise<{
  session: Session["session"];
  user: User;
} | null> {
  await connection();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session ?? null;
}

/**
 * Returns the current user, or null if unauthenticated.
 */
export async function getCurrentUser(): Promise<User | null> {
  const data = await getServerSession();
  return data?.user ?? null;
}

/**
 * Asserts an active session exists.
 * Redirects to the login page if the user is unauthenticated.
 */
export async function requireAuth(): Promise<{
  session: Session["session"];
  user: User;
}> {
  const data = await getServerSession();
  if (!data) {
    redirect("/login");
  }
  return data;
}

/**
 * Asserts the current user has the ADMIN role.
 * Redirects if unauthorized.
 */
export async function requireAdmin(): Promise<{
  session: Session["session"];
  user: User;
}> {
  const data = await requireAuth();
  // better-auth stores additional fields on the user object
  const role = (data.user as User & { role?: string }).role;
  if (role !== "ADMIN") {
    redirect("/");
  }
  return data;
}
