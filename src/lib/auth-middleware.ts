/* ================================================
   Auth Middleware
   Extracts and validates user session from cookies.
   Used by API routes to protect endpoints.
   ================================================ */

import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { verifySessionToken, getSessionCookie } from "@/lib/auth";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";

export interface AuthUser {
  id: string;
  username: string;
  email: string | null;
  phone: string | null;
  isVerified: boolean;
  isActive: boolean;
  isSuspended: boolean;
}

export interface AuthAdmin {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Get authenticated user from session cookie.
 * Throws AuthenticationError if not authenticated.
 */
export async function getAuthUser(request?: NextRequest): Promise<AuthUser> {
  let token: string | undefined;

  if (request) {
    token = request.cookies.get("ciq_session")?.value;
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }
  } else {
    token = await getSessionCookie();
  }

  if (!token) {
    throw new AuthenticationError("Please log in to continue.");
  }

  const payload = verifySessionToken(token);
  if (!payload || payload.type !== "user") {
    throw new AuthenticationError("Your session has expired. Please log in again.");
  }

  // Verify session exists and is not revoked
  const session = await db.userSession.findUnique({
    where: { id: payload.sessionId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
          isVerified: true,
          isActive: true,
          isSuspended: true,
        },
      },
    },
  });

  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    throw new AuthenticationError("Your session has expired. Please log in again.");
  }

  if (!session.user.isActive || session.user.isSuspended) {
    throw new AuthorizationError("Your account has been suspended.");
  }

  return session.user;
}

/**
 * Get authenticated admin from session cookie.
 * Throws AuthenticationError if not authenticated.
 */
export async function getAuthAdmin(request?: NextRequest): Promise<AuthAdmin> {
  let token: string | undefined;

  if (request) {
    token = request.cookies.get("ciq_admin_session")?.value;
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }
  } else {
    // For server components, try to read from cookies
    const { cookies: getCookies } = await import("next/headers");
    const cookieStore = await getCookies();
    token = cookieStore.get("ciq_admin_session")?.value;
  }

  if (!token) {
    throw new AuthenticationError("Admin authentication required.");
  }

  const payload = verifySessionToken(token);
  if (!payload || payload.type !== "admin") {
    throw new AuthenticationError("Admin session expired.");
  }

  const session = await db.adminSession.findUnique({
    where: { id: payload.sessionId },
    include: {
      admin: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
        },
      },
    },
  });

  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    throw new AuthenticationError("Admin session expired.");
  }

  if (!session.admin.isActive) {
    throw new AuthorizationError("Admin account is disabled.");
  }

  return session.admin;
}

/**
 * Get user IP from request headers.
 */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Get user agent from request headers.
 */
export function getUserAgent(request: NextRequest): string {
  return request.headers.get("user-agent") || "unknown";
}
