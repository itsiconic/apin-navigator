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
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    const updated = await db.user.update({
      where: { id },
      data: { isVerified: true },
      select: {
        id: true,
        username: true,
        email: true,
        isVerified: true,
      },
    });

    // Invalidate pending OTPs
    await db.otpVerification.updateMany({
      where: { userId: id, isUsed: false },
      data: { isUsed: true },
    });

    return Response.json(
      apiSuccess({
        message: `User ${updated.username} (${updated.email}) verified successfully by Administrator.`,
        user: updated,
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}
