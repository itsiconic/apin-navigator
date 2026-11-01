/* ================================================
   POST /api/auth/login
   ================================================ */

import { NextRequest } from "next/server";
import { loginSchema } from "@/validations/schemas";
import { login } from "@/features/auth/auth-service";
import { handleApiError, apiSuccess, ValidationError } from "@/lib/errors";
import { setSessionCookie } from "@/lib/auth";
import { checkRateLimit, authRateLimits } from "@/lib/rate-limit";
import { getClientIp, getUserAgent } from "@/lib/auth-middleware";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimitResult = checkRateLimit(`login:${ip}`, authRateLimits.login);
    if (!rateLimitResult.allowed) {
      return Response.json(
        { success: false, error: { code: "RATE_LIMIT_EXCEEDED", message: "Too many login attempts. Please try again later." } },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path.join(".");
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      }
      throw new ValidationError(fieldErrors);
    }

    const result = await login({
      identifier: parsed.data.identifier,
      password: parsed.data.password,
      ipAddress: ip,
      userAgent: getUserAgent(request),
    });

    // Set httpOnly session cookie
    await setSessionCookie(result.token, result.expiresAt);

    return Response.json(
      apiSuccess({
        user: result.user,
        token: result.token,
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}
