/* ================================================
   POST /api/opportunities/[id]/apply — Track application status
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess, NotFoundError } from "@/lib/errors";
import { db } from "@/lib/db";
import { z } from "zod";

const applySchema = z.object({
  status: z.enum(["SAVED", "APPLIED", "INTERVIEWING", "OFFERED", "REJECTED"]),
  notes: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    const { id } = await params;
    const body = await request.json();

    const { status, notes } = applySchema.parse(body);

    const opp = await db.opportunity.findUnique({ where: { id } });
    if (!opp) throw new NotFoundError("Opportunity not found");

    const record = await db.userOpportunity.upsert({
      where: {
        userId_opportunityId: {
          userId: user.id,
          opportunityId: id,
        },
      },
      update: {
        status,
        notes: notes || undefined,
        appliedAt: status === "APPLIED" ? new Date() : undefined,
      },
      create: {
        userId: user.id,
        opportunityId: id,
        status,
        notes: notes || null,
        appliedAt: status === "APPLIED" ? new Date() : null,
      },
    });

    return Response.json(apiSuccess(record));
  } catch (error) {
    return handleApiError(error);
  }
}
