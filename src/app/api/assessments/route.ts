/* ================================================
   GET /api/assessments — List all skill assessments
   with user's submission history and stats
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess } from "@/lib/errors";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const skillSlug = searchParams.get("skill");

    const assessments = await db.assessment.findMany({
      where: skillSlug ? { skill: { slug: skillSlug } } : undefined,
      include: {
        skill: {
          select: {
            id: true,
            name: true,
            slug: true,
            category: { select: { name: true, slug: true } },
          },
        },
        submissions: {
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            score: true,
            passed: true,
            timeSpentSeconds: true,
            createdAt: true,
          },
        },
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Format assessment summary with user progress
    const formatted = assessments.map((a) => {
      const bestScore = a.submissions.length > 0
        ? Math.max(...a.submissions.map((s) => s.score))
        : null;
      const latestSubmission = a.submissions[0] || null;
      const hasPassed = a.submissions.some((s) => s.passed);

      return {
        id: a.id,
        title: a.title,
        slug: a.slug,
        description: a.description,
        durationMinutes: a.durationMinutes,
        totalQuestions: a._count.questions,
        passingScore: a.passingScore,
        difficulty: a.difficulty,
        skill: a.skill,
        attemptsCount: a.submissions.length,
        bestScore,
        hasPassed,
        latestSubmission,
      };
    });

    return Response.json(apiSuccess(formatted));
  } catch (error) {
    return handleApiError(error);
  }
}
