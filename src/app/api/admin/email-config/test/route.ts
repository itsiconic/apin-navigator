import { NextRequest } from "next/server";
import { getAuthAdmin } from "@/lib/auth-middleware";
import { sendOtpEmail, getActiveEmailConfig, createSmtpTransporter } from "@/lib/email";
import { handleApiError, apiSuccess, AppError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    await getAuthAdmin(request);
    const body = await request.json();
    const { toEmail } = body;

    if (!toEmail || !toEmail.includes("@")) {
      throw new AppError("A valid destination email is required for the test.", 400);
    }

    const activeConfig = await getActiveEmailConfig();

    // Verify SMTP connection directly if provider is smtp
    if (activeConfig.provider === "smtp") {
      if (!activeConfig.smtpUser || !activeConfig.smtpPass) {
        return Response.json(
          apiSuccess({
            success: false,
            provider: "SMTP",
            message: "Cannot test: SMTP Username (Gmail address) or App Password is not yet saved in config.",
          })
        );
      }

      try {
        const transporter = createSmtpTransporter(activeConfig);
        await transporter.verify();
      } catch (verifyError: unknown) {
        const errMsg = verifyError instanceof Error ? verifyError.message : String(verifyError);
        return Response.json(
          apiSuccess({
            success: false,
            provider: "SMTP/Gmail",
            message: `SMTP Connection Handshake Failed: ${errMsg}`,
            recommendation: "Ensure 2-Step Verification is enabled in your Google Account and you generated a 16-character 'App Password' (not your standard Gmail password).",
          })
        );
      }
    }

    // Generate random 6-digit test code
    const testOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const sent = await sendOtpEmail(toEmail, testOtp);

    return Response.json(
      apiSuccess({
        success: sent,
        provider: activeConfig.provider.toUpperCase(),
        to: toEmail,
        testCodeSent: testOtp,
        message: sent
          ? `Real verification test email successfully delivered to ${toEmail} using ${activeConfig.provider.toUpperCase()} provider!`
          : `Failed to dispatch email. Check server logs or provider credentials.`,
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}
