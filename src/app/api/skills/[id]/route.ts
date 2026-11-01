/* ================================================
   PUT /api/skills/[id] — Update user skill rating
   DELETE /api/skills/[id] — Remove user skill
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess, NotFoundError, AuthorizationError } from "@/lib/errors";
import { db } from "@/lib/db";
import { z } from "zod";
import { ValidationError } from "@/lib/errors";

const updateSkillSchema = z.object({
  selfRating: z.number().min(1).max(10).optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    const { id } = await params;
    const body = await request.json();

    const existing = await db.userSkill.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Skill record");
    if (existing.userId !== user.id) throw new AuthorizationError();

    const parsed = updateSkillSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path.join(".");
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      }
      throw new ValidationError(fieldErrors);
    }

    const updated = await db.userSkill.update({
      where: { id },
      data: {
        selfRating: parsed.data.selfRating,
      },
      include: {
        skill: {
          include: {
            category: { select: { name: true, slug: true } },
          },
        },
      },
    });

    // Record in history
    if (parsed.data.selfRating) {
      await db.skillScoreHistory.create({
        data: {
          userSkillId: id,
          source: "self",
          score: parsed.data.selfRating * 10,
        },
      });
    }

    return Response.json(apiSuccess(updated));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    const { id } = await params;

    const existing = await db.userSkill.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Skill record");
    if (existing.userId !== user.id) throw new AuthorizationError();

    await db.userSkill.delete({ where: { id } });

    return Response.json(apiSuccess({ message: "Skill removed." }));
  } catch (error) {
    return handleApiError(error);
  }
}
