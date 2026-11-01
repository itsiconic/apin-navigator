import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getAuthAdmin } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    await getAuthAdmin(request);

    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        isVerified: true,
        isActive: true,
        isSuspended: true,
        role: true,
        lastLoginAt: true,
        createdAt: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            completionScore: true,
          },
        },
        _count: {
          select: {
            userProjects: true,
            userSkills: true,
            assessmentSubmissions: true,
          },
        },
      },
    });

    return Response.json(apiSuccess({ users }));
  } catch (error) {
    return handleApiError(error);
  }
}
