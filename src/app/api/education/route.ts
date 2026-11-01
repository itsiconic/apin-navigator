/* ================================================
   GET /api/education — List user's education records
   POST /api/education — Add education record
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess } from "@/lib/errors";
import { db } from "@/lib/db";
import { educationSchema } from "@/validations/schemas";
import { ValidationError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    const education = await db.education.findMany({
      where: { userId: user.id },
      orderBy: { startDate: "desc" },
    });

    return Response.json(apiSuccess(education));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const body = await request.json();

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

    const education = await db.education.create({
      data: {
        userId: user.id,
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

    return Response.json(apiSuccess(education), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
