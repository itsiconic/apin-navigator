/* ================================================
   PUT /api/education/[id] — Update education record
   DELETE /api/education/[id] — Delete education record
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess, NotFoundError, AuthorizationError } from "@/lib/errors";
import { db } from "@/lib/db";
import { educationSchema } from "@/validations/schemas";
import { ValidationError } from "@/lib/errors";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const existing = await db.education.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Education record");
    if (existing.userId !== user.id) throw new AuthorizationError();

    const parsed = educationSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path.join(".");
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      }
      throw new ValidationError(fieldErrors);
    }

    const updated = await db.education.update({
      where: { id },
      data: {
        type: parsed.data.type,
        institution: parsed.data.institution,
        degree: parsed.data.degree,
        branch: parsed.data.branch,
        specialization: parsed.data.specialization,
        board: parsed.data.board,
        startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
        isCurrent: parsed.data.isCurrent,
        yearOrSemester: parsed.data.yearOrSemester,
        cgpa: parsed.data.cgpa,
        percentage: parsed.data.percentage,
        coursework: parsed.data.coursework,
        achievements: parsed.data.achievements,
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

    const existing = await db.education.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Education record");
    if (existing.userId !== user.id) throw new AuthorizationError();

    await db.education.delete({ where: { id } });

    return Response.json(apiSuccess({ message: "Education record deleted." }));
  } catch (error) {
    return handleApiError(error);
  }
}
