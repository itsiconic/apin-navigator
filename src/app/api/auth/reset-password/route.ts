/* ================================================
   POST /api/auth/reset-password
   ================================================ */

import { NextRequest } from "next/server";
import { resetPasswordSchema } from "@/validations/schemas";
import { resetPassword } from "@/features/auth/auth-service";
import { handleApiError, apiSuccess, ValidationError, AppError } from "@/lib/errors";
import { checkRateLimit, authRateLimits } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/auth-middleware";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimitResult = checkRateLimit(`reset-pwd:${ip}`, authRateLimits.resetPassword);
    if (!rateLimitResult.allowed) {
      return Response.json(
        { success: false, error: { code: "RATE_LIMIT_EXCEEDED", message: "Too many requests. Please try again later." } },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { token } = body;

    if (!token) {
      throw new AppError("Reset token is required.", 400, "MISSING_TOKEN");
    }

    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path.join(".");
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      }
      throw new ValidationError(fieldErrors);
    }

    const result = await resetPassword(token, parsed.data.password);
    return Response.json(apiSuccess(result));
  } catch (error) {
    return handleApiError(error);
  }
}
