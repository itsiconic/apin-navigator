/* ================================================
   POST /api/auth/logout
   DELETE /api/auth/logout (logout all devices)
   ================================================ */

import { NextRequest } from "next/server";
import { logout, logoutAllDevices } from "@/features/auth/auth-service";
import { handleApiError, apiSuccess } from "@/lib/errors";
import { verifySessionToken, clearSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("ciq_session")?.value;
    if (token) {
      const payload = verifySessionToken(token);
      if (payload) {
        await logout(payload.sessionId);
      }
    }
    await clearSessionCookie();
    return Response.json(apiSuccess({ message: "Logged out successfully." }));
  } catch (error) {
    return handleApiError(error);
  }
}

// Logout from all devices
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("ciq_session")?.value;
    if (token) {
      const payload = verifySessionToken(token);
      if (payload) {
        await logoutAllDevices(payload.userId);
      }
    }
    await clearSessionCookie();
    return Response.json(apiSuccess({ message: "Logged out from all devices." }));
  } catch (error) {
    return handleApiError(error);
  }
}
