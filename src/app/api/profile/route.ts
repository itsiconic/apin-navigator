/* ================================================
   GET /api/profile — Get user profile
   PUT /api/profile — Update user profile
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess } from "@/lib/errors";
import { db } from "@/lib/db";
import { profileSchema } from "@/validations/schemas";
import { ValidationError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    const profile = await db.profile.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone: true,
            createdAt: true,
            education: { orderBy: { createdAt: "desc" } },
            careerGoals: { orderBy: { createdAt: "desc" } },
            interests: { orderBy: { createdAt: "desc" } },
            socialProfiles: { orderBy: { createdAt: "desc" } },
            userSkills: {
              include: {
                skill: true,
              },
              orderBy: { updatedAt: "desc" },
            },
          },
        },
      },
    });

    return Response.json(apiSuccess(profile));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const body = await request.json();

    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path.join(".");
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      }
      throw new ValidationError(fieldErrors);
    }

    const profile = await db.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        ...parsed.data,
        dateOfBirth: parsed.data.dateOfBirth
          ? new Date(parsed.data.dateOfBirth)
          : null,
      },
      update: {
        ...parsed.data,
        dateOfBirth: parsed.data.dateOfBirth
          ? new Date(parsed.data.dateOfBirth)
          : undefined,
      },
    });

    return Response.json(apiSuccess(profile));
  } catch (error) {
    return handleApiError(error);
  }
}
