/* ================================================
   Auth Service — Business Logic
   Signup, Login, OTP, Password Reset, Sessions.
   ================================================ */

import { db } from "@/lib/db";
import { config } from "@/lib/config";
import { logger } from "@/lib/logger";
import {
  hashPassword,
  verifyPassword,
  generateOtp,
  hashOtp,
  verifyOtp,
  createSessionToken,
  generateSecureToken,
  hashToken,
  getSessionExpiry,
} from "@/lib/auth";
import { sendOtpEmail, sendPasswordResetEmail, sendAdminNewUserAlert } from "@/lib/email";
import {
  AppError,
  ConflictError,
  AuthenticationError,
  NotFoundError,
} from "@/lib/errors";

// ================================================
// Signup
// ================================================

export interface SignupData {
  username: string;
  email?: string;
  phone?: string;
  password: string;
  termsAccepted: boolean;
}

export async function signup(data: SignupData) {
  // Check uniqueness
  const existing = await db.user.findFirst({
    where: {
      OR: [
        { username: data.username },
        ...(data.email ? [{ email: data.email }] : []),
        ...(data.phone ? [{ phone: data.phone }] : []),
      ],
    },
    select: { username: true, email: true, phone: true },
  });

  if (existing) {
    if (existing.username === data.username) {
      throw new ConflictError("This username is already taken.");
    }
    if (data.email && existing.email === data.email) {
      throw new ConflictError("An account with this email already exists.");
    }
    if (data.phone && existing.phone === data.phone) {
      throw new ConflictError("An account with this phone number already exists.");
    }
  }

  const passwordHash = await hashPassword(data.password);

  const user = await db.user.create({
    data: {
      username: data.username,
      email: data.email || null,
      phone: data.phone || null,
      passwordHash,
      termsAccepted: data.termsAccepted,
      profile: {
        create: {},
      },
    },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
    },
  });

  // Generate and send OTP
  const target = data.email || data.phone;
  if (target) {
    const generated = await generateAndSendOtp(user.id, target, data.email ? "EMAIL_VERIFICATION" : "PHONE_VERIFICATION");

    // Automatically alert Master Admin of new signup
    try {
      const masterAdmin = await db.adminUser.findFirst({
        where: { OR: [{ isMaster: true }, { role: "SUPER_ADMIN" }] },
        orderBy: { createdAt: "asc" },
      });

      if (masterAdmin) {
        await db.adminNotification.create({
          data: {
            title: `New Candidate: @${user.username}`,
            message: `Candidate @${user.username} (${data.email || data.phone || "No contact"}) registered. Dispatched 6-digit OTP: ${generated}.`,
            type: "NEW_USER_SIGNUP",
            metadata: {
              userId: user.id,
              username: user.username,
              email: data.email,
              phone: data.phone,
              otp: generated,
            },
          },
        });

        if (masterAdmin.email && masterAdmin.email !== data.email) {
          await sendAdminNewUserAlert(
            masterAdmin.email,
            {
              username: user.username,
              email: data.email,
              phone: data.phone,
            },
            generated
          );
        }
      }
    } catch (adminErr) {
      logger.warn("Could not dispatch master admin notification", {
        error: adminErr instanceof Error ? adminErr.message : "Unknown",
      });
    }
  }

  logger.info("User signup", { userId: user.id, username: user.username });

  return {
    userId: user.id,
    username: user.username,
    requiresVerification: true,
    verificationTarget: target,
  };
}

// ================================================
// OTP
// ================================================

type OtpTypeValue = "EMAIL_VERIFICATION" | "PHONE_VERIFICATION" | "PASSWORD_RESET" | "LOGIN";

export async function generateAndSendOtp(
  userId: string,
  target: string,
  type: OtpTypeValue
): Promise<string> {
  // Check cooldown — prevent resend within cooldown window
  const recentOtp = await db.otpVerification.findFirst({
    where: {
      userId,
      target,
      type,
      isUsed: false,
      createdAt: {
        gte: new Date(Date.now() - config.otpResendCooldownSeconds * 1000),
      },
    },
  });

  if (recentOtp) {
    const waitSeconds = Math.ceil(
      (recentOtp.createdAt.getTime() +
        config.otpResendCooldownSeconds * 1000 -
        Date.now()) /
      1000
    );
    throw new AppError(
      `Please wait ${waitSeconds} seconds before requesting a new code.`,
      429,
      "OTP_COOLDOWN"
    );
  }

  // Invalidate any existing unused OTPs for this target/type
  await db.otpVerification.updateMany({
    where: {
      userId,
      target,
      type,
      isUsed: false,
    },
    data: { isUsed: true },
  });

  const otp = generateOtp(config.otpLength);
  const otpHash = await hashOtp(otp);

  await db.otpVerification.create({
    data: {
      userId,
      otpHash,
      type,
      target,
      expiresAt: new Date(Date.now() + config.otpExpiryMinutes * 60 * 1000),
    },
  });

  // Send the OTP
  if (target.includes("@")) {
    await sendOtpEmail(target, otp);
  } else {
    // SMS — would use SMS adapter, mock for now
    logger.info("📱 [MOCK SMS] OTP sent", { to: target, otp });
  }

  logger.info("OTP generated", { userId, target: target.substring(0, 4) + "***", type });
  return otp;
}

export async function verifyOtpCode(
  userId: string,
  otp: string,
  type: OtpTypeValue
) {
  const otpRecord = await db.otpVerification.findFirst({
    where: {
      userId,
      type,
      isUsed: false,
      expiresAt: { gte: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otpRecord) {
    throw new AppError(
      "Verification code has expired. Please request a new one.",
      400,
      "OTP_EXPIRED"
    );
  }

  if (otpRecord.attempts >= config.otpMaxAttempts) {
    // Mark as used to prevent further attempts
    await db.otpVerification.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });
    throw new AppError(
      "Too many failed attempts. Please request a new code.",
      429,
      "OTP_MAX_ATTEMPTS"
    );
  }

  // Increment attempt count
  await db.otpVerification.update({
    where: { id: otpRecord.id },
    data: { attempts: { increment: 1 } },
  });

  const isValid = await verifyOtp(otp, otpRecord.otpHash);
  if (!isValid) {
    const remaining = config.otpMaxAttempts - otpRecord.attempts - 1;
    throw new AppError(
      `Invalid verification code. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`,
      400,
      "OTP_INVALID"
    );
  }

  // Mark OTP as used
  await db.otpVerification.update({
    where: { id: otpRecord.id },
    data: { isUsed: true },
  });

  // If email/phone verification, activate the user
  if (type === "EMAIL_VERIFICATION" || type === "PHONE_VERIFICATION") {
    await db.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });
  }

  logger.info("OTP verified", { userId, type });
  return true;
}

// ================================================
// Login
// ================================================

export interface LoginData {
  identifier: string; // username, email, or phone
  password: string;
  ipAddress: string;
  userAgent: string;
}

export async function login(data: LoginData) {
  // Find user by username, email, or phone
  const user = await db.user.findFirst({
    where: {
      OR: [
        { username: data.identifier },
        { email: data.identifier },
        { phone: data.identifier },
      ],
    },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      passwordHash: true,
      isVerified: true,
      isActive: true,
      isSuspended: true,
    },
  });

  if (!user) {
    throw new AuthenticationError("Invalid credentials.");
  }

  if (!user.isActive || user.isSuspended) {
    throw new AuthenticationError("Your account has been suspended.");
  }

  const passwordValid = await verifyPassword(data.password, user.passwordHash);
  if (!passwordValid) {
    throw new AuthenticationError("Invalid credentials.");
  }

  // Create session
  const expiresAt = getSessionExpiry();
  const session = await db.userSession.create({
    data: {
      userId: user.id,
      token: generateSecureToken(),
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      expiresAt,
    },
  });

  const token = createSessionToken({
    userId: user.id,
    sessionId: session.id,
    type: "user",
  });

  // Update last login
  await db.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  logger.info("User login", { userId: user.id, username: user.username });

  return {
    token,
    expiresAt,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      isVerified: user.isVerified,
    },
  };
}

// ================================================
// Logout
// ================================================

export async function logout(sessionId: string) {
  await db.userSession.update({
    where: { id: sessionId },
    data: { revokedAt: new Date() },
  });
}

export async function logoutAllDevices(userId: string) {
  await db.userSession.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: { revokedAt: new Date() },
  });
  logger.info("Logout all devices", { userId });
}

// ================================================
// Forgot Password
// ================================================

export async function forgotPassword(email: string) {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, email: true, username: true },
  });

  if (!user || !user.email) {
    // Don't reveal whether the email exists
    return { message: "If an account exists with this email, you'll receive a reset link." };
  }

  // Invalidate existing tokens
  await db.passwordResetToken.updateMany({
    where: { userId: user.id, isUsed: false },
    data: { isUsed: true },
  });

  const rawToken = generateSecureToken();
  const tokenHash = hashToken(rawToken);

  await db.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });

  const resetUrl = `${config.appUrl}/reset-password?token=${rawToken}`;
  await sendPasswordResetEmail(user.email, resetUrl);

  try {
    const masterAdmin = await db.adminUser.findFirst({
      where: { OR: [{ isMaster: true }, { role: "SUPER_ADMIN" }] },
      orderBy: { createdAt: "asc" },
    });
    if (masterAdmin) {
      await db.adminNotification.create({
        data: {
          title: `Password Reset: @${user.username}`,
          message: `Candidate @${user.username} (${user.email}) requested a password reset link.`,
          type: "SYSTEM_ALERT",
          metadata: {
            userId: user.id,
            username: user.username,
            email: user.email,
            resetUrl,
          },
        },
      });
    }
  } catch {
    // Non-blocking
  }

  logger.info("Password reset requested", { userId: user.id });

  return {
    message: "If an account exists with this email, you'll receive a reset link.",
    devResetUrl: config.emailProvider === "mock" || config.nodeEnv === "development" ? resetUrl : undefined,
  };
}

// ================================================
// Reset Password
// ================================================

export async function resetPassword(token: string, newPassword: string) {
  const tokenHash = hashToken(token);

  const resetToken = await db.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: { select: { id: true } } },
  });

  if (!resetToken || resetToken.isUsed || resetToken.expiresAt < new Date()) {
    throw new AppError(
      "This password reset link has expired. Please request a new one.",
      400,
      "RESET_TOKEN_INVALID"
    );
  }

  const passwordHash = await hashPassword(newPassword);

  await db.$transaction([
    db.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    db.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { isUsed: true },
    }),
    // Revoke all sessions on password reset
    db.userSession.updateMany({
      where: { userId: resetToken.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);

  logger.info("Password reset completed", { userId: resetToken.userId });
  return { message: "Password reset successfully. Please log in with your new password." };
}

// ================================================
// Resend OTP
// ================================================

export async function resendOtp(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, phone: true, isVerified: true },
  });

  if (!user) {
    throw new NotFoundError("User");
  }

  if (user.isVerified) {
    throw new AppError("Account is already verified.", 400, "ALREADY_VERIFIED");
  }

  const target = user.email || user.phone;
  if (!target) {
    throw new AppError("No email or phone to verify.", 400, "NO_VERIFICATION_TARGET");
  }

  const type: OtpTypeValue = user.email ? "EMAIL_VERIFICATION" : "PHONE_VERIFICATION";
  await generateAndSendOtp(user.id, target, type);

  return {
    message: "A new verification code has been sent.",
  };
}
