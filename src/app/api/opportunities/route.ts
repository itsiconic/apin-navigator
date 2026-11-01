/* ================================================
   GET /api/opportunities — List sourced internships & jobs
   with AI match scoring calculated against user profile,
   verified skills, and completed projects
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess } from "@/lib/errors";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const workMode = searchParams.get("workMode");
    const source = searchParams.get("source");
    const type = searchParams.get("type");

    let typeFilter = undefined;
    if (type && type !== "ALL") {
      if (type === "JOB" || type === "FULL_TIME") {
        typeFilter = { not: "INTERNSHIP" as any };
      } else {
        typeFilter = type as any;
      }
    }

    // Fetch user context for match scoring
    const [userSkills, userProjects, userApplications] = await Promise.all([
      db.userSkill.findMany({
        where: { userId: user.id },
        include: { skill: true },
      }),
      db.userProject.findMany({
        where: { userId: user.id },
        select: { title: true, domain: true, progressPercentage: true },
      }),
      db.userOpportunity.findMany({
        where: { userId: user.id },
      }),
    ]);

    const userSkillNames = new Set(userSkills.map((s) => s.skill.name.toLowerCase()));
    const appliedMap = new Map(userApplications.map((a) => [a.opportunityId, a]));

    const opportunities = await db.opportunity.findMany({
      where: {
        ...(workMode && workMode !== "ALL" ? { workMode: workMode as any } : {}),
        ...(source && source !== "ALL" ? { source } : {}),
        ...(typeFilter ? { type: typeFilter } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    const scored = opportunities.map((opp) => {
      // Calculate match percentage:
      // 1. Skill overlap (60% weight)
      const matchedSkills = opp.preferredSkills.filter((s) => userSkillNames.has(s.toLowerCase()));
      const skillScore = opp.preferredSkills.length > 0
        ? (matchedSkills.length / opp.preferredSkills.length) * 100
        : 70;

      // 2. Project relevance (40% weight)
      const hasRelatedProject = userProjects.some((p) => p.progressPercentage >= 40);
      const projectScore = hasRelatedProject ? 90 : 50;

      const matchScore = Math.min(Math.round(skillScore * 0.6 + projectScore * 0.4), 98);
      const userApp = appliedMap.get(opp.id);

      return {
        ...opp,
        matchScore: Math.max(matchScore, 40),
        matchedSkills,
        applicationStatus: userApp?.status || null,
        appliedAt: userApp?.appliedAt || null,
      };
    });

    // Sort by highest match score
    scored.sort((a, b) => b.matchScore - a.matchScore);

    return Response.json(apiSuccess(scored));
  } catch (error) {
    return handleApiError(error);
  }
}
