/* ================================================
   GET /api/assessments/[id] — Retrieve an assessment
   and its questions for exam-taking (anti-cheat safe)
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess, NotFoundError } from "@/lib/errors";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await getAuthUser(request);
    const { id } = await params;

    const assessment = await db.assessment.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        skill: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            category: { select: { name: true, slug: true } },
          },
        },
        questions: {
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            questionText: true,
            codeSnippet: true,
            questionType: true,
            difficulty: true,
            points: true,
            sortOrder: true,
            options: {
              orderBy: { sortOrder: "asc" },
              select: {
                id: true,
                optionText: true,
                codeSnippet: true,
                sortOrder: true,
                // Notice: isCorrect is deliberately OMITTED during exam session to prevent client inspecting answers!
              },
            },
          },
        },
      },
    });

    if (!assessment) {
      throw new NotFoundError("Assessment not found");
    }

    return Response.json(apiSuccess(assessment));
  } catch (error) {
    return handleApiError(error);
  }
}
