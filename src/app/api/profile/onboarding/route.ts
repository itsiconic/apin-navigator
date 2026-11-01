/* ================================================
   POST /api/profile/onboarding — Update onboarding progress
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess } from "@/lib/errors";
import { db } from "@/lib/db";
import { z } from "zod";
import { ValidationError } from "@/lib/errors";

const onboardingSchema = z.object({
  step: z.number().min(0).max(7),
  complete: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const body = await request.json();

    const parsed = onboardingSchema.safeParse(body);
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
        onboardingStep: parsed.data.step,
        onboardingComplete: parsed.data.complete ?? false,
      },
      update: {
        onboardingStep: parsed.data.step,
        ...(parsed.data.complete !== undefined && {
          onboardingComplete: parsed.data.complete,
        }),
      },
    });

    return Response.json(apiSuccess(profile));
  } catch (error) {
    return handleApiError(error);
  }
}
