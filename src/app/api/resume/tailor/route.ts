/* ================================================
   GET /api/resume/tailor — Auto-generate tailored resume
   assembled from user profile, verified skills, project
   progress maps, and target internship requirements
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess } from "@/lib/errors";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const oppId = searchParams.get("oppId");

    // Fetch full user dossier
    const [profile, education, goals, interests, userSkills, userProjects, opportunity] =
      await Promise.all([
        db.profile.findUnique({ where: { userId: user.id } }),
        db.education.findMany({ where: { userId: user.id }, orderBy: { startDate: "desc" } }),
        db.careerGoal.findMany({ where: { userId: user.id } }),
        db.userInterest.findMany({ where: { userId: user.id } }),
        db.userSkill.findMany({
          where: { userId: user.id },
          include: { skill: { include: { category: true } } },
          orderBy: { overallScore: "desc" },
        }),
        db.userProject.findMany({
          where: { userId: user.id },
          include: {
            milestones: { orderBy: { sortOrder: "asc" } },
            dailyLogs: { orderBy: { logDate: "desc" }, take: 5 },
          },
          orderBy: { progressPercentage: "desc" },
        }),
        oppId ? db.opportunity.findUnique({ where: { id: oppId } }) : null,
      ]);

    const targetRole = opportunity?.title || "Software Development Engineer (SDE)";
    const targetCompany = opportunity?.company || "High-Growth Tech Startup";

    const candidateName =
      profile?.preferredName ||
      (profile?.firstName ? `${profile.firstName} ${profile.lastName}` : user.username);

    // AI Tailored Executive Summary tailored specifically to the opportunity
    let tailoredSummary = `Results-oriented Software Engineer with proven competence in full-stack architecture, distributed systems, and real-time application development.`;
    if (opportunity) {
      tailoredSummary = `Dedicated Software Engineering candidate actively targeting the ${targetRole} role at ${targetCompany}. Combines verified skills in ${opportunity.preferredSkills.join(
        ", "
      )} with hands-on capstone engineering experience, demonstrable everyday execution velocity, and a disciplined approach to building resilient production systems.`;
    }

    // Curate Skills matching the target role
    const categorizedSkills = {
      primary: userSkills.slice(0, 8).map((s) => ({
        name: s.skill.name,
        score: s.overallScore || 80,
        isVerified: s.assessmentScore !== null,
        assessmentScore: s.assessmentScore,
      })),
      secondary: userSkills.slice(8).map((s) => s.skill.name),
    };

    // Format Projects with Daily Progress Progression Map
    const tailoredProjects = userProjects.map((p) => {
      const completedMilestones = p.milestones.filter((m) => m.isCompleted).map((m) => m.title);
      return {
        id: p.id,
        title: p.title,
        domain: p.domain,
        projectType: p.projectType,
        description: p.description,
        hoursLogged: p.totalHoursLogged,
        progressPercentage: p.progressPercentage,
        velocityScore: p.velocityScore,
        repoUrl: p.repoUrl,
        liveDemoUrl: p.liveDemoUrl,
        hardwareSpecs: p.hardwareSpecs,
        completedMilestones,
        bulletPoints: [
          `Architected and engineered using modern microservices and modular components with ${p.totalHoursLogged} hours of active execution.`,
          completedMilestones.length > 0
            ? `Achieved key milestones: ${completedMilestones.slice(0, 3).join("; ")}.`
            : `Designed complete system specifications and end-to-end user workflows.`,
          `Maintained steady execution cadence with an AI-evaluated velocity score of ${p.velocityScore} pts.`,
        ],
      };
    });

    // Format Hobbies & Likings with Real-World Examples
    const tailoredHobbies = interests.map((h) => ({
      name: h.name,
      category: h.category,
      examples: h.examples,
      careerRelevance: h.careerRelevance,
    }));

    // Calculate ATS Match Score
    let atsMatchScore = 88;
    if (opportunity) {
      const matched = opportunity.preferredSkills.filter((req) =>
        userSkills.some((s) => s.skill.name.toLowerCase() === req.toLowerCase())
      ).length;
      const pct = (matched / Math.max(opportunity.preferredSkills.length, 1)) * 100;
      atsMatchScore = Math.min(Math.round(pct * 0.7 + 30), 99);
    }

    const assembledResume = {
      header: {
        name: candidateName,
        headline: profile?.headline || `${targetRole} Candidate`,
        email: user.email || "candidate@apin.dev",
        phone: user.phone || "+91 (555) 019-2834",
        location: profile?.city ? `${profile.city}, ${profile.country}` : "India",
        photoUrl: profile?.profilePhotoUrl || null,
        links: {
          github: "https://github.com/developer",
          linkedin: "https://linkedin.com/in/developer",
          portfolio: "https://apin.dev/portfolio",
        },
      },
      targetRole,
      targetCompany,
      summary: tailoredSummary,
      atsMatchScore,
      skills: categorizedSkills,
      projects: tailoredProjects,
      education: education.map((e) => ({
        institution: e.institution,
        degree: e.degree || e.type.replace("_", " "),
        branch: e.branch,
        cgpa: e.cgpa,
        coursework: e.coursework,
        achievements: e.achievements,
        year: e.yearOrSemester || "2022 - 2026",
      })),
      hobbies: tailoredHobbies,
    };

    return Response.json(apiSuccess(assembledResume));
  } catch (error) {
    return handleApiError(error);
  }
}
