import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getAuthAdmin } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess, NotFoundError } from "@/lib/errors";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await getAuthAdmin(request);
    const { id } = await params;

    const user = await db.user.findUnique({
      where: { id },
      select: { id: true, isSuspended: true, username: true },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    const updated = await db.user.update({
      where: { id },
      data: { isSuspended: !user.isSuspended },
      select: { id: true, username: true, isSuspended: true },
    });

    return Response.json(
      apiSuccess({
        message: `User ${updated.username} status updated to ${updated.isSuspended ? "Suspended" : "Active"}.`,
        user: updated,
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}
