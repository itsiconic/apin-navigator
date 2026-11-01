/* ================================================
   GET /api/interests — List user interests
   POST /api/interests — Add interest
   DELETE /api/interests/[id] — Remove interest (handled via query param)
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess } from "@/lib/errors";
import { db } from "@/lib/db";
import { interestSchema } from "@/validations/schemas";
import { ValidationError, NotFoundError, AuthorizationError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    const interests = await db.userInterest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(apiSuccess(interests));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const body = await request.json();

    // Support batch creation
    const items = Array.isArray(body) ? body : [body];
    const created = [];

    for (const item of items) {
      const parsed = interestSchema.safeParse(item);
      if (!parsed.success) {
        const fieldErrors: Record<string, string[]> = {};
        for (const issue of parsed.error.issues) {
          const field = issue.path.join(".");
          if (!fieldErrors[field]) fieldErrors[field] = [];
          fieldErrors[field].push(issue.message);
        }
        throw new ValidationError(fieldErrors);
      }

      const interest = await db.userInterest.create({
        data: {
          userId: user.id,
          name: parsed.data.name,
          category: parsed.data.category,
          examples: parsed.data.examples,
          isCustom: parsed.data.isCustom,
          intensity: parsed.data.intensity,
          careerRelevance: parsed.data.careerRelevance,
        },
      });
      created.push(interest);
    }

    return Response.json(apiSuccess(created), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      throw new NotFoundError("Interest ID");
    }

    const existing = await db.userInterest.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Interest");
    if (existing.userId !== user.id) throw new AuthorizationError();

    await db.userInterest.delete({ where: { id } });

    return Response.json(apiSuccess({ message: "Interest removed." }));
  } catch (error) {
    return handleApiError(error);
  }
}
