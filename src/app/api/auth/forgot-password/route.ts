/* ================================================
   POST /api/auth/forgot-password
   ================================================ */

import { NextRequest } from "next/server";
import { forgotPasswordSchema } from "@/validations/schemas";
import { forgotPassword } from "@/features/auth/auth-service";
import { handleApiError, apiSuccess, ValidationError } from "@/lib/errors";
import { checkRateLimit, authRateLimits } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/auth-middleware";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimitResult = checkRateLimit(`forgot-pwd:${ip}`, authRateLimits.forgotPassword);
    if (!rateLimitResult.allowed) {
      return Response.json(
        { success: false, error: { code: "RATE_LIMIT_EXCEEDED", message: "Too many requests. Please try again later." } },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path.join(".");
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      }
      throw new ValidationError(fieldErrors);
    }

    const result = await forgotPassword(parsed.data.email);
    return Response.json(apiSuccess(result));
  } catch (error) {
    return handleApiError(error);
  }
}
