/* ================================================
   POST /api/auth/signup
   ================================================ */

import { NextRequest } from "next/server";
import { signupSchema } from "@/validations/schemas";
import { signup } from "@/features/auth/auth-service";
import { handleApiError, apiSuccess, ValidationError } from "@/lib/errors";
import { checkRateLimit, authRateLimits } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/auth-middleware";

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = getClientIp(request);
    const rateLimitResult = checkRateLimit(`signup:${ip}`, authRateLimits.signup);
    if (!rateLimitResult.allowed) {
      return Response.json(
        { success: false, error: { code: "RATE_LIMIT_EXCEEDED", message: "Too many signup attempts. Please try again later." } },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path.join(".");
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      }
      throw new ValidationError(fieldErrors);
    }

    const result = await signup({
      username: parsed.data.username,
      email: parsed.data.email || undefined,
      phone: parsed.data.phone || undefined,
      password: parsed.data.password,
      termsAccepted: parsed.data.termsAccepted,
    });

    return Response.json(apiSuccess(result), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
