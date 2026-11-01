/* ================================================
   POST /api/assessments/[id]/submit — Grade assessment,
   update skill score & history, and return report
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess, NotFoundError, ValidationError } from "@/lib/errors";
import { db } from "@/lib/db";
import { z } from "zod";

const submitSchema = z.object({
  timeSpentSeconds: z.number().min(0),
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedOptionId: z.string().nullable().optional(),
    })
  ),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    const { id } = await params;
    const body = await request.json();

    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError({ body: ["Invalid submission data structure"] });
    }

    const { timeSpentSeconds, answers } = parsed.data;

    // Fetch assessment with complete questions and correct options
    const assessment = await db.assessment.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        skill: true,
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!assessment) {
      throw new NotFoundError("Assessment not found");
    }

    const answerMap = new Map<string, string | null>();
    for (const a of answers) {
      answerMap.set(a.questionId, a.selectedOptionId || null);
    }

    let totalPointsEarned = 0;
    let totalPointsPossible = 0;
    let totalCorrect = 0;

    // Category breakdown
    const categoryStats: Record<
      string,
      { earned: number; possible: number; correctCount: number; totalCount: number }
    > = {};

    const questionResults = assessment.questions.map((q) => {
      const correctOption = q.options.find((o) => o.isCorrect);
      const selectedOptionId = answerMap.get(q.id) || null;
      const isCorrect = !!(correctOption && selectedOptionId === correctOption.id);

      totalPointsPossible += q.points;
      if (isCorrect) {
        totalPointsEarned += q.points;
        totalCorrect += 1;
      }

      // Track category stats
      const cat = q.questionType;
      if (!categoryStats[cat]) {
        categoryStats[cat] = { earned: 0, possible: 0, correctCount: 0, totalCount: 0 };
      }
      categoryStats[cat].totalCount += 1;
      categoryStats[cat].possible += q.points;
      if (isCorrect) {
        categoryStats[cat].correctCount += 1;
        categoryStats[cat].earned += q.points;
      }

      return {
        questionId: q.id,
        questionText: q.questionText,
        codeSnippet: q.codeSnippet,
        category: q.questionType,
        difficulty: q.difficulty,
        points: q.points,
        explanation: q.explanation,
        selectedOptionId,
        correctOptionId: correctOption?.id || null,
        isCorrect,
        options: q.options.map((o) => ({
          id: o.id,
          optionText: o.optionText,
          codeSnippet: o.codeSnippet,
          isCorrect: o.isCorrect,
        })),
      };
    });

    const scorePercentage =
      totalPointsPossible > 0
        ? Math.round((totalPointsEarned / totalPointsPossible) * 100 * 10) / 10
        : 0;

    const passed = scorePercentage >= assessment.passingScore;

    // Convert categoryStats to percentages for radar charts
    const categoryScores: Record<string, number> = {};
    for (const [cat, stat] of Object.entries(categoryStats)) {
      categoryScores[cat] =
        stat.possible > 0
          ? Math.round((stat.earned / stat.possible) * 100 * 10) / 10
          : 0;
    }

    // Determine Skill Mastery Rating
    let masteryTier = "Novice";
    if (scorePercentage >= 90) masteryTier = "Superior Expert";
    else if (scorePercentage >= 80) masteryTier = "Advanced Practitioner";
    else if (scorePercentage >= 70) masteryTier = "Proficient";
    else if (scorePercentage >= 50) masteryTier = "Intermediate";

    // 1. Create AssessmentSubmission & UserAnswers in DB transaction
    const submission = await db.$transaction(async (tx) => {
      const sub = await tx.assessmentSubmission.create({
        data: {
          userId: user.id,
          assessmentId: assessment.id,
          score: scorePercentage,
          totalCorrect,
          totalQuestions: assessment.questions.length,
          passed,
          timeSpentSeconds,
          categoryScores,
          answers: {
            create: questionResults.map((qr) => ({
              questionId: qr.questionId,
              selectedOptionId: qr.selectedOptionId,
              isCorrect: qr.isCorrect,
            })),
          },
        },
      });

      // 2. Find or create UserSkill
      const existingUserSkill = await tx.userSkill.findUnique({
        where: {
          userId_skillId: {
            userId: user.id,
            skillId: assessment.skillId,
          },
        },
      });

      const selfRatingNorm = existingUserSkill?.selfRating
        ? existingUserSkill.selfRating * 10
        : scorePercentage;
      const projectEvidence = existingUserSkill?.projectEvidence ?? 50;

      // Weighted overall calculation: 50% Exam + 25% Self Rating + 25% Project Evidence
      const newOverallScore = Math.round(
        scorePercentage * 0.5 + selfRatingNorm * 0.25 + projectEvidence * 0.25
      );
      const confidence = 0.85;

      const userSkill = await tx.userSkill.upsert({
        where: {
          userId_skillId: {
            userId: user.id,
            skillId: assessment.skillId,
          },
        },
        update: {
          assessmentScore: scorePercentage,
          overallScore: newOverallScore,
          confidence,
        },
        create: {
          userId: user.id,
          skillId: assessment.skillId,
          selfRating: Math.round(scorePercentage / 10),
          assessmentScore: scorePercentage,
          overallScore: newOverallScore,
          confidence,
        },
      });

      // 3. Log to SkillScoreHistory
      await tx.skillScoreHistory.create({
        data: {
          userSkillId: userSkill.id,
          source: "assessment",
          score: scorePercentage,
          metadata: {
            assessmentId: assessment.id,
            assessmentTitle: assessment.title,
            submissionId: sub.id,
            passed,
            masteryTier,
            categoryScores,
          },
        },
      });

      return sub;
    });

    return Response.json(
      apiSuccess({
        submissionId: submission.id,
        assessmentTitle: assessment.title,
        skillName: assessment.skill.name,
        score: scorePercentage,
        totalCorrect,
        totalQuestions: assessment.questions.length,
        passed,
        passingScore: assessment.passingScore,
        timeSpentSeconds,
        masteryTier,
        categoryScores,
        questionResults,
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}
