import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";

export const auth = betterAuth({
  /**
   * The base URL is inferred from BETTER_AUTH_URL env var in production.
   * Falls back to NEXTAUTH_URL for compatibility, then localhost for dev.
   */
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXTAUTH_URL,

  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // set true when email transport is configured
  },

  plugins: [nextCookies()],

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        input: false, // not settable by the client directly
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh session cookie if older than 1 day
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
