/* ================================================
   GET /api/projects — List user active and completed projects
   POST /api/projects — Start a new project or adopt an idea
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess, ValidationError } from "@/lib/errors";
import { db } from "@/lib/db";
import { z } from "zod";

const createProjectSchema = z.object({
  projectIdeaId: z.string().optional(),
  title: z.string().min(2, "Title is required").max(150),
  description: z.string().min(5, "Description is required"),
  domain: z.enum([
    "FULLSTACK",
    "BACKEND",
    "FRONTEND",
    "AI_ML",
    "HARDWARE_IOT",
    "CLOUD_DEVOPS",
    "CYBERSECURITY",
    "SIH_CHALLENGE",
  ]),
  projectType: z.enum(["SOFTWARE", "HARDWARE", "HYBRID"]),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]).default("INTERMEDIATE"),
  repoUrl: z.string().url().optional().or(z.literal("")),
  liveDemoUrl: z.string().url().optional().or(z.literal("")),
  hardwareSpecs: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    const projects = await db.userProject.findMany({
      where: { userId: user.id },
      include: {
        milestones: { orderBy: { sortOrder: "asc" } },
        dailyLogs: { orderBy: { logDate: "desc" }, take: 7 },
        projectIdea: { select: { techStack: true, tags: true, problemStatement: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return Response.json(apiSuccess(projects));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const body = await request.json();

    const parsed = createProjectSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path.join(".");
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      }
      throw new ValidationError(fieldErrors);
    }

    const { projectIdeaId, title, description, domain, projectType, difficulty, repoUrl, liveDemoUrl, hardwareSpecs } =
      parsed.data;

    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    // Create user project with starter milestones
    let starterMilestones = [
      { title: "Project Architecture & Requirements Spec", sortOrder: 1 },
      { title: "Core MVP Implementation", sortOrder: 2 },
      { title: "Testing, Edge Case Verification & Benchmarking", sortOrder: 3 },
      { title: "Deployment & Interactive Demonstration", sortOrder: 4 },
    ];

    if (projectIdeaId) {
      const idea = await db.projectIdea.findUnique({ where: { id: projectIdeaId } });
      if (idea?.starterMilestones && Array.isArray(idea.starterMilestones)) {
        starterMilestones = (idea.starterMilestones as any[]).map((m: any, idx: number) => ({
          title: m.title || `Milestone ${idx + 1}`,
          sortOrder: idx + 1,
        }));
      }
    }

    const project = await db.userProject.create({
      data: {
        userId: user.id,
        projectIdeaId: projectIdeaId || null,
        title,
        slug,
        description,
        domain,
        projectType,
        difficulty,
        status: "IN_PROGRESS",
        repoUrl: repoUrl || null,
        liveDemoUrl: liveDemoUrl || null,
        hardwareSpecs: hardwareSpecs || null,
        milestones: {
          create: starterMilestones,
        },
      },
      include: {
        milestones: true,
      },
    });

    return Response.json(apiSuccess(project), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
