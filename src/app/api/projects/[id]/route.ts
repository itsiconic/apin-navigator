/* ================================================
   GET, PATCH, DELETE /api/projects/[id]
   Manage individual user project lifecycle & details
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess, NotFoundError, AuthorizationError } from "@/lib/errors";
import { db } from "@/lib/db";
import { z } from "zod";

const updateProjectSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "ON_HOLD", "ABANDONED"]).optional(),
  progressPercentage: z.number().min(0).max(100).optional(),
  repoUrl: z.string().url().or(z.literal("")).nullable().optional(),
  liveDemoUrl: z.string().url().or(z.literal("")).nullable().optional(),
  hardwareSpecs: z.string().nullable().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    const { id } = await params;

    const project = await db.userProject.findUnique({
      where: { id },
      include: {
        milestones: { orderBy: { sortOrder: "asc" } },
        dailyLogs: { orderBy: { logDate: "desc" } },
      },
    });

    if (!project) throw new NotFoundError("Project");
    if (project.userId !== user.id) throw new AuthorizationError();

    return Response.json(apiSuccess(project));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    const { id } = await params;
    const body = await request.json();

    const existing = await db.userProject.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Project");
    if (existing.userId !== user.id) throw new AuthorizationError();

    const parsed = updateProjectSchema.parse(body);

    const dataToUpdate: any = {};
    if (parsed.title !== undefined) dataToUpdate.title = parsed.title;
    if (parsed.description !== undefined) dataToUpdate.description = parsed.description;
    if (parsed.status !== undefined) {
      dataToUpdate.status = parsed.status;
      if (parsed.status === "COMPLETED" && existing.progressPercentage < 100) {
        dataToUpdate.progressPercentage = 100;
        dataToUpdate.completedAt = new Date();
      }
    }
    if (parsed.progressPercentage !== undefined) {
      dataToUpdate.progressPercentage = parsed.progressPercentage;
      if (parsed.progressPercentage === 100 && existing.status !== "COMPLETED") {
        dataToUpdate.status = "COMPLETED";
        dataToUpdate.completedAt = new Date();
      }
    }
    if (parsed.repoUrl !== undefined) dataToUpdate.repoUrl = parsed.repoUrl || null;
    if (parsed.liveDemoUrl !== undefined) dataToUpdate.liveDemoUrl = parsed.liveDemoUrl || null;
    if (parsed.hardwareSpecs !== undefined) dataToUpdate.hardwareSpecs = parsed.hardwareSpecs || null;

    const updated = await db.userProject.update({
      where: { id },
      data: dataToUpdate,
      include: {
        milestones: { orderBy: { sortOrder: "asc" } },
        dailyLogs: { orderBy: { logDate: "desc" } },
      },
    });

    return Response.json(apiSuccess(updated));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    const { id } = await params;

    const existing = await db.userProject.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Project");
    if (existing.userId !== user.id) throw new AuthorizationError();

    // Delete in transaction
    await db.$transaction(async (tx) => {
      await tx.projectMilestone.deleteMany({ where: { userProjectId: id } });
      await tx.projectDailyLog.deleteMany({ where: { userProjectId: id } });
      await tx.userProject.delete({ where: { id } });
    });

    return Response.json(apiSuccess({ message: "Project deleted successfully." }));
  } catch (error) {
    return handleApiError(error);
  }
}
