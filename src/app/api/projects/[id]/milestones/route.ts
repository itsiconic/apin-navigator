/* ================================================
   PATCH /api/projects/[id]/milestones — Toggle milestone completion
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess, NotFoundError } from "@/lib/errors";
import { db } from "@/lib/db";
import { z } from "zod";

const milestoneToggleSchema = z.object({
  milestoneId: z.string(),
  isCompleted: z.boolean(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    const { id } = await params;
    const body = await request.json();

    const { milestoneId, isCompleted } = milestoneToggleSchema.parse(body);

    const project = await db.userProject.findFirst({
      where: { id, userId: user.id },
      include: { milestones: true },
    });

    if (!project) {
      throw new NotFoundError("Project not found");
    }

    await db.projectMilestone.update({
      where: { id: milestoneId },
      data: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    // Recompute progress percentage
    const allMilestones = await db.projectMilestone.findMany({
      where: { userProjectId: project.id },
    });
    const completedCount = allMilestones.filter((m) => m.isCompleted).length;
    const milestoneProgress = (completedCount / allMilestones.length) * 80;
    const hoursFactor = Math.min((project.totalHoursLogged / 40) * 20, 20);
    const newProgress = Math.min(Math.round(milestoneProgress + hoursFactor), 100);

    const updated = await db.userProject.update({
      where: { id: project.id },
      data: {
        progressPercentage: newProgress,
        status: newProgress >= 100 ? "COMPLETED" : "IN_PROGRESS",
        completedAt: newProgress >= 100 ? new Date() : null,
      },
      include: {
        milestones: { orderBy: { sortOrder: "asc" } },
        dailyLogs: { orderBy: { logDate: "desc" }, take: 7 },
      },
    });

    return Response.json(apiSuccess(updated));
  } catch (error) {
    return handleApiError(error);
  }
}
