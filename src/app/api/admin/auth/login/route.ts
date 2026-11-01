import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  generateSecureToken,
  hashToken,
  getSessionExpiry,
  setAdminSessionCookie,
} from "@/lib/auth";
import { handleApiError, apiSuccess, AuthenticationError, AppError } from "@/lib/errors";
import { getClientIp, getUserAgent } from "@/lib/auth-middleware";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !email.includes("@")) {
      throw new AppError("A valid email address is required.", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Look for existing admin
    let admin = await db.adminUser.findUnique({
      where: { email: normalizedEmail },
    });

    // 2. If admin doesn't exist, auto-create as Master Admin (Zero verification, zero password required!)
    if (!admin) {
      const fallbackHash = await hashPassword(password || "Admin@123456");
      admin = await db.adminUser.create({
        data: {
          email: normalizedEmail,
          name: normalizedEmail.split("@")[0],
          passwordHash: fallbackHash,
          role: "SUPER_ADMIN",
          isMaster: true,
          isActive: true, // ZERO verification needed
          lastLoginAt: new Date(),
        },
      });

      // Set any other admins to secondary
      await db.adminUser.updateMany({
        where: { id: { not: admin.id } },
        data: { isMaster: false },
      });
    } else {
      // Admin exists. If no other custom master admin exists, promote this admin to master!
      const existingMaster = await db.adminUser.findFirst({
        where: { isMaster: true, email: { not: "admin@apin.dev" }, id: { not: admin.id } },
      });

      if (!existingMaster && !admin.isMaster) {
        admin = await db.adminUser.update({
          where: { id: admin.id },
          data: { isMaster: true, role: "SUPER_ADMIN" },
        });
      }
    }

    if (!admin.isActive) {
      throw new AuthenticationError("This admin account is inactive.");
    }

    // 3. Automatically link this admin's email as the website's notification and OTP verification sender!
    await db.systemEmailConfig.upsert({
      where: { id: "default" },
      update: {
        smtpUser: admin.email,
        fromEmail: admin.email,
        fromName: `${admin.name} - APIN Platform`,
        isActive: true,
      },
      create: {
        id: "default",
        provider: "smtp",
        smtpHost: "smtp.gmail.com",
        smtpPort: 587,
        smtpUser: admin.email,
        fromEmail: admin.email,
        fromName: `${admin.name} - APIN Platform`,
        isActive: true,
      },
    });

    // 4. Password Check:
    // First admin / Master Admin NEVER requires password!
    if (password && !admin.isMaster) {
      const validPassword = await verifyPassword(password, admin.passwordHash);
      if (!validPassword) {
        throw new AuthenticationError("Invalid admin credentials.");
      }
    }

    // 4. Create admin session
    const rawToken = generateSecureToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = getSessionExpiry();
    const ipAddress = getClientIp(request);
    const userAgent = getUserAgent(request);

    const session = await db.adminSession.create({
      data: {
        adminUserId: admin.id,
        token: tokenHash,
        userAgent,
        ipAddress,
        expiresAt,
      },
    });

    const jwtToken = createSessionToken({
      userId: admin.id,
      sessionId: session.id,
      type: "admin",
    });

    await setAdminSessionCookie(jwtToken, expiresAt);

    await db.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    return Response.json(
      apiSuccess({
        token: jwtToken,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          isMaster: admin.isMaster,
        },
        message: admin.isMaster
          ? "Welcome Master Admin! Logged in with email ID."
          : "Logged in successfully.",
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}
