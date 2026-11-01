/* ================================================
   POST /api/projects/[id]/logs — Record daily work update,
   calculate AI execution velocity & progress evaluation
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess, NotFoundError, ValidationError } from "@/lib/errors";
import { db } from "@/lib/db";
import { z } from "zod";

const dailyLogSchema = z.object({
  hoursSpent: z.number().min(0.25).max(24),
  tasksCompleted: z.string().min(5, "Please describe the tasks completed"),
  blockers: z.string().optional(),
  gitCommitSha: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    const { id } = await params;
    const body = await request.json();

    const parsed = dailyLogSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError({ body: ["Invalid daily log data format"] });
    }

    const { hoursSpent, tasksCompleted, blockers, gitCommitSha } = parsed.data;

    const project = await db.userProject.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        dailyLogs: { orderBy: { logDate: "desc" }, take: 14 },
        milestones: true,
      },
    });

    if (!project) {
      throw new NotFoundError("Project not found");
    }

    // AI Evaluation of velocity and execution pacing
    const completedWordCount = tasksCompleted.split(/\s+/).length;
    let velocityGain = Math.round((hoursSpent * 3.5 + Math.min(completedWordCount, 40) * 0.25) * 10) / 10;
    if (gitCommitSha) velocityGain += 5; // reward verifiable git commits

    let aiFeedback = `Strong execution velocity: Logged ${hoursSpent}h focused on implementation.`;
    if (blockers && blockers.trim().length > 0) {
      aiFeedback += ` Identified bottleneck: "${blockers.slice(0, 80)}...". Recommended next action: Break problem into unit-testable components.`;
    } else {
      aiFeedback += ` Consistent cadence maintained. Project execution is on track for target milestone completion.`;
    }

    // Calculate updated progress percentage (each milestone completed = base progress + hours progress)
    const completedMilestones = project.milestones.filter((m) => m.isCompleted).length;
    const milestoneProgress =
      project.milestones.length > 0
        ? (completedMilestones / project.milestones.length) * 80
        : 20;
    const newTotalHours = project.totalHoursLogged + hoursSpent;
    const hoursFactor = Math.min((newTotalHours / 40) * 20, 20);
    const newProgress = Math.min(Math.round(milestoneProgress + hoursFactor), 100);

    // Dynamic weekly velocity score
    const newVelocity = Math.round(project.velocityScore * 0.8 + velocityGain * 1.2);

    // Save daily log and update project in transaction
    const [log, updatedProject] = await db.$transaction([
      db.projectDailyLog.create({
        data: {
          userProjectId: project.id,
          hoursSpent,
          tasksCompleted,
          blockers: blockers || null,
          gitCommitSha: gitCommitSha || null,
          aiProgressFeedback: aiFeedback,
          velocityGain,
        },
      }),
      db.userProject.update({
        where: { id: project.id },
        data: {
          totalHoursLogged: newTotalHours,
          progressPercentage: newProgress,
          velocityScore: newVelocity,
          status: newProgress >= 100 ? "COMPLETED" : "IN_PROGRESS",
          completedAt: newProgress >= 100 ? new Date() : undefined,
        },
        include: {
          milestones: true,
          dailyLogs: { orderBy: { logDate: "desc" }, take: 10 },
        },
      }),
    ]);

    return Response.json(
      apiSuccess({
        log,
        project: updatedProject,
        velocityGain,
        aiFeedback,
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}
