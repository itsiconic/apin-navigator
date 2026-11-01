/* ================================================
   GET /api/career-goals — List career goals
   POST /api/career-goals — Create career goal
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess } from "@/lib/errors";
import { db } from "@/lib/db";
import { careerGoalSchema } from "@/validations/schemas";
import { ValidationError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    const goals = await db.careerGoal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(apiSuccess(goals));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const body = await request.json();

    const parsed = careerGoalSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path.join(".");
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      }
      throw new ValidationError(fieldErrors);
    }

    const goal = await db.careerGoal.create({
      data: {
        userId: user.id,
        type: parsed.data.type,
        title: parsed.data.title,
        description: parsed.data.description,
        targetDate: parsed.data.targetDate
          ? new Date(parsed.data.targetDate)
          : null,
        isActive: parsed.data.isActive,
      },
    });

    return Response.json(apiSuccess(goal), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { success: false, error: { code: "NOT_FOUND", message: "Goal ID is required." } },
        { status: 400 }
      );
    }

    const goal = await db.careerGoal.findUnique({
      where: { id },
    });

    if (!goal || goal.userId !== user.id) {
      return Response.json(
        { success: false, error: { code: "NOT_FOUND", message: "Career goal not found." } },
        { status: 404 }
      );
    }

    await db.careerGoal.delete({
      where: { id },
    });

    return Response.json(apiSuccess({ message: "Career goal deleted successfully." }));
  } catch (error) {
    return handleApiError(error);
  }
}
