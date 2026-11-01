/* ================================================
   POST /api/auth/resend-otp
   ================================================ */

import { NextRequest } from "next/server";
import { resendOtp } from "@/features/auth/auth-service";
import { handleApiError, apiSuccess, AppError } from "@/lib/errors";
import { checkRateLimit, authRateLimits } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/auth-middleware";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimitResult = checkRateLimit(`otp-resend:${ip}`, authRateLimits.otp);
    if (!rateLimitResult.allowed) {
      return Response.json(
        { success: false, error: { code: "RATE_LIMIT_EXCEEDED", message: "Please wait before requesting another code." } },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      throw new AppError("User ID is required.", 400, "MISSING_USER_ID");
    }

    const result = await resendOtp(userId);
    return Response.json(apiSuccess(result));
  } catch (error) {
    return handleApiError(error);
  }
}
