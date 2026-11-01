/* ================================================
   GET /api/career/insights — 6-Dimensional Career
   Readiness Evaluator & Strategic Recommendations
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess } from "@/lib/errors";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    const [profile, skills, projects, opportunities, interests, education] = await Promise.all([
      db.profile.findUnique({ where: { userId: user.id } }),
      db.userSkill.findMany({ where: { userId: user.id }, include: { skill: true } }),
      db.userProject.findMany({ where: { userId: user.id }, include: { milestones: true, dailyLogs: true } }),
      db.userOpportunity.findMany({ where: { userId: user.id } }),
      db.userInterest.findMany({ where: { userId: user.id } }),
      db.education.findMany({ where: { userId: user.id } }),
    ]);

    // 1. Skill Depth (0 - 100)
    const testedCount = skills.filter((s) => s.assessmentScore !== null).length;
    const avgSkillScore =
      skills.length > 0
        ? skills.reduce((acc, s) => acc + (s.overallScore || 60), 0) / skills.length
        : 40;
    const skillDepth = Math.min(Math.round(avgSkillScore * 0.7 + testedCount * 10), 100);

    // 2. Project Breadth (0 - 100)
    const projectCount = projects.length;
    const hasHardwareOrHybrid = projects.some((p) => p.projectType !== "SOFTWARE");
    const projectBreadth = Math.min(
      Math.round(projectCount * 25 + (hasHardwareOrHybrid ? 20 : 0)),
      100
    );

    // 3. Execution Velocity (0 - 100)
    const totalHours = projects.reduce((acc, p) => acc + p.totalHoursLogged, 0);
    const avgVelocity =
      projects.length > 0
        ? projects.reduce((acc, p) => acc + p.velocityScore, 0) / projects.length
        : 20;
    const executionVelocity = Math.min(Math.round(totalHours * 1.5 + avgVelocity * 0.5), 100);

    // 4. Industry Alignment (0 - 100)
    const trackedOpps = opportunities.length;
    const industryAlignment = Math.min(Math.round(60 + trackedOpps * 8), 98);

    // 5. Practical Evidence (0 - 100)
    const reposCount = projects.filter((p) => p.repoUrl && p.repoUrl.length > 5).length;
    const commitsCount = projects.reduce(
      (acc, p) => acc + p.dailyLogs.filter((l) => l.gitCommitSha).length,
      0
    );
    const practicalEvidence = Math.min(Math.round(40 + reposCount * 20 + commitsCount * 8), 100);

    // 6. Maker Mindset & Hobbies (0 - 100)
    const hobbiesWithExamples = interests.filter((i) => i.examples && i.examples.length > 10).length;
    const makerMindset = Math.min(Math.round(50 + hobbiesWithExamples * 20), 100);

    // Overall Readiness Score
    const overallReadiness = Math.round(
      (skillDepth * 0.25 +
        projectBreadth * 0.2 +
        executionVelocity * 0.15 +
        industryAlignment * 0.15 +
        practicalEvidence * 0.15 +
        makerMindset * 0.1)
    );

    const dimensionScores = {
      skillDepth,
      projectBreadth,
      executionVelocity,
      industryAlignment,
      practicalEvidence,
      makerMindset,
    };

    // Strategic Recommendations
    const recommendations = [];
    if (testedCount < 2) {
      recommendations.push({
        priority: "HIGH",
        title: "Take Standardized Skill Assessment",
        description: "Clear the 30-question JavaScript or React exam to achieve verified status on recruiter screens.",
        actionUrl: "/dashboard/assessments",
        actionText: "Take Assessment",
      });
    }
    if (projects.length === 0) {
      recommendations.push({
        priority: "HIGH",
        title: "Adopt an AI Capstone Build",
        description: "Select an official SIH Hackathon challenge or Smart IoT project to establish your daily progress velocity.",
        actionUrl: "/dashboard/projects",
        actionText: "Explore Projects",
      });
    } else if (totalHours < 15) {
      recommendations.push({
        priority: "MEDIUM",
        title: "Log Daily Engineering Progress",
        description: "Record your daily hours and tasks on active projects to accelerate your execution velocity metric.",
        actionUrl: "/dashboard/projects",
        actionText: "Log Work Today",
      });
    }
    if (trackedOpps === 0) {
      recommendations.push({
        priority: "MEDIUM",
        title: "Match & Bookmark Sourced Internships",
        description: "Explore tech internships from Zepto, Razorpay, and Swiggy with high skill alignment.",
        actionUrl: "/dashboard/internships",
        actionText: "View Matched Internships",
      });
    }
    recommendations.push({
      priority: "LOW",
      title: "Generate Tailored PDF Resume",
      description: "Auto-compile your verified skills, project milestone progression, and education into an ATS resume.",
      actionUrl: "/dashboard/resume",
      actionText: "Build Tailored Resume",
    });

    const aiAnalysis = `Candidate demonstrates a balanced foundation with an overall Career Readiness Index of ${overallReadiness}%. Key strengths lie in ${
      skillDepth > 70 ? "validated technical skills" : "maker mindset and problem exploration"
    }. Focus on increasing verified exam credentials and maintaining daily project logging cadence to maximize top-tier internship placement.`;

    return Response.json(
      apiSuccess({
        overallReadiness,
        dimensionScores,
        recommendations,
        aiAnalysis,
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}
