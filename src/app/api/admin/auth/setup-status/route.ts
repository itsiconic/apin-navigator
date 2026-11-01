import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess } from "@/lib/errors";

export async function GET() {
  const masterAdmin = await db.adminUser.findFirst({
    where: { OR: [{ isMaster: true }, { role: "SUPER_ADMIN" }] },
    orderBy: { createdAt: "asc" },
    select: { email: true, name: true },
  });

  const totalAdmins = await db.adminUser.count();

  return NextResponse.json(
    apiSuccess({
      hasMasterAdmin: totalAdmins > 0,
      masterAdminEmail: masterAdmin?.email || null,
      masterAdminName: masterAdmin?.name || null,
    })
  );
}
