import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getAuthAdmin } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    await getAuthAdmin(request);

    let config = await db.systemEmailConfig.findUnique({
      where: { id: "default" },
    });

    if (!config) {
      config = await db.systemEmailConfig.create({
        data: {
          id: "default",
          provider: "smtp",
          smtpHost: "smtp.gmail.com",
          smtpPort: 587,
          fromEmail: "apin.official@gmail.com",
          fromName: "APIN Verification",
        },
      });
    }

    return Response.json(
      apiSuccess({
        config: {
          ...config,
          smtpPass: config.smtpPass ? "••••••••" : "",
          hasPassword: Boolean(config.smtpPass),
        },
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await getAuthAdmin(request);
    const body = await request.json();

    const {
      provider,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPass,
      smtpSecure,
      fromEmail,
      fromName,
      resendApiKey,
      isActive,
    } = body;

    const existing = await db.systemEmailConfig.findUnique({
      where: { id: "default" },
    });

    // If password sent is "••••••••" or empty, retain existing password
    const finalPassword =
      smtpPass && smtpPass !== "••••••••"
        ? smtpPass.trim()
        : existing?.smtpPass || null;

    const updated = await db.systemEmailConfig.upsert({
      where: { id: "default" },
      update: {
        provider: provider || "smtp",
        smtpHost: smtpHost?.trim() || null,
        smtpPort: smtpPort ? parseInt(String(smtpPort), 10) : 587,
        smtpUser: smtpUser?.trim() || null,
        smtpPass: finalPassword,
        smtpSecure: Boolean(smtpSecure),
        fromEmail: fromEmail?.trim() || null,
        fromName: fromName?.trim() || null,
        resendApiKey: resendApiKey?.trim() || null,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
      create: {
        id: "default",
        provider: provider || "smtp",
        smtpHost: smtpHost?.trim() || "smtp.gmail.com",
        smtpPort: smtpPort ? parseInt(String(smtpPort), 10) : 587,
        smtpUser: smtpUser?.trim() || null,
        smtpPass: finalPassword,
        smtpSecure: Boolean(smtpSecure),
        fromEmail: fromEmail?.trim() || "noreply@apin.dev",
        fromName: fromName?.trim() || "APIN Platform",
        resendApiKey: resendApiKey?.trim() || null,
        isActive: true,
      },
    });

    return Response.json(
      apiSuccess({
        message: "Email configuration saved successfully.",
        config: {
          ...updated,
          smtpPass: updated.smtpPass ? "••••••••" : "",
          hasPassword: Boolean(updated.smtpPass),
        },
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}
