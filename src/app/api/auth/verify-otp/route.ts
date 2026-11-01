/* ================================================
   POST /api/auth/verify-otp
   ================================================ */

import { NextRequest } from "next/server";
import { otpVerifySchema } from "@/validations/schemas";
import { verifyOtpCode } from "@/features/auth/auth-service";
import { db } from "@/lib/db";
import {
  createSessionToken,
  generateSecureToken,
  getSessionExpiry,
  setSessionCookie,
} from "@/lib/auth";
import { handleApiError, apiSuccess, ValidationError, AppError } from "@/lib/errors";
import { checkRateLimit, authRateLimits } from "@/lib/rate-limit";
import { getClientIp, getUserAgent } from "@/lib/auth-middleware";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimitResult = checkRateLimit(`otp-verify:${ip}`, authRateLimits.otpVerify);
    if (!rateLimitResult.allowed) {
      return Response.json(
        { success: false, error: { code: "RATE_LIMIT_EXCEEDED", message: "Too many attempts. Please try again later." } },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { userId, type } = body;

    if (!userId) {
      throw new AppError("User ID is required.", 400, "MISSING_USER_ID");
    }

    const parsed = otpVerifySchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path.join(".");
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      }
      throw new ValidationError(fieldErrors);
    }

    await verifyOtpCode(
      userId,
      parsed.data.otp,
      type || "EMAIL_VERIFICATION"
    );

    // Retrieve user details
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        isVerified: true,
      },
    });

    if (!user) {
      throw new AppError("User account not found.", 404);
    }

    // Automatically create session and issue JWT so user is immediately logged in!
    const expiresAt = getSessionExpiry();
    const rawToken = generateSecureToken();

    const session = await db.userSession.create({
      data: {
        userId: user.id,
        token: rawToken,
        ipAddress: ip,
        userAgent: getUserAgent(request),
        expiresAt,
      },
    });

    const jwtToken = createSessionToken({
      userId: user.id,
      sessionId: session.id,
      type: "user",
    });

    await setSessionCookie(jwtToken, expiresAt);

    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return Response.json(
      apiSuccess({
        verified: true,
        loggedIn: true,
        token: jwtToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          isVerified: user.isVerified,
        },
        message: "Account verified and logged in successfully!",
        redirect: "/dashboard",
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}
