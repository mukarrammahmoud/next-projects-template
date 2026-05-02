import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

/**
 * better-auth catch-all route handler.
 * Mount this at: app/api/auth/[...all]/route.ts
 *
 * This handles:
 *   GET  /api/auth/*  (e.g. /api/auth/session, /api/auth/get-session)
 *   POST /api/auth/*  (e.g. /api/auth/sign-in, /api/auth/sign-up)
 */
export const { GET, POST } = toNextJsHandler(auth);
