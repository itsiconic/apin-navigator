import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  hashPassword,
  createSessionToken,
  generateSecureToken,
  hashToken,
  getSessionExpiry,
  setAdminSessionCookie,
} from "@/lib/auth";
import { handleApiError, apiSuccess, AppError, ConflictError } from "@/lib/errors";
import { getClientIp, getUserAgent } from "@/lib/auth-middleware";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, gmailAppPassword } = body;

    if (!name || !email || !password) {
      throw new AppError("Name, email, and password are required.", 400);
    }

    if (!email.includes("@")) {
      throw new AppError("Please provide a valid email address.", 400);
    }

    const existingAdmin = await db.adminUser.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      throw new ConflictError("An administrator account with this email already exists.");
    }

    const customMaster = await db.adminUser.findFirst({
      where: { isMaster: true, email: { not: "admin@apin.dev" } },
    });
    const isMasterAdmin = !customMaster;

    const passwordHash = await hashPassword(password);

    // First Admin requires NO verification and is marked as Master
    const newAdmin = await db.adminUser.create({
      data: {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        passwordHash,
        role: "SUPER_ADMIN",
        isMaster: isMasterAdmin,
        isActive: true, // Immediately active, ZERO verification needed
        lastLoginAt: new Date(),
      },
    });

    // Automatically connect this admin's email as the website's verification dispatch engine!
    if (isMasterAdmin) {
      // Demote dummy admin if any
      await db.adminUser.updateMany({
        where: { id: { not: newAdmin.id } },
        data: { isMaster: false },
      });

      const sanitizedAppPass = gmailAppPassword ? gmailAppPassword.trim().replace(/\s+/g, "") : null;
      await db.systemEmailConfig.upsert({
        where: { id: "default" },
        update: {
          provider: sanitizedAppPass ? "smtp" : "mock",
          smtpHost: "smtp.gmail.com",
          smtpPort: 587,
          smtpUser: newAdmin.email,
          fromEmail: newAdmin.email,
          fromName: `${newAdmin.name} - APIN Platform`,
          ...(sanitizedAppPass ? { smtpPass: sanitizedAppPass } : {}),
          isActive: true,
        },
        create: {
          id: "default",
          provider: sanitizedAppPass ? "smtp" : "mock",
          smtpHost: "smtp.gmail.com",
          smtpPort: 587,
          smtpUser: newAdmin.email,
          fromEmail: newAdmin.email,
          fromName: `${newAdmin.name} - APIN Platform`,
          smtpPass: sanitizedAppPass || null,
          isActive: true,
        },
      });

      // Log notification
      await db.adminNotification.create({
        data: {
          title: "Master Admin Activated",
          message: `Master Administrator ${newAdmin.name} (${newAdmin.email}) registered. This email is now the platform's official dispatch gateway.`,
          type: "SYSTEM_ALERT",
        },
      });
    } else {
      // If secondary admin, notify master admin
      await db.adminNotification.create({
        data: {
          title: "New Secondary Admin Registered",
          message: `Admin ${newAdmin.name} (${newAdmin.email}) just signed up through the admin portal.`,
          type: "SYSTEM_ALERT",
        },
      });
    }

    // Create session and set cookie
    const rawToken = generateSecureToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = getSessionExpiry();
    const ipAddress = getClientIp(request);
    const userAgent = getUserAgent(request);

    const session = await db.adminSession.create({
      data: {
        adminUserId: newAdmin.id,
        token: tokenHash,
        userAgent,
        ipAddress,
        expiresAt,
      },
    });

    const jwtToken = createSessionToken({
      userId: newAdmin.id,
      sessionId: session.id,
      type: "admin",
    });

    await setAdminSessionCookie(jwtToken, expiresAt);

    return NextResponse.json(
      apiSuccess({
        token: jwtToken,
        isMasterAdmin,
        admin: {
          id: newAdmin.id,
          email: newAdmin.email,
          name: newAdmin.name,
          role: newAdmin.role,
          isMaster: newAdmin.isMaster,
        },
        message: isMasterAdmin
          ? `Master Admin account created! Your email (${newAdmin.email}) has been automatically linked as the website's verification sender.`
          : `Admin account created successfully!`,
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}
