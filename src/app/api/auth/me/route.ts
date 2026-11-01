/* ================================================
   GET /api/auth/me
   Returns the current authenticated user.
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess } from "@/lib/errors";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);

    const user = await db.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        isVerified: true,
        createdAt: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            preferredName: true,
            profilePhotoUrl: true,
            headline: true,
            onboardingComplete: true,
            onboardingStep: true,
            completionScore: true,
          },
        },
      },
    });

    return Response.json(apiSuccess(user));
  } catch (error) {
    return handleApiError(error);
  }
}
