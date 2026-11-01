/* ================================================
   GET /api/skills — List all skills (taxonomy)
   GET /api/skills?userId=me — List user's skills
   POST /api/skills — Add user skill with self-rating
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess, AppError } from "@/lib/errors";
import { db } from "@/lib/db";
import { z } from "zod";
import { ValidationError } from "@/lib/errors";

const addSkillSchema = z.object({
  skillId: z.string().min(1, "Skill ID is required"),
  selfRating: z.number().min(1).max(10).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope");

    if (scope === "me") {
      // User's skills with ratings
      const user = await getAuthUser(request);
      const userSkills = await db.userSkill.findMany({
        where: { userId: user.id },
        include: {
          skill: {
            include: {
              category: { select: { name: true, slug: true, icon: true } },
              subskills: { select: { id: true, name: true, slug: true } },
            },
          },
          history: {
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      return Response.json(apiSuccess(userSkills));
    }

    // Full taxonomy
    const categories = await db.skillCategory.findMany({
      include: {
        skills: {
          include: {
            subskills: {
              orderBy: { sortOrder: "asc" },
            },
          },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    return Response.json(apiSuccess(categories));
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
    const results = [];

    for (const item of items) {
      const parsed = addSkillSchema.safeParse(item);
      if (!parsed.success) {
        const fieldErrors: Record<string, string[]> = {};
        for (const issue of parsed.error.issues) {
          const field = issue.path.join(".");
          if (!fieldErrors[field]) fieldErrors[field] = [];
          fieldErrors[field].push(issue.message);
        }
        throw new ValidationError(fieldErrors);
      }

      // Verify skill exists
      const skill = await db.skill.findUnique({
        where: { id: parsed.data.skillId },
      });
      if (!skill) {
        throw new AppError(`Skill not found: ${parsed.data.skillId}`, 404, "SKILL_NOT_FOUND");
      }

      // Upsert user skill
      const userSkill = await db.userSkill.upsert({
        where: {
          userId_skillId: {
            userId: user.id,
            skillId: parsed.data.skillId,
          },
        },
        create: {
          userId: user.id,
          skillId: parsed.data.skillId,
          selfRating: parsed.data.selfRating,
          overallScore: parsed.data.selfRating
            ? parsed.data.selfRating * 10
            : null,
          confidence: 0.2, // Low confidence for self-rating only
        },
        update: {
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
            userSkillId: userSkill.id,
            source: "self",
            score: parsed.data.selfRating * 10,
          },
        });
      }

      results.push(userSkill);
    }

    return Response.json(apiSuccess(results), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
