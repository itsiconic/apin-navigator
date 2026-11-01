import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getAuthAdmin } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    await getAuthAdmin(request);

    const logs = await db.emailDeliveryLog.findMany({
      orderBy: { sentAt: "desc" },
      take: 50,
    });

    const totalSent = await db.emailDeliveryLog.count({ where: { status: "SENT" } });
    const totalFailed = await db.emailDeliveryLog.count({ where: { status: "FAILED" } });

    return Response.json(
      apiSuccess({
        logs,
        stats: {
          total: totalSent + totalFailed,
          sent: totalSent,
          failed: totalFailed,
          successRate:
            totalSent + totalFailed > 0
              ? Math.round((totalSent / (totalSent + totalFailed)) * 100)
              : 100,
        },
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}
