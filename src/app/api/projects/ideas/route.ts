/* ================================================
   GET /api/projects/ideas — List curated project ideas
   with domain & SIH filters and AI recommendation matching
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess } from "@/lib/errors";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");
    const type = searchParams.get("type");
    const sihOnly = searchParams.get("sih") === "true";

    // Fetch user skills to compute match score
    const userSkills = await db.userSkill.findMany({
      where: { userId: user.id },
      include: { skill: true },
    });
    const userSkillNames = new Set(userSkills.map((s) => s.skill.name.toLowerCase()));

    const ideas = await db.projectIdea.findMany({
      where: {
        ...(domain && domain !== "ALL" ? { domain: domain as any } : {}),
        ...(type && type !== "ALL" ? { projectType: type as any } : {}),
        ...(sihOnly ? { isSihChallenge: true } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    // Score ideas by relevance to user's profile skills
    const scoredIdeas = ideas.map((idea) => {
      const matchCount = idea.techStack.filter((tech) =>
        userSkillNames.has(tech.toLowerCase())
      ).length;
      const matchPercentage =
        idea.techStack.length > 0
          ? Math.round((matchCount / idea.techStack.length) * 100)
          : 60;

      return {
        ...idea,
        matchPercentage: Math.max(matchPercentage, 45), // baseline relevance
      };
    });

    return Response.json(apiSuccess(scoredIdeas));
  } catch (error) {
    return handleApiError(error);
  }
}
