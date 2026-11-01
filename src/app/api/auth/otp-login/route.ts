/* ================================================
   POST /api/auth/otp-login
   Candidate / User Login with 6-digit Email OTP
   (Passwordless verification code login & auto-signup)
   ================================================ */

import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { config } from "@/lib/config";
import { generateAndSendOtp } from "@/features/auth/auth-service";
import { hashPassword, generateSecureToken } from "@/lib/auth";
import { handleApiError, apiSuccess, AppError } from "@/lib/errors";
import { checkRateLimit, authRateLimits } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/auth-middleware";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimitResult = checkRateLimit(`otp-login:${ip}`, authRateLimits.login);
    if (!rateLimitResult.allowed) {
      return Response.json(
        { success: false, error: { code: "RATE_LIMIT_EXCEEDED", message: "Too many attempts. Please try again later." } },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      throw new AppError("A valid email address is required.", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Find or auto-create candidate account
    let user = await db.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          { username: normalizedEmail.split("@")[0] },
        ],
      },
    });

    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      const baseName = normalizedEmail.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
      const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
      const username = `${baseName || "user"}_${uniqueSuffix}`;
      const fallbackHash = await hashPassword(generateSecureToken());

      user = await db.user.create({
        data: {
          username,
          email: normalizedEmail,
          passwordHash: fallbackHash,
          termsAccepted: true,
          isVerified: false,
          profile: {
            create: {},
          },
        },
      });
    }

    if (!user.isActive || user.isSuspended) {
      throw new AppError("This account has been deactivated or suspended.", 403);
    }

    // 2. Generate and dispatch 6-digit numerical OTP with greeting image and greeting paragraph
    const otp = await generateAndSendOtp(user.id, normalizedEmail, "EMAIL_VERIFICATION");

    // 3. Automatically notify Master Admin
    try {
      const masterAdmin = await db.adminUser.findFirst({
        where: { OR: [{ isMaster: true }, { role: "SUPER_ADMIN" }] },
        orderBy: { createdAt: "asc" },
      });

      if (masterAdmin) {
        await db.adminNotification.create({
          data: {
            title: isNewUser ? `New Candidate Registered: @${user.username}` : `Candidate Login OTP: @${user.username}`,
            message: `Dispatched 6-digit verification OTP (${otp}) to ${normalizedEmail}.`,
            type: isNewUser ? "NEW_USER_SIGNUP" : "OTP_DISPATCH",
            metadata: {
              userId: user.id,
              username: user.username,
              email: normalizedEmail,
              otp,
              isNewUser,
            },
          },
        });
      }
    } catch {
      // Non-blocking
    }

    return Response.json(
      apiSuccess({
        userId: user.id,
        email: user.email || normalizedEmail,
        username: user.username,
        isNewUser,
        message: `A 6-digit verification code has been dispatched to ${normalizedEmail}.`,
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}
