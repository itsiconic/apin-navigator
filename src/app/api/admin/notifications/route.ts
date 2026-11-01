import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthAdmin } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    await getAuthAdmin(request);

    const notifications = await db.adminNotification.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = await db.adminNotification.count({
      where: { isRead: false },
    });

    return NextResponse.json(
      apiSuccess({
        notifications,
        unreadCount,
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await getAuthAdmin(request);
    await db.adminNotification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
    return NextResponse.json(apiSuccess({ message: "All notifications marked as read." }));
  } catch (error) {
    return handleApiError(error);
  }
}
